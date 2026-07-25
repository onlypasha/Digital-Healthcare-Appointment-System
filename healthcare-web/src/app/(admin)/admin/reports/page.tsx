'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { Appointment, Doctor, Patient } from '@/lib/types';

export default function AdminReportsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setAppointments(data);
    }).catch(() => {});

    fetch('/api/doctors').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setDoctors(data);
    }).catch(() => {});

    fetch('/api/patients').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setPatients(data);
    }).catch(() => {});
  }, []);

  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalDoctors = doctors.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-light tracking-wide text-black mb-1">Laporan & Analisis</h2>
          <p className="text-sm text-[var(--color-outline)]">Metrik performa operasional terkini.</p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* KPI Summary Cards */}
        <div className="md:col-span-4 lg:col-span-3 bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Pasien</span>
          </div>
          <div className="z-10">
            <span className="text-4xl font-bold text-black tracking-wide">{totalPatients}</span>
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-3 bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Dokter</span>
          </div>
          <div className="z-10 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-black tracking-wide">{totalDoctors}</span>
          </div>
        </div>

        <div className="md:col-span-4 lg:col-span-3 bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Janji Temu</span>
          </div>
          <div className="z-10">
            <span className="text-4xl font-bold text-black tracking-wide">{totalAppointments}</span>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-3 bg-[var(--color-primary)] text-white rounded-xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Perlu Tindakan</span>
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="z-10">
            <span className="text-lg font-bold block mb-1">{pendingAppointments} Janji Pending</span>
            <Link href="/admin/appointments" className="text-[10px] font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">Tinjau Sekarang</Link>
          </div>
        </div>

        {/* Main Section */}
        <div className="md:col-span-12 bg-white border border-[var(--color-outline-variant)] rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
          <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-3">analytics</span>
          <h3 className="text-lg font-bold text-black mb-1">Visualisasi Laporan</h3>
          <p className="text-sm text-[var(--color-outline)]">
            {appointments.length > 0 ? `Menampilkan data dari ${appointments.length} janji temu yang terdaftar.` : 'Belum ada data untuk ditampilkan dalam grafik.'}
          </p>
        </div>

      </div>
    </div>
  );
}
