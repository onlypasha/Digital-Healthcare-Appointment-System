'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status >= 500) {
          setError('Server sedang sibuk');
        } else {
          setError(data.error ?? 'Login gagal');
        }
        return;
      }

      const redirect = searchParams.get('redirect') || data.redirect;
      router.push(redirect);
      router.refresh();
    } catch {
      setError('Server sedang sibuk');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white p-3 rounded-2xl mb-4 shadow-lg shadow-[var(--color-primary)]/30">
          <span className="material-symbols-outlined text-4xl">health_and_safety</span>
        </div>
        <h1 className="text-3xl font-bold text-black">CareConnect</h1>
        <p className="text-[var(--color-outline)] mt-2">Masuk ke portal kesehatan Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-8 shadow-sm space-y-5">
        {error && (
          <div className="bg-red-50 text-[var(--color-error)] text-sm px-4 py-3 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-md shadow-[var(--color-primary)]/20"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-sm">vpn_key</span>
            <span>Akun Default Sistem:</span>
          </div>
          <p><strong>Admin:</strong> admin@careconnect.com (pass: password123)</p>
          <p><strong>Pasien:</strong> patient@careconnect.com (pass: password123)</p>
          <p><strong>Dokter:</strong> doctor@careconnect.com (pass: password123)</p>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-[var(--color-outline)]">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[var(--color-primary)] font-bold hover:underline">
              Daftar Akun Baru (Pasien / Dokter)
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
