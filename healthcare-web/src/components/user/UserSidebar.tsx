'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const MENU_ITEMS = [
  { icon: 'grid_view', label: 'Overview', path: '/dashboard' },
  { icon: 'search', label: 'Find Doctors', path: '/doctors' },
  { icon: 'calendar_month', label: 'My Schedule', path: '/schedule' },
  { icon: 'folder_open', label: 'Health Files', path: '/profile' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

export function UserSidebar() {
  const pathname = usePathname() || '';

  return (
    <aside className="w-[280px] bg-white border-r border-[var(--color-outline-variant)] flex flex-col fixed h-full z-10">
      <div className="h-20 flex items-center px-8 border-b border-[var(--color-outline-variant)]">
        <div className="bg-[var(--color-primary)] text-white p-2 rounded-xl mr-3 shadow-sm shadow-[var(--color-primary)]/30">
          <span className="material-symbols-outlined text-2xl">health_and_safety</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">CareConnect</h1>
      </div>
      
      <div className="px-6 py-6 border-b border-[var(--color-outline-variant)]">
        <Link href="/doctors" className="w-full bg-[var(--color-primary)] hover:bg-blue-700 text-white rounded-xl py-3 px-4 font-medium flex items-center justify-center transition-colors shadow-md shadow-[var(--color-primary)]/20">
          <span className="material-symbols-outlined mr-2">add_circle</span>
          Book New
        </Link>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-white font-medium shadow-md shadow-[var(--color-primary)]/20' 
                  : 'text-[var(--color-outline)] hover:bg-[var(--color-surface)] hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined mr-4">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[var(--color-outline-variant)]">
        <nav className="flex flex-col gap-1 px-2 pb-4">
          <Link href="/support" className="flex items-center px-3 py-2 rounded-lg text-[var(--color-outline)] hover:bg-[var(--color-surface)] hover:text-black transition-colors">
            <span className="material-symbols-outlined mr-3">help</span>
            Support
          </Link>
          <Link href="/logout" className="flex items-center px-3 py-2 rounded-lg text-[var(--color-error)] hover:bg-red-50 transition-colors">
            <span className="material-symbols-outlined mr-3">logout</span>
            Log Out
          </Link>
        </nav>
      </div>
    </aside>
  );
}
