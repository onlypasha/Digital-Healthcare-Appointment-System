const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

const actions = ['cancel', 'confirm', 'complete', 'status', 'reschedule', 'accept', 'reject'];

async function run() {
  for (const action of actions) {
    try {
      const res = await fetch(`${API_URL}/api/Appointment/1/${action}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy',
        },
      });
      console.log(`PUT /api/Appointment/1/${action} -> Status ${res.status}`);
    } catch (e) {}
  }
}

run();
