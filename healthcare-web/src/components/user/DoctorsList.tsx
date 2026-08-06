'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Doctor } from '@/lib/types';

const SPECIALTIES = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'];

export function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setDoctors(data);
      })
      .catch((err) => console.error('Error loading doctors:', err));
  }, []);

  const filtered = useMemo(() => {
    let result = [...doctors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q)
      );
    }
    if (selectedSpecialties.length > 0) {
      result = result.filter((d) => selectedSpecialties.includes(d.specialty));
    }
    if (minRating > 0) {
      result = result.filter((d) => d.rating >= minRating);
    }
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [doctors, search, selectedSpecialties, minRating, sortBy]);

  function toggleSpecialty(s: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 h-fit sticky top-28 shadow-sm">
        <h2 className="text-2xl font-bold text-black mb-6">Filter</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari dokter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-black mb-3">Spesialisasi</h3>
          <div className="space-y-2">
            {SPECIALTIES.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(s)}
                  onChange={() => toggleSpecialty(s)}
                  className="rounded border-[var(--color-outline-variant)] text-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-outline)]">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-black mb-3">Rating Minimum</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setMinRating(star === minRating ? 0 : star)} className="p-1">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: star <= minRating ? "'FILL' 1" : "'FILL' 0", color: star <= minRating ? '#eab308' : '#c3c6d7' }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setSelectedSpecialties([]); setMinRating(0); setSearch(''); }}
          className="w-full border border-[var(--color-outline-variant)] text-sm py-2 rounded-lg hover:bg-gray-50"
        >
          Reset Filter
        </button>
      </aside>

      <main className="flex-1">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Dokter Tersedia</h1>
            <p className="text-[var(--color-outline)] mt-1">Menampilkan {filtered.length} hasil</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-sm"
          >
            <option value="recommended">Rekomendasi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-[var(--color-outline-variant)] overflow-hidden hover:shadow-lg transition-all flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random`}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full border border-[var(--color-outline-variant)]"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{doc.name}</h3>
                    <p className="text-sm text-[var(--color-secondary)] font-medium">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs text-[var(--color-outline)]">{doc.rating} ({doc.reviews} ulasan)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-outline)] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">local_hospital</span>
                  {doc.hospital}
                </p>
              </div>
              <div className="p-4 border-t border-[var(--color-outline-variant)]">
                <Link
                  href={`/doctors/${doc.id}`}
                  className="block w-full bg-[var(--color-primary)] text-white text-sm py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-center"
                >
                  Buat Janji
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--color-outline)]">
            Tidak ada dokter yang cocok dengan filter Anda
          </div>
        )}
      </main>
    </div>
  );
}
