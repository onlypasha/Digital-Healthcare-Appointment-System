'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { Appointment } from '@/lib/types';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const load = useCallback(async () => {
    const res = await fetch('/api/appointments');
    if (res.ok) setAppointments(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === today && a.status !== 'Cancelled');
  const pendingExams = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending');
  const completed = appointments.filter((a) => a.status === 'Completed');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard Dokter</h1>
        <p className="text-[var(--color-outline)] mt-1">Kelola pemeriksaan dan catat hasil vital pasien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-outline)] uppercase">Janji Hari Ini</p>
          <p className="text-3xl font-bold mt-2">{todayAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-outline)] uppercase">Menunggu Pemeriksaan</p>
          <p className="text-3xl font-bold mt-2">{pendingExams.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-outline)] uppercase">Selesai Diperiksa</p>
          <p className="text-3xl font-bold mt-2">{completed.length}</p>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-[var(--color-outline-variant)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center">
          <h2 className="text-xl font-bold">Janji Temu Hari Ini</h2>
          <Link href="/doctor/appointments" className="text-[var(--color-secondary)] text-sm font-bold hover:underline">
            Lihat Semua
          </Link>
        </div>
        {todayAppointments.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-outline)]">Tidak ada janji temu hari ini</div>
        ) : (
          <div className="divide-y divide-[var(--color-outline-variant)]">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="p-5 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-bold text-lg">{apt.patientName}</p>
                  <p className="text-sm text-[var(--color-outline)]">{apt.serviceType || 'Konsultasi'} • {apt.time || '—'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status === 'Completed' ? 'Selesai' : apt.status}
                  </span>
                  {apt.status !== 'Completed' ? (
                    <Link href={`/doctor/appointments/${apt.id}`} className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
                      Mulai Pemeriksaan
                    </Link>
                  ) : (
                    <Link href={`/doctor/appointments/${apt.id}`} className="text-[var(--color-secondary)] text-sm font-bold hover:underline">
                      Lihat Hasil
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-[var(--color-outline-variant)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-variant)]">
          <h2 className="text-xl font-bold">Perlu Pemeriksaan</h2>
        </div>
        <div className="divide-y divide-[var(--color-outline-variant)]">
          {pendingExams.slice(0, 5).map((apt) => (
            <div key={apt.id} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-bold">{apt.patientName}</p>
                <p className="text-sm text-[var(--color-outline)]">{formatDate(apt.date)} • {apt.time || '—'}</p>
              </div>
              <Link href={`/doctor/appointments/${apt.id}`} className="text-[var(--color-secondary)] font-bold text-sm hover:underline">
                Input Hasil →
              </Link>
            </div>
          ))}
          {pendingExams.length === 0 && (
            <div className="p-8 text-center text-[var(--color-outline)]">Semua pemeriksaan sudah selesai</div>
          )}
        </div>
      </section>
    </div>
  );
}

export function DoctorAppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'>('all');

  useEffect(() => {
    const params = filter !== 'all' ? `?status=${filter}` : '';
    fetch(`/api/appointments${params}`).then((r) => r.json()).then(setAppointments);
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Janji Temu Saya</h1>
        <p className="text-[var(--color-outline)] mt-1">Daftar pasien yang perlu diperiksa</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === s ? 'bg-[var(--color-secondary)] text-white' : 'bg-white border border-[var(--color-outline-variant)]'
            }`}
          >
            {s === 'all' ? 'Semua' : s === 'Completed' ? 'Selesai' : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--color-outline-variant)]">
              {['Pasien', 'Tanggal', 'Waktu', 'Layanan', 'Status', 'Aksi'].map((h) => (
                <th key={h} className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)] text-sm">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold">{apt.patientName}</td>
                <td className="py-3 px-4">{apt.date}</td>
                <td className="py-3 px-4">{apt.time}</td>
                <td className="py-3 px-4">{apt.serviceType}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status === 'Completed' ? 'Selesai' : apt.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/doctor/appointments/${apt.id}`} className="text-[var(--color-secondary)] font-bold hover:underline">
                    {apt.status === 'Completed' ? 'Lihat' : 'Periksa'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="p-12 text-center text-[var(--color-outline)]">Tidak ada janji temu</div>
        )}
      </div>
    </div>
  );
}

export function DoctorPatientsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments);
  }, []);

  const uniquePatients = Array.from(
    new Map(appointments.map((a) => [a.patientId, a])).values()
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pasien Saya</h1>
        <p className="text-[var(--color-outline)] mt-1">Pasien yang pernah/pernah janji temu dengan Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniquePatients.map((apt) => (
          <div key={apt.patientId} className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-[var(--color-secondary)] flex items-center justify-center font-bold">
                {apt.patientName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{apt.patientName}</p>
                <p className="text-sm text-[var(--color-outline)]">Terakhir: {apt.date}</p>
              </div>
              <Link
                href={`/doctor/appointments/${apt.id}`}
                className="text-[var(--color-secondary)] text-sm font-bold hover:underline"
              >
                Riwayat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
