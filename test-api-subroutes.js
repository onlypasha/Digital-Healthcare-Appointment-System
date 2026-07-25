const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

const subroutes = [
  // Auth
  ['POST', '/api/auth/login'],
  ['GET', '/api/auth/me'],
  ['GET', '/api/auth/profile'],
  ['POST', '/api/auth/refresh'],
  ['POST', '/api/auth/logout'],
  ['POST', '/api/auth/register'],

  // Doctor
  ['GET', '/api/Doctor'],
  ['GET', '/api/Doctor/1'],
  ['GET', '/api/Doctor/list'],
  ['GET', '/api/Doctor/all'],

  // Appointment
  ['GET', '/api/Appointment'],
  ['POST', '/api/Appointment'],
  ['GET', '/api/Appointment/1'],
  ['PATCH', '/api/Appointment/1'],
  ['PUT', '/api/Appointment/1'],
  ['DELETE', '/api/Appointment/1'],
  ['POST', '/api/Appointment/1/cancel'],
  ['POST', '/api/Appointment/cancel'],
  ['PATCH', '/api/Appointment/status'],
  ['PUT', '/api/Appointment/status'],

  // MedicalRecord
  ['GET', '/api/MedicalRecord'],
  ['POST', '/api/MedicalRecord'],
  ['GET', '/api/MedicalRecord/1'],
  ['GET', '/api/MedicalRecord/patient/1'],
  ['GET', '/api/MedicalRecord/doctor/1'],
];

async function run() {
  console.log('Testing sub-routes...\n');
  for (const [method, path] of subroutes) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token',
        },
      });
      if (res.status !== 404) {
        const allow = res.headers.get('Allow') ?? '';
        console.log(`FOUND: [${method.padEnd(6)}] ${path.padEnd(35)} -> Status ${res.status} ${allow ? 'Allow: ' + allow : ''}`);
      }
    } catch (e) {}
  }
}

run();
