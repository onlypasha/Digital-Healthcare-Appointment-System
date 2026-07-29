'use client';

import { useEffect, useState } from 'react';
import type { UserSettings } from '@/lib/types';

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
  }, []);

  async function save(updates: Partial<UserSettings>) {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      setSettings(await res.json());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (!settings) return <div className="text-[var(--color-outline)]">Memuat...</div>;

  const toggles = [
    { key: 'notifications' as const, label: 'Notifikasi Push', desc: 'Terima notifikasi janji temu' },
    { key: 'emailAlerts' as const, label: 'Email Alert', desc: 'Pengingat via email' },
    { key: 'smsAlerts' as const, label: 'SMS Alert', desc: 'Pengingat via SMS' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-2">Pengaturan</h1>
      <p className="text-[var(--color-outline)] mb-8">Kelola preferensi akun Anda</p>

      {saved && (
        <div className="mb-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-200 text-sm font-medium">
          Pengaturan disimpan
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] shadow-sm divide-y divide-[var(--color-outline-variant)]">
        {toggles.map((t) => (
          <div key={t.key} className="p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-black">{t.label}</p>
              <p className="text-sm text-[var(--color-outline)]">{t.desc}</p>
            </div>
            <button
              onClick={() => save({ [t.key]: !settings[t.key] })}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings[t.key] ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[t.key] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}

        <div className="p-6">
          <label className="block font-bold text-black mb-2">Bahasa</label>
          <select
            value={settings.language}
            onChange={(e) => save({ language: e.target.value })}
            className="w-full border border-[var(--color-outline-variant)] rounded-lg px-4 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
