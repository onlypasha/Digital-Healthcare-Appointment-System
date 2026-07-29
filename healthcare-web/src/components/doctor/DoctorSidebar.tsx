'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/doctor/dashboard' },
  { icon: 'calendar_month', label: 'Janji Temu', path: '/doctor/appointments' },
  { icon: 'groups', label: 'Pasien Saya', path: '/doctor/patients' },
];

export function DoctorSidebar() {
  const pathname = usePathname() || '';

  return (
    <aside className="w-[260px] bg-white border-r border-[var(--color-outline-variant)] flex flex-col fixed h-full z-10">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-outline-variant)]">
        <Link href="/doctor/dashboard" className="flex items-center">
          <div className="bg-[var(--color-secondary)] text-white p-1.5 rounded-lg mr-3">
            <span className="material-symbols-outlined text-xl">stethoscope</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-secondary)]">CareDoctor</h1>
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
                  ? 'bg-teal-50 text-[var(--color-secondary)] font-medium border-l-4 border-[var(--color-secondary)]'
                  : 'text-[var(--color-outline)] hover:bg-gray-50 hover:text-black border-l-4 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-outline-variant)]">
        <Link href="/logout" className="flex items-center px-3 py-2 rounded-lg text-[var(--color-error)] hover:bg-red-50 transition-colors text-sm font-medium">
          <span className="material-symbols-outlined mr-3 text-lg">logout</span>
          Keluar
        </Link>
      </div>
    </aside>
  );
}
