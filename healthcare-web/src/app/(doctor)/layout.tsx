import { DoctorHeader } from '@/components/doctor/DoctorHeader';
import { DoctorSidebar } from '@/components/doctor/DoctorSidebar';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <DoctorSidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-w-0">
        <DoctorHeader />
        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
