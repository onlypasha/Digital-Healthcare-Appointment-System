const API_URL = 'https://perky-drastic-gleeful.ngrok-free.dev';

const words = [
  'Doctor', 'Doctors', 'Patient', 'Patients', 'Appointment', 'Appointments',
  'MedicalRecord', 'MedicalRecords', 'HealthRecord', 'HealthRecords', 'Record', 'Records',
  'User', 'Users', 'Account', 'Accounts', 'Profile', 'Profiles',
  'Auth', 'Authentication', 'Login', 'Register', 'Signup',
  'Prescription', 'Prescriptions', 'Medicine', 'Medicines',
  'Department', 'Departments', 'Specialty', 'Specialties',
  'Schedule', 'Schedules', 'Slot', 'Slots',
  'Notification', 'Notifications', 'Setting', 'Settings',
  'Role', 'Roles', 'Admin', 'Dashboard', 'Stats', 'Statistics',
  'Bill', 'Billing', 'Payment', 'Payments', 'Invoice', 'Invoices'
];

async function checkRoute(word) {
  for (const method of ['GET', 'POST']) {
    try {
      const res = await fetch(`${API_URL}/api/${word}`, {
        method,
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });
      // If status is not 404, it exists!
      if (res.status !== 404) {
        const allow = res.headers.get('Allow') ?? '';
        console.log(`FOUND: /api/${word} [${method}] -> Status ${res.status} ${allow ? 'Allow: ' + allow : ''}`);
      }
    } catch (e) {}
  }
}

async function run() {
  console.log('Bruteforcing ASP.NET controllers...\n');
  await Promise.all(words.map(checkRoute));
  console.log('\nDone scanning.');
}

run();
