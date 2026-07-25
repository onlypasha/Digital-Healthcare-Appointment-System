'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import type { Appointment, HealthRecord } from '@/lib/types';

interface Props {
  appointmentId: string;
}

export function DoctorExaminationForm({ appointmentId }: Props) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [existingRecord, setExistingRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    heartRate: '72',
    bloodPressureSystolic: '120',
    bloodPressureDiastolic: '80',
    weight: '75',
    temperature: '36.6',
    oxygenSaturation: '98',
    diagnosis: '',
    notes: '',
    recommendations: '',
  });

  useEffect(() => {
    fetch(`/api/appointments/${appointmentId}`)
      .then((r) => r.json())
      .then(setAppointment);

    fetch('/api/health-records')
      .then((r) => r.json())
      .then((records: HealthRecord[]) => {
        const found = records.find((r) => r.appointmentId === appointmentId);
        if (found) {
          setExistingRecord(found);
          setForm({
            heartRate: String(found.vitals.heartRate),
            bloodPressureSystolic: String(found.vitals.bloodPressureSystolic),
            bloodPressureDiastolic: String(found.vitals.bloodPressureDiastolic),
            weight: String(found.vitals.weight),
            temperature: String(found.vitals.temperature ?? ''),
            oxygenSaturation: String(found.vitals.oxygenSaturation ?? ''),
            diagnosis: found.diagnosis,
            notes: found.notes,
            recommendations: found.recommendations,
          });
        }
      });
  }, [appointmentId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!appointment || existingRecord) return;

    setLoading(true);
    const res = await fetch('/api/health-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId,
        patientId: appointment.patientId,
        vitals: {
          heartRate: form.heartRate,
          bloodPressureSystolic: form.bloodPressureSystolic,
          bloodPressureDiastolic: form.bloodPressureDiastolic,
          weight: form.weight,
          temperature: form.temperature,
          oxygenSaturation: form.oxygenSaturation,
        },
        diagnosis: form.diagnosis,
        notes: form.notes,
        recommendations: form.recommendations,
      }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage('Hasil pemeriksaan berhasil disimpan. Data pasien telah diperbarui.');
      const record = await res.json();
      setExistingRecord(record);
      setTimeout(() => router.push('/doctor/appointments'), 2000);
    } else {
      const data = await res.json();
      setMessage(data.error ?? 'Gagal menyimpan');
    }
  }

  if (!appointment) return <div className="text-[var(--color-outline)] p-8">Memuat...</div>;

  const isReadOnly = !!existingRecord;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[var(--color-outline)] text-xs mb-1">
          <Link href="/doctor/appointments" className="hover:text-[var(--color-secondary)]">Janji Temu</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-black font-bold">Pemeriksaan</span>
        </div>
        <h1 className="text-3xl font-bold">Pemeriksaan Pasien</h1>
        <p className="text-[var(--color-outline)] mt-1">
          {appointment.patientName} • {appointment.date} • {appointment.time} • {appointment.serviceType}
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${message.includes('berhasil') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      {isReadOnly && (
        <div className="bg-teal-50 text-[var(--color-secondary)] px-4 py-3 rounded-lg border border-teal-200 text-sm font-medium">
          Pemeriksaan sudah selesai dicatat. Data vital ini sudah tampil di dashboard pasien.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--color-secondary)]">monitor_heart</span>
            Data Vital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'heartRate', label: 'Detak Jantung (bpm)', placeholder: '72' },
              { key: 'bloodPressureSystolic', label: 'Tekanan Sistolik', placeholder: '120' },
              { key: 'bloodPressureDiastolic', label: 'Tekanan Diastolik', placeholder: '80' },
              { key: 'weight', label: 'Berat Badan (kg)', placeholder: '75.0' },
              { key: 'temperature', label: 'Suhu Tubuh (°C)', placeholder: '36.6' },
              { key: 'oxygenSaturation', label: 'Saturasi O₂ (%)', placeholder: '98' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">{field.label}</label>
                <input
                  type="number"
                  step="0.1"
                  required={['heartRate', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'weight'].includes(field.key)}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  disabled={isReadOnly}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm focus:border-[var(--color-secondary)] focus:outline-none disabled:bg-gray-50"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold">Hasil & Catatan Medis</h2>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Diagnosis</label>
            <input
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              disabled={isReadOnly}
              placeholder="Contoh: Kondisi jantung normal, tekanan darah stabil"
              className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Catatan Pemeriksaan</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              disabled={isReadOnly}
              rows={3}
              placeholder="Temuan selama pemeriksaan..."
              className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm resize-none disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Rekomendasi</label>
            <textarea
              value={form.recommendations}
              onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
              disabled={isReadOnly}
              rows={3}
              placeholder="Saran diet, olahraga, obat, kontrol ulang..."
              className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm resize-none disabled:bg-gray-50"
            />
          </div>
        </section>

        {!isReadOnly && (
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-secondary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">save</span>
              {loading ? 'Menyimpan...' : 'Selesaikan & Simpan ke Pasien'}
            </button>
            <Link href="/doctor/appointments" className="px-6 py-3 border border-[var(--color-outline-variant)] rounded-lg font-bold text-sm hover:bg-gray-50">
              Batal
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
