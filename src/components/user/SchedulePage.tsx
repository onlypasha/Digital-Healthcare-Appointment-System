'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { Appointment } from '@/lib/types';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'>('all');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const params = filter !== 'all' ? `?status=${filter}` : '';
    const res = await fetch(`/api/appointments${params}`);
    if (res.ok) setAppointments(await res.json());
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: Appointment['status']) {
    const res = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setMessage(status === 'Cancelled' ? 'Janji temu dibatalkan' : 'Janji temu dikonfirmasi');
      load();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Jadwal Saya</h1>
          <p className="text-[var(--color-outline)] mt-1">Kelola semua janji temu medis Anda</p>
        </div>
        <Link href="/doctors" className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Buat Janji Baru
        </Link>
      </header>

      {message && (
        <div className="mb-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-outline-variant)] text-[var(--color-outline)] hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'Semua' : s === 'Confirmed' ? 'Dikonfirmasi' : s === 'Pending' ? 'Menunggu' : s === 'Completed' ? 'Selesai' : 'Dibatalkan'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-4">event_busy</span>
            <p className="text-[var(--color-outline)] mb-4">Tidak ada janji temu</p>
            <Link href="/doctors" className="text-[var(--color-primary)] font-bold hover:underline">Cari Dokter</Link>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[var(--color-primary)] flex items-center justify-center font-bold">
                  {apt.doctorName.split(' ').pop()?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black">{apt.doctorName}</h3>
                  <p className="text-sm text-[var(--color-outline)]">{apt.serviceType}</p>
                  <p className="text-sm text-black mt-1 font-medium">{formatDate(apt.date)} • {apt.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                  apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {apt.status === 'Confirmed' ? 'Dikonfirmasi' : apt.status === 'Completed' ? 'Selesai Diperiksa' : apt.status === 'Pending' ? 'Menunggu' : 'Dibatalkan'}
                </span>
                {apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => updateStatus(apt.id, 'Cancelled')}
                    className="px-4 py-2 text-sm border border-[var(--color-outline-variant)] rounded-lg hover:bg-red-50 hover:text-[var(--color-error)] transition-colors"
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
