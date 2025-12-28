require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { randomUUID } = require('crypto')

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Prefer service role key for test operations that require bypassing RLS.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('Supabase env vars missing')
    process.exit(1)
  }

  const supabase = createClient(url, key)
  console.log('Using service role key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  let adminId = randomUUID()
  let userId = randomUUID()

  try {
    console.log('Creating admin profile...')
    // If a profile already exists for the admin email, reuse it; otherwise create auth user + profile
    const { data: existingAdminProfile } = await supabase.from('profiles').select('id').eq('email', 'test-admin@example.com').limit(1).single()
    if (existingAdminProfile && existingAdminProfile.id) {
      console.log('Found existing admin profile, reusing id:', existingAdminProfile.id)
      adminId = existingAdminProfile.id
    } else {
      const { data: createdAdminUser, error: createAdminUserErr } = await supabase.auth.admin.createUser({
        id: adminId,
        email: 'test-admin@example.com',
        password: 'AdminPass!23',
        user_metadata: { full_name: 'Test Admin', role: 'admin' }
      })
      if (createAdminUserErr) {
        console.error('Error creating admin auth user:', createAdminUserErr)
        process.exit(1)
      }

      const { data: adminData, error: adminErr } = await supabase.from('profiles').insert([{
        id: adminId,
        email: 'test-admin@example.com',
        full_name: 'Test Admin',
        role: 'admin',
        is_verified: true,
        verification_status: 'VERIFIED',
        reputation_score: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]).select()
      if (adminErr) {
        console.error('Error inserting admin profile:', adminErr)
        process.exit(1)
      }
      console.log('Admin insert result:', adminData?.length || 0)
    }

    console.log('Creating test user profile...')
    const { data: existingUserProfile } = await supabase.from('profiles').select('id').eq('email', 'test-user@example.com').limit(1).single()
    if (existingUserProfile && existingUserProfile.id) {
      console.log('Found existing test user profile, reusing id:', existingUserProfile.id)
      userId = existingUserProfile.id
    } else {
      // Create auth user for test user
      const { data: createdTestUser, error: createTestUserErr } = await supabase.auth.admin.createUser({
        id: userId,
        email: 'test-user@example.com',
        password: 'UserPass!23',
        user_metadata: { full_name: 'Test User', role: 'user' }
      })
      if (createTestUserErr) {
        console.error('Error creating test auth user:', createTestUserErr)
        // Try to recover by looking up an existing profile by email
        const { data: fallbackProfile } = await supabase.from('profiles').select('id').eq('email', 'test-user@example.com').limit(1).single()
        if (fallbackProfile && fallbackProfile.id) {
          console.log('Found existing profile after createUser error, reusing id:', fallbackProfile.id)
          userId = fallbackProfile.id
        } else {
          console.log('No profile found by test email; trying to reuse any non-admin profile')
          const { data: anyUser } = await supabase.from('profiles').select('id,email,role').neq('role','admin').limit(1).single()
          if (anyUser && anyUser.id) {
            console.log('Reusing existing non-admin profile:', anyUser.email)
            userId = anyUser.id
          } else {
            process.exit(1)
          }
        }
      } else {
        const { data: userData, error: userErr } = await supabase.from('profiles').insert([{
          id: userId,
          email: 'test-user@example.com',
          full_name: 'Test User',
          role: 'user',
          is_verified: false,
          verification_status: 'AUTHENTICATED_UNVERIFIED',
          reputation_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]).select()
        if (userErr) {
          console.error('Error inserting test user profile:', userErr)
          process.exit(1)
        }
        console.log('User insert result:', userData?.length || 0)
      }
    }

    console.log('Submitting verification request...')
    const { data: request, error: insertErr } = await supabase.from('verification_requests').insert({
      user_id: userId,
      verification_type: 'builder',
      status: 'pending',
      form_data: { fullName: 'Test User' },
      documents: [],
    }).select().single()

    if (insertErr) {
      console.error('Error inserting verification request:', insertErr)
      process.exit(1)
    }

    console.log('Inserted request:', request.id)

    console.log('Approving verification request as admin...')
    const { error: updateErr } = await supabase.from('verification_requests').update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString()
    }).eq('id', request.id)

    if (updateErr) {
      console.error('Error updating verification request:', updateErr)
      process.exit(1)
    }

    console.log('Fetching updated profile...')
    const { data: profile, error: profileErr } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (profileErr) {
      console.error('Error fetching profile:', profileErr)
      process.exit(1)
    }

    console.log('Profile after approval:')
    console.log({ id: profile.id, is_verified: profile.is_verified, verification_status: profile.verification_status, role: profile.role, reputation_score: profile.reputation_score })

    // Fetch verification_records and reputation_logs
    const { data: records } = await supabase.from('verification_records').select('*').eq('application_id', request.id)
    console.log('Verification records (related):', records?.length || 0)

    const { data: repLogs } = await supabase.from('reputation_logs').select('*').eq('user_id', userId)
    console.log('Reputation logs for user:', repLogs?.length || 0)

    console.log('Done')
  } catch (err) {
    console.error('Test flow error:', err)
    process.exit(1)
  }
}

run()
