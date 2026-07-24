'use client';

import { FormEvent, useState } from 'react';

export function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-2">Dukungan</h1>
      <p className="text-[var(--color-outline)] mb-8">Hubungi tim kami jika Anda butuh bantuan</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { icon: 'call', title: 'Telepon', value: '+62 21 1234 5678' },
          { icon: 'mail', title: 'Email', value: 'support@careconnect.id' },
          { icon: 'schedule', title: 'Jam Operasional', value: 'Sen–Jum, 08:00–17:00' },
          { icon: 'chat', title: 'Live Chat', value: 'Tersedia di aplikasi mobile' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-5 flex items-start gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">{item.icon}</span>
            <div>
              <p className="font-bold text-black text-sm">{item.title}</p>
              <p className="text-sm text-[var(--color-outline)] mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {submitted && (
        <div className="mb-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium">
          Pesan Anda telah terkirim. Tim kami akan merespons dalam 24 jam.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-black">Kirim Pesan</h2>
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Subjek</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Masalah teknis, pertanyaan akun, dll."
            className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-2">Pesan</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Jelaskan masalah Anda..."
            className="w-full px-4 py-2 border border-[var(--color-outline-variant)] rounded-lg text-sm focus:border-[var(--color-primary)] focus:outline-none resize-none"
          />
        </div>
        <button type="submit" className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
          Kirim Pesan
        </button>
      </form>
    </div>
  );
}
