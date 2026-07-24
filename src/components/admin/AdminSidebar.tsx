'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const MENU_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: 'stethoscope', label: 'Doctors', path: '/admin/doctors' },
  { icon: 'patient_list', label: 'Patients', path: '/admin/patients' },
  { icon: 'calendar_clock', label: 'Appointments', path: '/admin/appointments' },
  { icon: 'bar_chart', label: 'Reports', path: '/admin/reports' },
  { icon: 'settings', label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname() || '';

  return (
    <aside className="w-[260px] bg-white border-r border-[var(--color-outline-variant)] flex flex-col fixed h-full z-10">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-outline-variant)]">
        <Link href="/admin/dashboard" className="flex items-center">
          <div className="bg-[var(--color-primary)] text-white p-1.5 rounded-lg mr-3">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-primary)]">HealthAdmin</h1>
        </Link>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-[var(--color-primary)] font-medium border-l-4 border-[var(--color-primary)]' 
                  : 'text-[var(--color-outline)] hover:bg-gray-50 hover:text-black border-l-4 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[var(--color-outline-variant)] space-y-2">
        <Link href="/logout" className="flex items-center px-3 py-2 rounded-lg text-[var(--color-error)] hover:bg-red-50 transition-colors text-sm font-medium">
          <span className="material-symbols-outlined mr-3 text-lg">logout</span>
          Log Out
        </Link>
        <div className="bg-[var(--color-surface-admin)] p-4 rounded-xl text-center">
          <p className="text-sm font-medium">Expert Medical Precision</p>
          <p className="text-xs text-[var(--color-outline)] mt-1">Admin Panel v2.0</p>
        </div>
      </div>
    </aside>
  );
}
