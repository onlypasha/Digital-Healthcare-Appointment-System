async function testRegister() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pasien Baruku',
        email: `testpatient${Date.now()}@test.com`,
        password: 'password123',
        role: 'patient',
        phone: '081299998888',
        gender: 'male',
      }),
    });
    console.log('Register Status:', res.status);
    const data = await res.json();
    console.log('Register Response:', data);
  } catch (err) {
    console.error('Error testing register:', err.message);
  }
}

testRegister();
