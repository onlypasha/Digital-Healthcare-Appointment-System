const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

const endpoints = [
  // Auth
  ['POST', '/api/auth/login'],
  ['POST', '/api/Auth/Login'],
  ['POST', '/api/auth/register'],
  ['POST', '/api/Auth/Register'],
  ['POST', '/api/Account/Register'],
  ['POST', '/api/account/register'],
  ['POST', '/api/Register'],
  ['POST', '/api/register'],
  ['POST', '/api/signup'],
  ['POST', '/api/auth/signup'],
  ['POST', '/api/User/Register'],
  ['POST', '/api/Users/Register'],
  
  // Resources
  ['GET', '/api/Doctor'],
  ['GET', '/api/Doctor/1'],
  ['GET', '/api/Patient'],
  ['GET', '/api/Patients'],
  ['GET', '/api/Patient/1'],
  ['GET', '/api/Appointment'],
  ['GET', '/api/Appointment/1'],
  ['GET', '/api/HealthRecord'],
  ['GET', '/api/HealthRecords'],
  ['GET', '/api/MedicalRecord'],
  ['GET', '/api/MedicalRecords'],
  ['GET', '/api/Record'],
  ['GET', '/api/Records'],
  ['GET', '/api/User'],
  ['GET', '/api/Users'],
  ['GET', '/api/Profile'],
  ['GET', '/api/Settings'],
  ['GET', '/api/swagger/index.html'],
  ['GET', '/swagger/index.html'],
  ['GET', '/swagger/v1/swagger.json'],
  ['GET', '/api-docs'],
  ['GET', '/openapi.json'],
];

async function run() {
  console.log('Testing endpoint list...\n');
  for (const [method, path] of endpoints) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });
      const text = await res.text();
      const summary = text.length > 0 && text.length < 200 ? text : `(length ${text.length})`;
      if (res.status !== 404) {
        console.log(`✅ [${res.status}] ${method} ${path} -> ${summary.replace(/\n/g, ' ')}`);
      } else {
        console.log(`❌ [404] ${method} ${path}`);
      }
    } catch (e) {
      console.log(`⚠️ Error ${method} ${path}: ${e.message}`);
    }
  }
}

run();
