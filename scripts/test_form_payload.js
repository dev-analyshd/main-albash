#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

;(async () => {
  try {
    const testUserId = '584edb37-f21d-49ec-995e-b99ec145287e'

    // Simulate the exact payload from the frontend form
    const frontendPayload = {
      title: "Test Product",
      description: "A test product description",
      price: "150.50",  // Frontend sends string
      currency: "NGN",
      category_id: null,
      listing_type: "physical",
      is_tokenized: false,
      swap_enabled: true,
      accepted_swap_types: ["idea", "talent", "product"],
      valuation_method: "fixed",
      minimum_reputation: 10,
      swap_verification_required: true,
      images: [],
      // Frontend also includes metadata
      metadata: {
        currency: "NGN",
        payment_methods: ["card", "bank"],
      },
    }

    console.log('Testing frontend payload structure...\n')
    console.log('Payload:', JSON.stringify(frontendPayload, null, 2))

    const res = await fetch('http://127.0.0.1:3000/api/listings', {
      method: 'POST',
      headers: {
        'x-dev-user-id': testUserId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendPayload),
    })

    console.log('\nStatus:', res.status)
    const responseText = await res.text()
    console.log('Response:', responseText)

    if (res.status === 200) {
      const data = JSON.parse(responseText)
      console.log('\n✓ Listing payload accepted')
      console.log('\nReturned fields:')
      if (data.data) {
        Object.keys(data.data).forEach(key => {
          console.log(`  ${key}: ${typeof data.data[key] === 'object' ? JSON.stringify(data.data[key]) : data.data[key]}`)
        })
      }
    } else {
      console.log('\n✗ Failed')
    }
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
})()
