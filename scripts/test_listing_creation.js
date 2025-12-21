#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function readEnv(file) {
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)
  const env = {}
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/)
    if (m) {
      let val = m[2]
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      env[m[1]] = val
    }
  }
  return env
}

;(async () => {
  try {
    const envFile = path.resolve(__dirname, '..', '.env.local')
    const env = readEnv(envFile)
    
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !anonKey) {
      console.error('Missing Supabase config')
      process.exit(1)
    }

    // Step 1: Create a test listing directly in Supabase using the anon key
    const testUserId = '584edb37-f21d-49ec-995e-b99ec145287e'
    const testListingPayload = {
      user_id: testUserId,
      title: 'Test Listing (Direct REST)',
      description: 'Created via direct Supabase REST API',
      price: 100,
      listing_type: 'physical',
      category_id: null,
      images: [],
      is_tokenized: false,
      is_verified: false,
    }

    // Try the local API first (with dev bypass header)
    console.log('Attempting POST via local /api/listings with dev header...')
    let res = await fetch('http://127.0.0.1:3000/api/listings', {
      method: 'POST',
      headers: {
        'x-dev-user-id': testUserId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: testListingPayload.title,
        description: testListingPayload.description,
        price: testListingPayload.price,
        listingType: testListingPayload.listing_type,
        categoryId: testListingPayload.category_id,
        images: testListingPayload.images,
        isTokenized: testListingPayload.is_tokenized,
      }),
    })

    console.log('Status:', res.status)
    const responseText = await res.text()
    console.log('Response:', responseText)

    if (res.status === 200) {
      console.log('\n✓ Listing created successfully!')
      process.exit(0)
    } else {
      console.log('\n✗ Failed to create listing')
      process.exit(1)
    }
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
})()
