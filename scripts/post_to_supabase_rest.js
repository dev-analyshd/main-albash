const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

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
      console.error('.env.local missing SUPABASE config')
      process.exit(1)
    }

    // Test via the local Next.js API endpoint with dev bypass header
    const devUserId = '584edb37-f21d-49ec-995e-b99ec145287e' // Placeholder UUID for dev testing
    const testListingUrl = 'http://127.0.0.1:3000/api/listings'

    const listingPayload = { 
      title: 'Test Listing Dev', 
      description: 'Created via dev bypass', 
      price: 1, 
      listingType: 'physical', 
      categoryId: null, 
      images: [], 
      isTokenized: false 
    }

    const res = await fetch(testListingUrl, {
      method: 'POST',
      headers: {
        'x-dev-user-id': devUserId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingPayload),
    })

    console.log('Status', res.status)
    const text = await res.text()
    console.log(text)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
