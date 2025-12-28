require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Supabase env vars missing')
  process.exit(1)
}

const supabase = createClient(url, key)

;(async () => {
  try {
    const { count, error: countErr } = await supabase
      .from('verification_requests')
      .select('*', { count: 'exact', head: true })

    if (countErr) {
      console.error('Error counting verification_requests:', countErr)
      process.exit(1)
    }

    console.log('Total verification_requests count:', count)

    const { data, error } = await supabase
      .from('verification_requests')
      .select('*, profiles:profiles!verification_requests_user_id_fkey(full_name,email,avatar_url)')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching verification requests:', error)
      process.exit(1)
    }

    console.log('Sample rows returned:', (data || []).length)
    ;(data || []).forEach((r, i) => {
      console.log(`${i + 1}. id=${r.id} user_id=${r.user_id} status=${r.status} created_at=${r.created_at} profile_email=${r.profiles?.email || 'N/A'}`)
    })

    process.exit(0)
  } catch (e) {
    console.error('Script error:', e)
    process.exit(1)
  }
})()
