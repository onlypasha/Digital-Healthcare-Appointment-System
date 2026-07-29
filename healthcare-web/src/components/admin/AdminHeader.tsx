import Link from 'next/link';
import { getSession } from '@/lib/auth';

export async function AdminHeader() {
  const session = await getSession();
  const name = session?.name ?? 'Admin';

  return (
    <header className="h-16 bg-white border-b border-[var(--color-outline-variant)] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center text-sm font-medium text-[var(--color-outline)]">
        Welcome back, <span className="text-black ml-1">{name}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Link href="/admin/appointments/new" className="hidden md:flex items-center bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <span className="material-symbols-outlined text-sm mr-1">add</span>
          New Appointment
        </Link>
        
        <Link href="/admin/settings" className="p-2 text-[var(--color-outline)] hover:text-black hover:bg-gray-100 rounded-full transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        
        <Link href="/logout" className="p-2 text-[var(--color-error)] hover:bg-red-50 rounded-full transition-colors" title="Log Out">
          <span className="material-symbols-outlined">logout</span>
        </Link>
        
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-medium ml-2">
          {name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
