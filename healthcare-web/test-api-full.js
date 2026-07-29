// Test API endpoints with various paths
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
    const statusText = res.statusText || `Status ${res.status}`;
    console.log(`${method.padEnd(6)} ${path.padEnd(40)} -> ${res.status} ${statusText}`);
    if (res.status !== 404 && text.length < 200) {
      console.log(`        Response: ${text.substring(0, 150)}`);
    }
  } catch (err) {
    console.log(`${method.padEnd(6)} ${path.padEnd(40)} -> ERROR: ${err.message}`);
  }
}

async function runTests() {
  console.log('Testing various endpoint paths...\n');

  // Test different path variations
  const paths = [
    // Capital first letter
    '/Doctor',
    '/Patient',
    '/Appointment',
    '/Auth',
    '/Health',
    
    // With /api prefix, capital
    '/api/Doctor',
    '/api/Patient',
    '/api/Appointment',
    '/api/Auth',
    
    // Original lowercase with /api
    '/api/auth',
    '/api/doctors',
    '/api/patients',
    '/api/appointments',
    
    // Without /api prefix
    '/doctors',
    '/patients',
    '/appointments',
    
    // Auth endpoints
    '/api/auth/login',
    '/Auth/Login',
    '/auth/login',
    
    // Swagger/docs
    '/swagger',
    '/swagger/ui',
    '/api/swagger',
    '/openapi.json',
  ];

  for (const path of paths) {
    await testEndpoint(path);
  }

  // Test POST to login with various credentials
  console.log('\n\nTesting login with different credentials...\n');
  const credentials = [
    { email: 'admin@health.com', password: 'admin123' },
    { email: 'patient@care.com', password: 'patient123' },
    { email: 'sarah@care.com', password: 'doctor123' },
    { email: 'test', password: 'test' },
  ];

  for (const cred of credentials) {
    console.log(`\nTesting ${cred.email}...`);
    await testEndpoint('/api/auth/login', 'POST', cred);
  }
}

runTests();
