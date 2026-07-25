import { UserSidebar } from '@/components/user/UserSidebar';

export default function UserSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <UserSidebar />
      <main className="flex-1 ml-[280px] flex flex-col min-w-0">
        <div className="flex-1 overflow-x-hidden p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
