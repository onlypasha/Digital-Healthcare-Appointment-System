'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Doctors', path: '/doctors' },
  { label: 'Appointments', path: '/schedule' },
  { label: 'Records', path: '/profile' },
];

export function UserNavbar() {
  const pathname = usePathname() || '';

  return (
    <nav className="h-20 bg-white border-b border-[var(--color-outline-variant)] flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center mr-12">
          <div className="bg-[var(--color-primary)] text-white p-2 rounded-xl mr-3 shadow-sm shadow-[var(--color-primary)]/30">
            <span className="material-symbols-outlined text-2xl">health_and_safety</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">CareConnect</h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-[var(--color-primary)]' 
                    : 'text-[var(--color-outline)] hover:bg-gray-50 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <a href="tel:911" className="hidden md:flex items-center bg-red-50 text-[var(--color-error)] px-4 py-2 rounded-full font-medium hover:bg-red-100 transition-colors">
          <span className="material-symbols-outlined mr-2 text-sm">emergency</span>
          Emergency
        </a>
        <div className="h-8 w-px bg-[var(--color-outline-variant)] mx-2 hidden md:block"></div>
        <Link href="/settings" className="p-2 text-[var(--color-outline)] hover:text-black hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Settings">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <Link href="/support" className="p-2 text-[var(--color-outline)] hover:text-black hover:bg-gray-100 rounded-full transition-colors hidden sm:block" title="Support">
          <span className="material-symbols-outlined">help</span>
        </Link>
        <Link href="/profile" className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden ml-2">
          <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=004ac6&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
        </Link>
        <Link href="/logout" className="p-2 text-[var(--color-error)] hover:bg-red-50 rounded-full transition-colors" title="Log Out">
          <span className="material-symbols-outlined">logout</span>
        </Link>
      </div>
    </nav>
  );
}
