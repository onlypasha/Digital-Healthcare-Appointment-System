import type {
  AdminSettings,
  Appointment,
  Doctor,
  HealthRecord,
  Patient,
  User,
  UserSettings,
  VitalSigns,
} from './types';

const globalForStore = globalThis as unknown as {
  users: User[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  userSettings: UserSettings;
  adminSettings: AdminSettings;
};

const users: User[] = globalForStore.users || [
  {
    id: 'u-admin',
    email: 'admin@careconnect.com',
    password: 'password123',
    role: 'admin',
    name: 'Super Admin',
    status: 'active',
  },
  {
    id: 'u-patient',
    email: 'patient@careconnect.com',
    password: 'password123',
    role: 'patient',
    name: 'Budi Santoso',
    patientId: 'p1',
    status: 'active',
  },
  {
    id: 'u-doctor',
    email: 'doctor@careconnect.com',
    password: 'password123',
    role: 'doctor',
    name: 'Dr. Sarah Jenkins, Sp.JP',
    doctorId: 'd1',
    status: 'active',
  },
];

let doctors: Doctor[] = globalForStore.doctors || [
  {
    id: 'd1',
    name: 'Dr. Sarah Jenkins, Sp.JP',
    specialty: 'Spesialis Jantung (Cardiology)',
    hospital: 'CareConnect Central Hospital',
    rating: 4.9,
    reviews: 128,
    gender: 'female',
    experience: '8+ Tahun Pengalaman',
    bio: 'Pakar kardiologi intervensi dengan sertifikasi internasional.',
    expertise: ['Ekokardiografi', 'Kardiologi Preventif'],
    education: [{ title: 'Fakultas Kedokteran UI', detail: 'Spesialis Jantung' }],
    location: 'Jakarta Selatan',
    fee: 250000,
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM'],
    status: 'Active',
  },
  {
    id: 'd2',
    name: 'Dr. Ahmad Wijaya, Sp.A',
    specialty: 'Spesialis Anak (Pediatrics)',
    hospital: 'Klinik Kesehatan Ibu & Anak',
    rating: 4.8,
    reviews: 95,
    gender: 'male',
    experience: '6+ Tahun Pengalaman',
    bio: 'Dokter spesialis anak yang berdedikasi tinggi terhadap tumbuh kembang balita.',
    expertise: ['Tumbuh Kembang Anak', 'Imunisasi Lengkap'],
    education: [{ title: 'Universitas Gadjah Mada', detail: 'Spesialis Anak' }],
    location: 'Jakarta Barat',
    fee: 180000,
    availableSlots: ['10:00 AM', '01:00 PM', '03:00 PM'],
    status: 'Active',
  },
];

let patients: Patient[] = globalForStore.patients || [
  {
    id: 'p1',
    name: 'Budi Santoso',
    email: 'patient@careconnect.com',
    phone: '081234567890',
    mrn: 'MRN-1001',
    bloodType: 'O+',
    age: 28,
    gender: 'Laki-laki',
    address: 'Jakarta',
    emergencyContact: '081987654321',
    status: 'Active',
  },
];

let appointments: Appointment[] = globalForStore.appointments || [];

let userSettings: UserSettings = globalForStore.userSettings || {
  notifications: true,
  emailAlerts: true,
  smsAlerts: false,
  darkMode: false,
  language: 'id',
};

let adminSettings: AdminSettings = globalForStore.adminSettings || {
  clinicName: 'HealthAdmin Medical Center',
  timezone: 'Asia/Jakarta',
  appointmentDuration: 45,
  autoConfirm: false,
  emailNotifications: true,
};

let healthRecords: HealthRecord[] = globalForStore.healthRecords || [];

if (process.env.NODE_ENV !== 'production') {
  globalForStore.users = users;
  globalForStore.doctors = doctors;
  globalForStore.patients = patients;
  globalForStore.appointments = appointments;
  globalForStore.healthRecords = healthRecords;
  globalForStore.userSettings = userSettings;
  globalForStore.adminSettings = adminSettings;
}

function deriveHeartRateStatus(bpm: number): string {
  if (bpm < 60) return 'Rendah';
  if (bpm > 100) return 'Tinggi';
  return 'Normal';
}

function deriveBloodPressureStatus(sys: number, dia: number): string {
  if (sys >= 140 || dia >= 90) return 'Tinggi';
  if (sys < 90 || dia < 60) return 'Rendah';
  return 'Stabil';
}

function deriveWeightNote(current: number, previous?: number): string {
  if (!previous) return 'Data awal';
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return 'Stabil';
  return diff > 0 ? `+${diff.toFixed(1)} kg sejak pemeriksaan terakhir` : `${diff.toFixed(1)} kg sejak pemeriksaan terakhir`;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function authenticate(email: string, password: string): User | null {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password) ?? null;
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'patient' | 'doctor' | 'admin';
  phone?: string;
  gender?: string;
  specialty?: string;
  hospital?: string;
  experience?: string;
  fee?: number;
  location?: string;
  bio?: string;
  expertise?: string[];
}): User {
  const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    throw new Error('Email sudah terdaftar');
  }

  const role = data.role ?? 'patient';
  const newId = String(Date.now());

  let patientId: string | undefined;
  let doctorId: string | undefined;

  const isDoctorPending = role === 'doctor';

  if (role === 'patient') {
    patientId = `p${newId}`;
    const newPatient: Patient = {
      id: patientId,
      name: data.name,
      email: data.email,
      phone: data.phone ?? '-',
      mrn: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodType: 'O+',
      age: 28,
      gender: data.gender === 'female' ? 'Perempuan' : 'Laki-laki',
      address: 'Jakarta',
      emergencyContact: '-',
      status: 'Active',
    };
    patients.push(newPatient);
  } else if (role === 'doctor') {
    const formattedName = data.name.toLowerCase().startsWith('dr.') ? data.name : `Dr. ${data.name}`;
    const createdDoctor = addDoctor({
      name: formattedName,
      specialty: data.specialty || 'Dokter Umum',
      hospital: data.hospital || 'CareConnect Hospital',
      rating: 5.0,
      reviews: 0,
      gender: data.gender === 'female' ? 'female' : 'male',
      experience: data.experience || '1+ Tahun Pengalaman',
      bio: data.bio || 'Dokter berdedikasi tinggi.',
      expertise: data.expertise && data.expertise.length > 0 ? data.expertise : ['Konsultasi Medis'],
      education: [{ title: 'Fakultas Kedokteran', detail: 'Dokter Spesialis' }],
      location: data.location || 'Jakarta',
      fee: Number(data.fee) || 150000,
      status: 'Pending',
    }, true); // skipUserCreation=true so registerUser creates the single user account
    doctorId = createdDoctor.id;
  }

  const user: User = {
    id: newId,
    email: data.email,
    password: data.password,
    role,
    name: data.name,
    patientId,
    doctorId,
    status: isDoctorPending ? 'pending_approval' : 'active',
  };

  users.push(user);
  return user;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getDoctors(): Doctor[] {
  return [...doctors];
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function addDoctor(
  doctor: Omit<Doctor, 'id' | 'availableSlots'> & {
    availableSlots?: string[];
    status?: 'Active' | 'Pending' | 'Rejected';
    password?: string;
  },
  skipUserCreation = false
): Doctor {
  const newDoctor: Doctor = {
    ...doctor,
    id: String(Date.now()),
    availableSlots: doctor.availableSlots ?? ['09:00 AM', '10:00 AM', '02:00 PM'],
    status: doctor.status ?? 'Active',
  };
  doctors.push(newDoctor);

  // Also create a linked user account for admin-created or registered doctors if not existing
  if (!skipUserCreation) {
    const existingUser = users.find(
      (u) => u.doctorId === newDoctor.id || (doctor.email && u.email.toLowerCase() === doctor.email.toLowerCase())
    );
    if (!existingUser) {
      const doctorEmail = doctor.email || `${newDoctor.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@careconnect.com`;
      const doctorPassword = doctor.password || 'password123';
      users.push({
        id: `u-${newDoctor.id}`,
        email: doctorEmail,
        password: doctorPassword,
        role: 'doctor',
        name: newDoctor.name,
        doctorId: newDoctor.id,
        status: newDoctor.status === 'Active' ? 'active' : 'pending_approval',
      });
    } else {
      existingUser.doctorId = newDoctor.id;
      if (doctor.password) existingUser.password = doctor.password;
      if (newDoctor.status === 'Active') existingUser.status = 'active';
    }
  }

  return newDoctor;
}

export function updateDoctor(id: string, partial: Partial<Doctor>): Doctor | null {
  const index = doctors.findIndex((d) => d.id === id);
  if (index === -1) return null;
  doctors[index] = { ...doctors[index], ...partial };
  return doctors[index];
}

export function updateDoctorStatus(doctorId: string, status: 'Active' | 'Pending' | 'Rejected'): Doctor | null {
  const docIndex = doctors.findIndex((d) => d.id === doctorId);
  if (docIndex === -1) return null;

  const targetDoctor = doctors[docIndex];
  doctors[docIndex] = {
    ...targetDoctor,
    status,
  };

  // Update ALL associated user accounts for this doctor
  const newStatus = status === 'Active' ? 'active' : status === 'Pending' ? 'pending_approval' : 'rejected';
  users.forEach((u, index) => {
    if (
      u.doctorId === doctorId ||
      (u.role === 'doctor' && u.name.toLowerCase() === targetDoctor.name.toLowerCase())
    ) {
      users[index].status = newStatus;
    }
  });

  return doctors[docIndex];
}

export function getPatients(): Patient[] {
  return [...patients];
}

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getAppointments(filters?: {
  patientId?: string;
  doctorId?: string;
  status?: string;
}): Appointment[] {
  let result = [...appointments];
  if (filters?.patientId) {
    result = result.filter((a) => a.patientId === filters.patientId);
  }
  if (filters?.doctorId) {
    result = result.filter((a) => a.doctorId === filters.doctorId);
  }
  if (filters?.status && filters.status !== 'all') {
    result = result.filter((a) => a.status === filters.status);
  }
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

export function addAppointment(data: Omit<Appointment, 'id'>): Appointment {
  const apt: Appointment = { ...data, id: `apt${Date.now()}` };
  appointments = [...appointments, apt];
  return apt;
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;
  appointments[index] = { ...appointments[index], ...updates };
  return appointments[index];
}

export function getUserSettings(): UserSettings {
  return { ...userSettings };
}

export function updateUserSettings(updates: Partial<UserSettings>): UserSettings {
  userSettings = { ...userSettings, ...updates };
  return userSettings;
}

export function getAdminSettings(): AdminSettings {
  return { ...adminSettings };
}

export function updateAdminSettings(updates: Partial<AdminSettings>): AdminSettings {
  adminSettings = { ...adminSettings, ...updates };
  return adminSettings;
}

export function getHealthRecords(filters?: { patientId?: string; doctorId?: string }): HealthRecord[] {
  let result = [...healthRecords];
  if (filters?.patientId) {
    result = result.filter((r) => r.patientId === filters.patientId);
  }
  if (filters?.doctorId) {
    result = result.filter((r) => r.doctorId === filters.doctorId);
  }
  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestHealthRecord(patientId: string): HealthRecord | undefined {
  return getHealthRecords({ patientId })[0];
}

export function getHealthRecordByAppointment(appointmentId: string): HealthRecord | undefined {
  return healthRecords.find((r) => r.appointmentId === appointmentId);
}

export function addHealthRecord(data: {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  vitals: VitalSigns;
  diagnosis: string;
  notes: string;
  recommendations: string;
}): HealthRecord | null {
  const appointment = appointments.find((a) => a.id === data.appointmentId);
  const patient = getPatientById(data.patientId);
  const doctor = getDoctorById(data.doctorId);
  if (!appointment || !patient || !doctor) return null;
  if (appointment.doctorId !== data.doctorId) return null;

  const previous = getLatestHealthRecord(data.patientId);
  const record: HealthRecord = {
    id: `hr${Date.now()}`,
    patientId: patient.id,
    patientName: patient.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    appointmentId: appointment.id,
    date: new Date().toISOString().split('T')[0],
    vitals: data.vitals,
    heartRateStatus: deriveHeartRateStatus(data.vitals.heartRate),
    bloodPressureStatus: deriveBloodPressureStatus(
      data.vitals.bloodPressureSystolic,
      data.vitals.bloodPressureDiastolic
    ),
    weightNote: deriveWeightNote(data.vitals.weight, previous?.vitals.weight),
    diagnosis: data.diagnosis,
    notes: data.notes,
    recommendations: data.recommendations,
  };

  healthRecords = [record, ...healthRecords];
  updateAppointment(data.appointmentId, { status: 'Completed' });
  return record;
}

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id);
}
