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

const users: User[] = [];

let doctors: Doctor[] = [];

let patients: Patient[] = [];

let appointments: Appointment[] = [];

let userSettings: UserSettings = {
  notifications: true,
  emailAlerts: true,
  smsAlerts: false,
  darkMode: false,
  language: 'id',
};

let adminSettings: AdminSettings = {
  clinicName: 'HealthAdmin Medical Center',
  timezone: 'Asia/Jakarta',
  appointmentDuration: 45,
  autoConfirm: false,
  emailNotifications: true,
};

let healthRecords: HealthRecord[] = [];

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
  return users.find((u) => u.email === email && u.password === password) ?? null;
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

export function addDoctor(doctor: Omit<Doctor, 'id' | 'availableSlots'> & { availableSlots?: string[] }): Doctor {
  const newDoctor: Doctor = {
    ...doctor,
    id: String(Date.now()),
    availableSlots: doctor.availableSlots ?? ['09:00 AM', '10:00 AM', '02:00 PM'],
  };
  doctors = [...doctors, newDoctor];
  return newDoctor;
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
