'use client';

import { useEffect, useState } from 'react';
import type { HealthRecord, Patient } from '@/lib/types';

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ProfilePage() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    fetch('/api/patients?id=1').then((r) => r.json()).then(setPatient);
    fetch('/api/health-records').then((r) => r.json()).then(setRecords);
  }, []);

  if (!patient) return <div className="text-[var(--color-outline)]">Memuat...</div>;

  return (
    <div className="max-w-[1280px] mx-auto">
      <header className="bg-white rounded-xl p-8 shadow-sm border border-[var(--color-outline-variant)] mb-8 flex flex-col md:flex-row items-center gap-8">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=004ac6&color=fff&size=128`}
          alt={patient.name}
          className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-sm"
        />
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold mb-2">{patient.name}</h2>
          <p className="text-lg text-[var(--color-outline)] mb-4">
            Health ID: <span className="font-bold text-[var(--color-primary)]">{patient.mrn}</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[var(--color-primary)] font-medium text-sm">
              <span className="material-symbols-outlined text-sm">bloodtype</span> {patient.bloodType}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[var(--color-primary)] font-medium text-sm">
              <span className="material-symbols-outlined text-sm">cake</span> {patient.age} tahun
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[var(--color-primary)] font-medium text-sm">
              <span className="material-symbols-outlined text-sm">{patient.gender === 'Female' ? 'female' : 'male'}</span> {patient.gender}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <section className="md:col-span-4 bg-white rounded-xl p-8 shadow-sm border border-[var(--color-outline-variant)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-secondary)]" />
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-secondary)]">person</span>
            Info Pribadi
          </h3>
          <div className="space-y-5">
            <div><p className="text-xs text-[var(--color-outline)] font-bold uppercase mb-1">Email</p><p className="font-medium">{patient.email}</p></div>
            <div><p className="text-xs text-[var(--color-outline)] font-bold uppercase mb-1">Telepon</p><p className="font-medium">{patient.phone}</p></div>
            <div><p className="text-xs text-[var(--color-outline)] font-bold uppercase mb-1">Alamat</p><p className="font-medium whitespace-pre-line">{patient.address}</p></div>
            <div><p className="text-xs text-[var(--color-outline)] font-bold uppercase mb-1">Kontak Darurat</p><p className="font-medium whitespace-pre-line">{patient.emergencyContact}</p></div>
          </div>
        </section>

        <section className="md:col-span-8 bg-white rounded-xl p-8 shadow-sm border border-[var(--color-outline-variant)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]" />
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">description</span>
            Rekam Medis (Input Dokter)
          </h3>

          {records.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-outline)]">
              <span className="material-symbols-outlined text-5xl mb-3">medical_information</span>
              <p>Belum ada rekam medis</p>
              <p className="text-sm mt-1">Hasil pemeriksaan dokter akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec) => (
                <div key={rec.id} className="p-5 bg-gray-50 border border-[var(--color-outline-variant)] rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">{rec.diagnosis || 'Hasil Pemeriksaan'}</p>
                      <p className="text-sm text-[var(--color-outline)]">{rec.doctorName} • {formatDate(rec.date)}</p>
                    </div>
                    <button
                      onClick={() => alert(`Unduh rekam medis:\n\nDetak Jantung: ${rec.vitals.heartRate} bpm\nTekanan Darah: ${rec.vitals.bloodPressureSystolic}/${rec.vitals.bloodPressureDiastolic}\nBerat: ${rec.vitals.weight} kg\n\nDiagnosis: ${rec.diagnosis}\nCatatan: ${rec.notes}\nRekomendasi: ${rec.recommendations}`)}
                      className="text-[var(--color-primary)] text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Unduh
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-3 text-center border border-[var(--color-outline-variant)]">
                      <p className="text-xs text-[var(--color-outline)]">Detak Jantung</p>
                      <p className="font-bold">{rec.vitals.heartRate} bpm</p>
                      <p className="text-xs text-[var(--color-secondary)]">{rec.heartRateStatus}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-[var(--color-outline-variant)]">
                      <p className="text-xs text-[var(--color-outline)]">Tekanan Darah</p>
                      <p className="font-bold">{rec.vitals.bloodPressureSystolic}/{rec.vitals.bloodPressureDiastolic}</p>
                      <p className="text-xs text-[var(--color-secondary)]">{rec.bloodPressureStatus}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-[var(--color-outline-variant)]">
                      <p className="text-xs text-[var(--color-outline)]">Berat Badan</p>
                      <p className="font-bold">{rec.vitals.weight} kg</p>
                      <p className="text-xs text-[var(--color-secondary)]">{rec.weightNote}</p>
                    </div>
                  </div>
                  {rec.notes && <p className="text-sm text-[var(--color-outline)]"><strong>Catatan:</strong> {rec.notes}</p>}
                  {rec.recommendations && <p className="text-sm text-[var(--color-outline)] mt-1"><strong>Rekomendasi:</strong> {rec.recommendations}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
