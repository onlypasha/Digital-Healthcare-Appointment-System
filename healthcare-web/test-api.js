// Test API endpoints
const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

async function testLogin() {
  console.log('Testing login...');
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
    try {
      console.log('JSON:', JSON.parse(text));
    } catch (e) {}
  } catch (err) {
    console.error('Error:', err.message);
  }
}

async function testEndpoints() {
  const endpoints = ['/api', '/api/auth', '/api/doctors', '/api/patients'];
  
  for (const endpoint of endpoints) {
    console.log(`\nTesting ${endpoint}...`);
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Response:', text.substring(0, 200));
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

testLogin().then(() => testEndpoints());
