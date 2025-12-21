#!/usr/bin/env node

/**
 * Payment System Test Suite
 * Tests all payment endpoints and utilities
 */

const BASE_URL = 'http://localhost:3000'

const results = []

async function test(name, fn) {
  const start = Date.now()
  try {
    await fn()
    results.push({
      name,
      passed: true,
      duration: Date.now() - start,
    })
    console.log(`✓ ${name}`)
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: String(error),
      duration: Date.now() - start,
    })
    console.log(`✗ ${name}`)
    console.log(`  Error: ${String(error)}`)
  }
}

async function runTests() {
  console.log('🧪 Payment System Test Suite\n')

  // Test API endpoints
  console.log('Testing Payment API Endpoints...\n')

  test('GET /api/payments/methods - Should return payment methods', async () => {
    const response = await fetch(`${BASE_URL}/api/payments/methods`)
    if (!response.ok) throw new Error(`Status ${response.status}`)
    const data = await response.json()
    if (!data.success) throw new Error('API returned failure')
    console.log(`  Found ${data.count} payment methods`)
  })

  test('GET /api/payments/transactions - Should return transactions', async () => {
    const response = await fetch(`${BASE_URL}/api/payments/transactions?limit=10`)
    if (!response.ok) throw new Error(`Status ${response.status}`)
    const data = await response.json()
    if (!data.success) throw new Error('API returned failure')
    console.log(`  Found ${data.count} transactions`)
  })

  test('GET /api/payments/withdraw - Should return withdrawals', async () => {
    const response = await fetch(`${BASE_URL}/api/payments/withdraw`)
    if (!response.ok) throw new Error(`Status ${response.status}`)
    const data = await response.json()
    if (!data.success) throw new Error('API returned failure')
    console.log(`  Found ${data.count} withdrawals`)
  })

  // Test payment utilities
  console.log('\nTesting Payment Utilities...\n')

  test('Payment utility: formatCurrency', async () => {
    const { formatCurrency } = await import('../lib/payments/payment-utils.js')
    const formatted = formatCurrency(1234.56, 'USD')
    if (formatted !== '$1,234.56') throw new Error(`Expected $1,234.56, got ${formatted}`)
  })

  test('Payment utility: validateCardNumber', async () => {
    const { validateCardNumber } = await import('../lib/payments/payment-utils.js')
    // Test valid card number (4532 1234 5678 9010)
    const valid = validateCardNumber('4532123456789010')
    if (!valid) throw new Error('Valid card number failed validation')
    // Test invalid card
    const invalid = validateCardNumber('1234567890123456')
    if (invalid) throw new Error('Invalid card number passed validation')
  })

  test('Payment utility: maskCardNumber', async () => {
    const { maskCardNumber } = await import('../lib/payments/payment-utils.js')
    const masked = maskCardNumber('4532123456789010')
    if (masked !== '•••• •••• •••• 9010') throw new Error(`Unexpected masked format: ${masked}`)
  })

  test('Payment utility: calculateFee', async () => {
    const { calculateFee } = await import('../lib/payments/payment-utils.js')
    const { fee, total } = calculateFee(100, 'card', 'USD')
    if (typeof fee !== 'number' || fee < 0) throw new Error('Invalid fee calculation')
    if (total !== 100 + fee) throw new Error('Invalid total calculation')
    console.log(`  Fee: $${fee.toFixed(2)}, Total: $${total.toFixed(2)}`)
  })

  test('Payment utility: detectCardType', async () => {
    const { detectCardType } = await import('../lib/payments/payment-utils.js')
    const visa = detectCardType('4532123456789010')
    if (visa !== 'Visa') throw new Error(`Expected Visa, got ${visa}`)
  })

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('Test Summary')
  console.log('='.repeat(50))

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`\nTotal Tests: ${results.length}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Total Duration: ${totalDuration}ms`)

  if (failed > 0) {
    console.log('\nFailed Tests:')
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}`)
        console.log(`    ${r.error}`)
      })
  }

  console.log('\n' + '='.repeat(50))

  return failed === 0
}

runTests()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Test suite error:', error)
    process.exit(1)
  })
