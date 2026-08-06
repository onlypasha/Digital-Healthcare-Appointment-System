export type UserRole = 'patient' | 'admin' | 'doctor';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  doctorId?: string;
  patientId?: string;
  status?: 'active' | 'pending_approval' | 'rejected';
}

export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  email?:string;
  phone?:string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  gender: 'male' | 'female';
  experience: string;
  bio: string;
  expertise: string[];
  education: { title: string; detail: string }[];
  location: string;
  fee: number;
  availableSlots: string[];
  status?: 'Active' | 'Pending' | 'Rejected';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  mrn: string;
  bloodType: string;
  age: number;
  gender: string;
  address: string;
  emergencyContact: string;
  status: 'Active' | 'Inactive';
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'N/A';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  serviceType: string;
  status: AppointmentStatus;
  payment: PaymentStatus;
  notes?: string;
}

export interface UserSettings {
  notifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  darkMode: boolean;
  language: string;
}

export interface AdminSettings {
  clinicName: string;
  timezone: string;
  appointmentDuration: number;
  autoConfirm: boolean;
  emailNotifications: boolean;
}

export interface VitalSigns {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  date: string;
  vitals: VitalSigns;
  heartRateStatus: string;
  bloodPressureStatus: string;
  weightNote: string;
  diagnosis: string;
  notes: string;
  recommendations: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  text: string;
  timestamp: string;
  attachments?: string[];
  isRead?: boolean;
}

export interface ChatSession {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  status: 'active' | 'closed';
  unreadCountPatient?: number;
  unreadCountDoctor?: number;
}
