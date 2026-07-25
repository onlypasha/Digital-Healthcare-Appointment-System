const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

async function probeUrl(path) {
  console.log(`\n--- Probing ${path} ---`);
  for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']) {
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
        console.log(`${method.padEnd(6)} ${path} -> Status ${res.status} ${allow ? 'Allow: ' + allow : ''}`);
      } else {
        console.log(`${method.padEnd(6)} ${path} -> 404`);
      }
    } catch (e) {}
  }
}

async function run() {
  await probeUrl('/api/Appointment/1');
  await probeUrl('/api/Appointment/1/cancel');
  await probeUrl('/api/MedicalRecord/1');
  await probeUrl('/api/Doctor/1');
}

run();
