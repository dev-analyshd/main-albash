(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Listing Node', description: 'From Node', price: 1, listingType: 'physical', categoryId: null, images: [] }),
    })
    const text = await res.text()
    console.log('Status', res.status)
    console.log(text)
  } catch (err) {
    console.error('Request failed:', err)
    process.exit(1)
  }
})()
