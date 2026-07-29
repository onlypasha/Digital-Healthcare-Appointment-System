'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Doctor } from '@/lib/types';

interface Props {
  doctorId: string;
}

export function DoctorDetail({ doctorId }: Props) {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/doctors?id=${doctorId}`).then((r) => r.json()).then(setDoctor);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [doctorId]);

  async function handleBook() {
    if (!selectedDate || !selectedTime || !doctor) return;
    setLoading(true);
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        serviceType: 'Consultation',
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage('Janji temu berhasil dibuat!');
      setTimeout(() => router.push('/schedule'), 1500);
    } else {
      setMessage('Gagal membuat janji temu');
    }
  }

  if (!doctor) return <div className="text-[var(--color-outline)] p-8">Memuat...</div>;

  return (
    <div className="max-w-[1280px] mx-auto">
      <Breadcrumb items={[
        { label: 'Beranda', href: '/dashboard' },
        { label: 'Dokter', href: '/doctors' },
        { label: doctor.name },
      ]} />

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${message.includes('berhasil') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-8 shadow-sm flex gap-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[var(--color-primary)]" />
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random&size=128`}
              alt={doctor.name}
              className="w-32 h-32 rounded-xl border border-[var(--color-outline-variant)]"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-lg text-[var(--color-primary)] font-medium mb-4">{doctor.specialty}</p>
              <div className="flex items-center gap-4 text-[var(--color-outline)]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {doctor.rating} ({doctor.reviews} ulasan)
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined">work</span>
                  {doctor.experience}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Tentang</h2>
            <p className="text-[var(--color-outline)] leading-relaxed">{doctor.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Keahlian</h2>
              <ul className="space-y-2">
                {doctor.expertise.map((e) => (
                  <li key={e} className="flex items-center gap-2 text-[var(--color-outline)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">check_circle</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Pendidikan</h2>
              <ul className="space-y-3">
                {doctor.education.map((e) => (
                  <li key={e.title}>
                    <div className="font-bold text-sm">{e.title}</div>
                    <div className="text-xs text-[var(--color-outline)]">{e.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-3">Lokasi Klinik</h2>
            <p className="text-[var(--color-outline)] flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              {doctor.location}
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-xl border border-[var(--color-outline-variant)] shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Buat Janji</h2>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Pilih Tanggal</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">Pilih Waktu</label>
              <div className="grid grid-cols-3 gap-2">
                {doctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`text-sm py-2 px-2 rounded-lg border transition-all font-medium ${
                      selectedTime === slot
                        ? 'bg-blue-50 text-[var(--color-primary)] border-[var(--color-primary)]'
                        : 'bg-gray-50 border-transparent hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 pt-4 border-t border-[var(--color-outline-variant)]">
              <span className="font-medium">Biaya Konsultasi</span>
              <span className="text-xl font-bold">${doctor.fee}.00</span>
            </div>

            <button
              onClick={handleBook}
              disabled={loading || !selectedTime}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : 'Konfirmasi Janji'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
