'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import type { Appointment, Doctor, Patient } from '@/lib/types';

export default function AdminDashboardPage() {
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

  const totalAppointments = appointments.length;
  const activeDoctors = doctors.length;
  const totalPatients = patients.length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Appointments</p>
              <h3 className="text-3xl font-bold text-black mt-1">{totalAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-outline)]">Total janji temu terdaftar</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Dokter Aktif</p>
              <h3 className="text-3xl font-bold text-black mt-1">{activeDoctors}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
              <span className="material-symbols-outlined">stethoscope</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-outline)]">Total tenaga medis</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Pasien</p>
              <h3 className="text-3xl font-bold text-black mt-1">{totalPatients}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
              <span className="material-symbols-outlined">person_add</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-outline)]">Pasien terdaftar</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-3xl font-bold text-black mt-1">Rp 0</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-outline)]">Berdasarkan data pembayaran</span>
          </div>
        </div>

      </div>

      {/* Bento Grid Layout for Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chart Section (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[var(--color-outline-variant)] rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-black">Tren Janji Temu</h2>
              <p className="text-sm text-[var(--color-outline)] mt-1">Volume konsultasi terkini</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full bg-gray-50 rounded-lg border-2 border-[var(--color-outline-variant)] border-dashed flex items-center justify-center relative overflow-hidden">
            <div className="text-center p-6">
              <span className="material-symbols-outlined text-[var(--color-outline)] text-4xl mb-2">bar_chart</span>
              <p className="text-sm text-[var(--color-outline)] font-medium">
                {appointments.length > 0 ? `${appointments.length} Janji Temu Terdaftar` : 'Belum Ada Data Janji Temu'}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Consultations Mini-table (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[var(--color-outline-variant)] rounded-xl p-0 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-black">Janji Temu Terbaru</h2>
            <Link href="/admin/appointments" className="text-[var(--color-primary)] hover:text-blue-800 text-sm font-bold flex items-center">
              Lihat Semua <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px]">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--color-outline)]">
                Belum ada janji temu terdaftar
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-outline-variant)]">
                {appointments.slice(0, 5).map((apt) => (
                  <li key={apt.id} className="p-5 hover:bg-gray-50 transition-colors flex justify-between items-center border-l-4 border-[var(--color-primary)]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)] font-bold">
                        {apt.patientName ? apt.patientName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-black text-sm">{apt.patientName || 'Pasien'}</p>
                        <p className="text-xs text-[var(--color-outline)] flex items-center mt-1">
                          <span className="material-symbols-outlined text-[12px] mr-1">schedule</span> {apt.time || '00:00'} - {apt.doctorName || 'Dokter'}
                        </p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-[var(--color-primary)] font-bold text-xs px-2.5 py-1 rounded-full">{apt.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity List (Full width below) */}
      <div className="bg-white border border-[var(--color-outline-variant)] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-black">Aktivitas Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--color-outline)]">
              Belum ada aktivitas tercatat
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[var(--color-outline-variant)] text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Tindakan</th>
                  <th className="p-4">Pasien</th>
                  <th className="p-4">Dokter</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black">
                {appointments.slice(0, 10).map((apt, index) => (
                  <tr key={apt.id} className="border-b border-[var(--color-outline-variant)] hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center text-[var(--color-outline)]">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">event_available</span>
                        Booking Janji Temu
                      </div>
                    </td>
                    <td className="p-4 font-bold">{apt.patientName}</td>
                    <td className="p-4 text-[var(--color-outline)]">{apt.doctorName}</td>
                    <td className="p-4 text-[var(--color-outline)]">{apt.date}</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{apt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}
