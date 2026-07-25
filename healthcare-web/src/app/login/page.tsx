import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { getSession, getRedirectForRole } from '@/lib/auth';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(getRedirectForRole(session.role));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4 py-12">
      <Suspense fallback={<div className="text-[var(--color-outline)]">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
