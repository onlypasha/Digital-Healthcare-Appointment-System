const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

async function probeMethods(path) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  console.log(`\n--- Probing ${path} ---`);
  for (const method of methods) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy',
        },
      });
      const allowHeader = res.headers.get('Allow');
      const text = await res.text();
      const snippet = text.substring(0, 100).replace(/\n/g, ' ');
      console.log(`${method.padEnd(8)} -> Status ${res.status}${allowHeader ? ' Allow: ' + allowHeader : ''} ${snippet}`);
    } catch (e) {
      console.log(`${method.padEnd(8)} -> Error: ${e.message}`);
    }
  }
}

async function run() {
  await probeMethods('/api/MedicalRecord');
  await probeMethods('/api/Doctor');
  await probeMethods('/api/Appointment');
  await probeMethods('/api/auth/login');
}

run();
