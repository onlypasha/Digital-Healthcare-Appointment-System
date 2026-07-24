'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Appointment, Doctor } from '@/lib/types';

export function AdminAppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (doctorFilter) params.set('doctorId', doctorFilter);
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/appointments?${params}`);
    if (res.ok) setAppointments(await res.json());
  }, [doctorFilter, statusFilter]);

  useEffect(() => {
    fetch('/api/doctors').then((r) => r.json()).then(setDoctors);
  }, []);

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
      setMessage('Status diperbarui');
      load();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  const exportCsv = () => {
    const header = 'Patient,Doctor,Date,Time,Service,Status,Payment\n';
    const rows = appointments.map((a) =>
      `${a.patientName},${a.doctorName},${a.date},${a.time},${a.serviceType},${a.status},${a.payment}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    setMessage('Data diekspor');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-[var(--color-outline-variant)] shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-black">Janji Temu</h2>
          <p className="text-sm text-[var(--color-outline)] mt-1">Kelola semua booking klinik</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Dokter</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={exportCsv} className="border border-[var(--color-outline-variant)] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
          <Link href="/admin/appointments/new" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Janji Baru
          </Link>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--color-outline-variant)]">
              {['Pasien', 'Dokter', 'Tanggal & Waktu', 'Layanan', 'Status', 'Pembayaran', 'Aksi'].map((h) => (
                <th key={h} className="py-4 px-6 text-xs font-bold text-[var(--color-outline)] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)] text-sm">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-4 px-6 font-bold">{apt.patientName}</td>
                <td className="py-4 px-6">{apt.doctorName}</td>
                <td className="py-4 px-6">{apt.date} • {apt.time}</td>
                <td className="py-4 px-6 text-[var(--color-outline)]">{apt.serviceType}</td>
                <td className="py-4 px-6">
                  <select
                    value={apt.status}
                    onChange={(e) => updateStatus(apt.id, e.target.value as Appointment['status'])}
                    className="text-xs font-bold px-2 py-1 rounded border border-[var(--color-outline-variant)]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-4 px-6">{apt.payment}</td>
                <td className="py-4 px-6">
                  {apt.status === 'Pending' && (
                    <button onClick={() => updateStatus(apt.id, 'Confirmed')} className="text-[var(--color-primary)] text-xs font-bold hover:underline">
                      Konfirmasi
                    </button>
                  )}
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

export function AdminDoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    fetch('/api/doctors').then((r) => r.json()).then(setDoctors);
  }, []);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchSpec = !specialty || d.specialty === specialty;
      return matchSearch && matchSpec;
    });
  }, [doctors, search, specialty]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-bold">Daftar Dokter</h3>
          <p className="text-sm text-[var(--color-outline)] mt-1">Kelola tenaga medis</p>
        </div>
        <Link href="/admin/doctors/new" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Tambah Dokter
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-4 flex gap-4">
        <input
          type="text"
          placeholder="Cari nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm"
        />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm">
          <option value="">Semua Spesialisasi</option>
          {[...new Set(doctors.map((d) => d.specialty))].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--color-outline-variant)]">
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Dokter</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Spesialisasi</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Klinik</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Rating</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-[var(--color-outline-variant)]">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random`} alt="" className="w-10 h-10 rounded-full" />
                    <span className="font-bold">{doc.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{doc.specialty}</td>
                <td className="py-3 px-4">{doc.hospital}</td>
                <td className="py-3 px-4">{doc.rating} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPatientsList() {
  const [patients, setPatients] = useState<{ id: string; name: string; email: string; phone: string; mrn: string; status: string }[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/patients').then((r) => r.json()).then(setPatients);
  }, []);

  const filtered = patients.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.mrn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Database Pasien</h2>
        <p className="text-sm text-[var(--color-outline)]">Kelola rekam medis pasien</p>
      </div>

      <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-4">
        <input
          type="text"
          placeholder="Cari nama atau MRN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm"
        />
      </div>

      <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--color-outline-variant)]">
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">MRN</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Nama</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Kontak</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase">Status</th>
              <th className="py-3 px-4 text-xs font-bold text-[var(--color-outline)] uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-[var(--color-outline-variant)]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold">{p.mrn}</td>
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4 text-[var(--color-outline)]">{p.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">{p.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/admin/patients/${p.id}`} className="text-[var(--color-primary)] font-bold text-sm hover:underline">
                    Lihat Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
