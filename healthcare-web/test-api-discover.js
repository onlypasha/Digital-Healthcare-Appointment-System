// Test API with capital letter endpoints
const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

async function testEndpoint(path, method = 'GET', body = null) {
  try {
    const opts = {
      method,
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}${path}`, opts);
    const text = await res.text();
    let displayText = '';
    if (res.status !== 404 && res.status !== 401 && text.length > 0) {
      displayText = ` | ${text.substring(0, 150)}`;
    }
    console.log(`${method.padEnd(6)} ${path.padEnd(35)} -> ${res.status}${displayText}`);
  } catch (err) {
    console.log(`${method.padEnd(6)} ${path.padEnd(35)} -> ERROR: ${err.message}`);
  }
}

async function runTests() {
  console.log('Discovering available API endpoints...\n');

  // Test capital letter endpoints
  const capEndpoints = [
    '/api/Doctor',
    '/api/Doctors',
    '/api/Patient', 
    '/api/Patients',
    '/api/Appointment',
    '/api/Appointments',
    '/api/Health',
    '/api/Auth/Login',
    '/api/Auth/Register',
  ];

  console.log('Testing GET requests (without auth):');
  for (const path of capEndpoints) {
    await testEndpoint(path, 'GET');
  }

  // Test with dummy token to see what happens
  console.log('\n\nTesting GET with Bearer token:');
  const opts = {
    method: 'GET',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dummy-token',
    },
  };

  for (const path of capEndpoints) {
    try {
      const res = await fetch(`${API_URL}${path}`, opts);
      const text = await res.text();
      let displayText = '';
      if (res.status !== 404 && text.length > 0 && text.length < 300) {
        displayText = ` | ${text.substring(0, 150)}`;
      }
      console.log(`GET    ${path.padEnd(35)} -> ${res.status}${displayText}`);
    } catch (err) {
      console.log(`GET    ${path.padEnd(35)} -> ERROR`);
    }
  }

  // Also test if /api/auth/register exists
  console.log('\n\nTesting registration endpoint:');
  await testEndpoint('/api/auth/login', 'POST', {
    email: 'newuser@test.com',
    password: 'newpass123',
    name: 'New User',
  });

  await testEndpoint('/api/Auth/Register', 'POST', {
    email: 'newuser@test.com',
    password: 'newpass123',
    name: 'New User',
  });

  await testEndpoint('/api/auth/register', 'POST', {
    email: 'newuser@test.com',
    password: 'newpass123',
    name: 'New User',
  });
}

runTests();
