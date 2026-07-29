'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import type { Doctor, Patient } from '@/lib/types';

export function AdminNewAppointmentForm() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/doctors').then((r) => r.json()).then(setDoctors);
    fetch('/api/patients').then((r) => r.json()).then(setPatients);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const selectedPatient = patients.find((p) => p.id === patientId);
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time) return;
    setLoading(true);
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, date, time, serviceType, notes }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/appointments');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-outline)] text-xs mb-1">
            <Link href="/admin/appointments" className="hover:text-[var(--color-primary)]">Janji Temu</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-black font-bold">Baru</span>
          </div>
          <h2 className="text-3xl font-bold">Janji Temu Baru</h2>
        </div>
        <Link href="/admin/appointments" className="font-bold text-[var(--color-outline)] border border-[var(--color-outline-variant)] px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold">Detail Peserta</h3>
            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Pasien</label>
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Pilih pasien...</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Dokter</label>
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Pilih dokter...</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold">Jadwal & Layanan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Tanggal</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Waktu</label>
                <select value={time} onChange={(e) => setTime(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Pilih waktu...</option>
                  {(selectedDoctor?.availableSlots ?? ['09:00 AM', '10:00 AM', '02:00 PM']).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Jenis Layanan</label>
              <div className="flex gap-3 flex-wrap">
                {['Checkup', 'Consultation', 'Surgery'].map((s) => (
                  <label key={s} className={`px-4 py-2 border rounded-lg cursor-pointer text-sm font-semibold ${serviceType === s ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]' : 'border-gray-300'}`}>
                    <input type="radio" name="service" value={s} checked={serviceType === s} onChange={() => setServiceType(s)} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Catatan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full p-4 border border-gray-300 rounded-lg text-sm resize-none" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4">Ringkasan</h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-[var(--color-outline)]">Pasien</span><span className="font-bold">{selectedPatient?.name ?? '--'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-outline)]">Dokter</span><span className="font-bold">{selectedDoctor?.name ?? '--'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-outline)]">Jadwal</span><span className="font-bold">{date && time ? `${date} ${time}` : '--'}</span></div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Konfirmasi Booking'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function AdminAddDoctorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    specialty: 'Cardiology',
    hospital: '',
    gender: 'male' as 'male' | 'female',
    experience: '',
    bio: '',
    location: '',
    fee: '150',
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/doctors');
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[var(--color-outline)] mb-2">
          <Link href="/admin/doctors" className="text-sm hover:text-[var(--color-primary)]">Dokter</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-sm font-bold text-black">Tambah Baru</span>
        </div>
        <h2 className="text-3xl font-bold">Tambah Dokter Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-outline-variant)] rounded-xl shadow-sm p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Nama Lengkap *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Jane Doe" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Spesialisasi *</label>
            <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Klinik</label>
            <input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Biaya ($)</label>
            <input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Lokasi</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Dokter'}
          </button>
          <Link href="/admin/doctors" className="px-6 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm font-bold hover:bg-gray-50">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<{ clinicName: string; timezone: string; appointmentDuration: number; autoConfirm: boolean; emailNotifications: boolean } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
  }, []);

  async function save(updates: Record<string, unknown>) {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setSettings(await res.json());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (!settings) return <div>Memuat...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Pengaturan Admin</h2>
      <p className="text-[var(--color-outline)] mb-8">Konfigurasi sistem klinik</p>

      {saved && <div className="mb-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">Disimpan</div>}

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Nama Klinik</label>
          <input value={settings.clinicName} onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })} onBlur={() => save({ clinicName: settings.clinicName })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Zona Waktu</label>
          <select value={settings.timezone} onChange={(e) => { setSettings({ ...settings, timezone: e.target.value }); save({ timezone: e.target.value }); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
            <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
            <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Durasi Janji (menit)</label>
          <input type="number" value={settings.appointmentDuration} onChange={(e) => setSettings({ ...settings, appointmentDuration: Number(e.target.value) })} onBlur={() => save({ appointmentDuration: settings.appointmentDuration })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        {[
          { key: 'autoConfirm' as const, label: 'Auto-konfirmasi janji temu' },
          { key: 'emailNotifications' as const, label: 'Notifikasi email' },
        ].map((t) => (
          <div key={t.key} className="flex items-center justify-between">
            <span className="font-medium">{t.label}</span>
            <button onClick={() => save({ [t.key]: !settings[t.key] })} className={`w-12 h-7 rounded-full relative transition-colors ${settings[t.key] ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[t.key] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPatientDetail({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetch(`/api/patients?id=${patientId}`).then((r) => r.json()).then(setPatient);
  }, [patientId]);

  if (!patient) return <div>Memuat...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[var(--color-outline)] text-xs mb-1">
          <Link href="/admin/patients" className="hover:text-[var(--color-primary)]">Pasien</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-black font-bold">Profil</span>
        </div>
        <h2 className="text-3xl font-bold">{patient.name}</h2>
        <p className="text-[var(--color-outline)]">MRN: {patient.mrn}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Informasi Kontak</h3>
          <div className="space-y-3 text-sm">
            <p><span className="text-[var(--color-outline)]">Email:</span> {patient.email}</p>
            <p><span className="text-[var(--color-outline)]">Telepon:</span> {patient.phone}</p>
            <p><span className="text-[var(--color-outline)]">Alamat:</span> {patient.address}</p>
            <p><span className="text-[var(--color-outline)]">Darurat:</span> {patient.emergencyContact}</p>
          </div>
        </div>
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Info Medis</h3>
          <div className="space-y-3 text-sm">
            <p><span className="text-[var(--color-outline)]">Golongan Darah:</span> {patient.bloodType}</p>
            <p><span className="text-[var(--color-outline)]">Usia:</span> {patient.age} tahun</p>
            <p><span className="text-[var(--color-outline)]">Gender:</span> {patient.gender}</p>
            <p><span className="text-[var(--color-outline)]">Status:</span> <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">{patient.status}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
