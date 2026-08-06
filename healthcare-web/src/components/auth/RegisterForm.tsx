'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SPECIALTIES = [
  'Dokter Umum',
  'Spesialis Jantung (Cardiology)',
  'Spesialis Kulit & Kelamin (Dermatology)',
  'Spesialis Saraf (Neurology)',
  'Spesialis Anak (Pediatrics)',
  'Spesialis Tulang & Bedah (Orthopedics)',
  'Spesialis Penyakit Dalam (Internal Medicine)',
  'Spesialis Gigi (Dentistry)',
  'Spesialis Mata (Ophthalmology)',
];

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Doctor Specific Fields
  const [specialty, setSpecialty] = useState('Dokter Umum');
  const [hospital, setHospital] = useState('');
  const [experience, setExperience] = useState('3+ Tahun Pengalaman');
  const [fee, setFee] = useState('150000');
  const [location, setLocation] = useState('Jakarta');
  const [expertise, setExpertise] = useState('Konsultasi Umum');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSuccessMessage, setPendingSuccessMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        phone,
        gender,
        role,
        password,
      };

      if (role === 'doctor') {
        payload.specialty = specialty;
        payload.hospital = hospital || 'CareConnect Clinic';
        payload.experience = experience;
        payload.fee = Number(fee) || 150000;
        payload.location = location;
        payload.bio = bio;
        payload.expertise = expertise ? expertise.split(',').map((s) => s.trim()) : ['Konsultasi Medis'];
      }

      const res = await fetch('/api/auth/register/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Pendaftaran gagal');
        return;
      }

      if (data.pendingApproval) {
        setPendingSuccessMessage(data.message);
        return;
      }

      router.push(data.redirect || '/');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  if (pendingSuccessMessage) {
    return (
      <div className="w-full max-w-lg my-8">
        <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          <div className="inline-flex items-center justify-center bg-amber-50 text-amber-600 p-5 rounded-2xl shadow-inner border border-amber-100">
            <span className="material-symbols-outlined text-5xl">hourglass_top</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registrasi Dokter Berhasil!</h2>
            <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mt-1">
              Menunggu Verifikasi Super Admin (SA)
            </p>
          </div>
          <p className="text-sm text-gray-600 bg-amber-50/60 p-4 rounded-xl border border-amber-100/60 leading-relaxed text-left">
            {pendingSuccessMessage}
          </p>
          <div className="pt-2">
            <Link
              href="/logout"
              className="w-full inline-block bg-[var(--color-primary)] text-white py-3.5 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-[var(--color-primary)]/20 text-sm"
            >
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${role === 'doctor' ? 'max-w-2xl' : 'max-w-md'} my-8 transition-all duration-300`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white p-3 rounded-2xl mb-4 shadow-lg shadow-[var(--color-primary)]/30">
          <span className="material-symbols-outlined text-4xl">
            {role === 'doctor' ? 'medical_services' : 'person_add'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black">CareConnect</h1>
        <p className="text-[var(--color-outline)] mt-2">
          {role === 'doctor' ? 'Pendaftaran Portal Dokter Medis' : 'Buat Akun Pasien Baru'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-8 shadow-sm space-y-5"
      >
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-blue-600 text-base flex-shrink-0">info</span>
          <span>
            Pendaftaran khusus untuk <strong>Pasien</strong> & <strong>Dokter</strong>. Akun <strong>Admin</strong> sudah tersedia bawaan di sistem.
          </span>
        </div>

        {error && (
          <div className="bg-red-50 text-[var(--color-error)] text-sm px-4 py-3 rounded-lg border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
            Daftar Sebagai
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center space-x-2 ${
                role === 'patient'
                  ? 'bg-blue-50 border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-outline)] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">patient_list</span>
              <span>Pasien</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center space-x-2 ${
                role === 'doctor'
                  ? 'bg-blue-50 border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-outline)] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">medical_services</span>
              <span>Dokter Medis</span>
            </button>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={role === 'doctor' ? '' : 'md:col-span-2'}>
            <label htmlFor="name" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              {role === 'doctor' ? 'Nama Lengkap (dengan Gelar)' : 'Nama Lengkap'}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'doctor' ? 'Dr. Budi Santoso, Sp.A' : 'Ahmad Subagyo'}
              required
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              No. HP / WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              required
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              Jenis Kelamin
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
        </div>

        {/* Extended Doctor Registration Fields */}
        {role === 'doctor' && (
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-primary)] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">badge</span>
              Detail Kelengkapan Dokter Medis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Spesialisasi *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Klinik / Rumah Sakit Praktik *
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="RS Medika / Klinik CareConnect"
                  required
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Pengalaman Praktik *
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="5+ Tahun Pengalaman"
                  required
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Tarif Konsultasi (Rp) *
                </label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="150000"
                  required
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Kota / Lokasi Praktik *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Jakarta Selatan"
                  required
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                  Keahlian Medis Utama (Pisah Koma)
                </label>
                <input
                  type="text"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="Konsultasi Umum, Ekokardiografi"
                  className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
                Biografi Singkat / Deskripsi
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan latar belakang singkat mengenai pengalaman medis dan keahlian Anda..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
          </div>
        )}

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider mb-2">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-white border border-[var(--color-outline-variant)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-md shadow-[var(--color-primary)]/20 mt-2 text-sm"
        >
          {loading ? 'Mendaftarkan Akun...' : role === 'doctor' ? 'Kirim Pendaftaran Dokter (Butuh Persetujuan SA)' : 'Daftar Akun Pasien'}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-[var(--color-outline)]">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
              Masuk ke Portal
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
