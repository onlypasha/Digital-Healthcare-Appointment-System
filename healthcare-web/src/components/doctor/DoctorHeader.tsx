import Link from 'next/link';
import { getSession } from '@/lib/auth';

export async function DoctorHeader() {
  const session = await getSession();
  const name = session?.name ?? 'Dokter';

  return (
    <header className="h-16 bg-white border-b border-[var(--color-outline-variant)] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-sm font-medium text-[var(--color-outline)]">
        Portal Dokter — <span className="text-black">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/doctor/appointments" className="hidden md:flex items-center bg-[var(--color-secondary)] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:opacity-90">
          Lihat Janji Temu
        </Link>
        <Link href="/logout" className="p-2 text-[var(--color-error)] hover:bg-red-50 rounded-full">
          <span className="material-symbols-outlined">logout</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center font-medium">
          {name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
