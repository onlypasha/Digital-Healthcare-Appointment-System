'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { Appointment, HealthRecord } from '@/lib/types';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function UserDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [latestRecord, setLatestRecord] = useState<HealthRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([]);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const [aptRes, vitalRes, recordsRes] = await Promise.all([
      fetch('/api/appointments'),
      fetch('/api/health-records?latest=true'),
      fetch('/api/health-records'),
    ]);
    if (aptRes.ok) setAppointments(await aptRes.json());
    if (vitalRes.ok) setLatestRecord(await vitalRes.json());
    if (recordsRes.ok) setRecentRecords(await recordsRes.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upcoming = appointments
    .filter((a) => a.status !== 'Cancelled' && a.status !== 'Completed')
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextApt = upcoming[0];

  async function updateStatus(id: string, status: Appointment['status']) {
    const res = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setMessage(status === 'Cancelled' ? 'Janji temu dibatalkan' : 'Status diperbarui');
      load();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  const vitals = latestRecord
    ? [
        { label: 'Detak Jantung', value: String(latestRecord.vitals.heartRate), unit: 'bpm', icon: 'favorite', status: latestRecord.heartRateStatus, color: 'red' },
        { label: 'Tekanan Darah', value: `${latestRecord.vitals.bloodPressureSystolic}/${latestRecord.vitals.bloodPressureDiastolic}`, unit: '', icon: 'bloodtype', status: latestRecord.bloodPressureStatus, color: 'blue' },
        { label: 'Berat Badan', value: String(latestRecord.vitals.weight), unit: 'kg', icon: 'monitor_weight', status: latestRecord.weightNote, color: 'teal' },
      ]
    : null;

  const chartData = recentRecords.slice(0, 7).reverse();
  const maxHr = chartData.length ? Math.max(...chartData.map((r) => r.vitals.heartRate), 100) : 100;

  return (
    <div className="flex flex-col h-full">
      {message && (
        <div className="mb-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium">
          {message}
        </div>
      )}

      <header className="flex justify-between items-center mb-8 w-full">
        <div>
          <h1 className="text-3xl font-bold text-black">Selamat Datang</h1>
          <p className="text-base text-[var(--color-outline)] mt-1">Ringkasan kesehatan Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/doctors" className="hidden lg:flex items-center bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            <span className="material-symbols-outlined mr-2 text-sm">add_circle</span>
            Buat Janji
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        <div className="xl:col-span-8 flex flex-col gap-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Statistik Vital</h2>
              {latestRecord && (
                <span className="text-xs text-[var(--color-outline)]">
                  Diperbarui {formatDate(latestRecord.date)} oleh {latestRecord.doctorName}
                </span>
              )}
            </div>

            {!vitals ? (
              <div className="bg-white rounded-xl p-8 border border-dashed border-[var(--color-outline-variant)] text-center">
                <span className="material-symbols-outlined text-4xl text-[var(--color-outline)] mb-3">monitor_heart</span>
                <p className="text-[var(--color-outline)] font-medium">Belum ada data vital</p>
                <p className="text-sm text-[var(--color-outline)] mt-1">Data akan muncul setelah dokter menyelesaikan pemeriksaan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vitals.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-6 border border-[var(--color-outline-variant)] shadow-sm flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-[var(--color-outline)] font-bold uppercase tracking-wider block mb-1">{stat.label}</span>
                        <span className="text-3xl font-bold text-black">
                          {stat.value}{' '}
                          {stat.unit && <span className="text-base font-normal text-[var(--color-outline)]">{stat.unit}</span>}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--color-secondary)] font-medium mt-4">{stat.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="flex-1 bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm min-h-[200px]">
            <h2 className="text-xl font-bold text-black mb-4">Riwayat Detak Jantung</h2>
            {chartData.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-[var(--color-outline)] text-sm">
                Grafik akan tampil setelah pemeriksaan dokter
              </div>
            ) : (
              <div className="grid gap-2 h-32 items-end" style={{ gridTemplateColumns: `repeat(${chartData.length}, 1fr)` }}>
                {chartData.map((record) => (
                  <div key={record.id} className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-black">{record.vitals.heartRate}</span>
                    <div className="w-full bg-blue-100 rounded-t-lg flex items-end" style={{ height: '100px' }}>
                      <div
                        className="w-full bg-[var(--color-primary)] rounded-t-lg"
                        style={{ height: `${(record.vitals.heartRate / maxHr) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--color-outline)]">{formatDate(record.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="xl:col-span-4">
          <section className="bg-white rounded-xl p-6 border border-[var(--color-outline-variant)] shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--color-outline-variant)] pb-4">
              <h2 className="text-xl font-bold text-black">Janji Mendatang</h2>
              <Link href="/schedule" className="text-sm font-medium text-[var(--color-primary)] hover:underline">Lihat Semua</Link>
            </div>

            {nextApt ? (
              <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-outline-variant)] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-secondary)]" />
                <h3 className="text-lg font-bold text-black pl-2">{nextApt.doctorName}</h3>
                <p className="text-sm text-[var(--color-outline)] mt-1 pl-2">{nextApt.serviceType}</p>
                <div className="bg-white rounded-lg p-3 my-4 grid grid-cols-2 gap-3 border border-[var(--color-outline-variant)]">
                  <div>
                    <span className="text-xs text-[var(--color-outline)] block">Tanggal</span>
                    <span className="text-sm font-semibold">{formatDate(nextApt.date)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-outline)] block">Waktu</span>
                    <span className="text-sm font-semibold">{nextApt.time}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/schedule" className="flex-1 bg-blue-50 text-[var(--color-primary)] text-sm py-2.5 rounded-lg font-bold hover:bg-blue-100 transition-colors text-center">
                    Jadwalkan Ulang
                  </Link>
                  <button
                    onClick={() => updateStatus(nextApt.id, 'Cancelled')}
                    className="flex-1 bg-white border border-[var(--color-outline-variant)] text-black text-sm py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-outline)]">
                <p className="mb-4">Belum ada janji temu aktif</p>
                <Link href="/doctors" className="text-[var(--color-primary)] font-bold hover:underline">Cari Dokter</Link>
              </div>
            )}

            {latestRecord && (
              <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                <p className="text-xs font-bold text-[var(--color-secondary)] uppercase mb-2">Hasil Terakhir</p>
                <p className="text-sm font-bold text-black">{latestRecord.diagnosis || 'Pemeriksaan selesai'}</p>
                <p className="text-xs text-[var(--color-outline)] mt-1">{latestRecord.recommendations}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
