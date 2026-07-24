import { UserNavbar } from '@/components/user/UserNavbar';

export default function UserNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      <UserNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
