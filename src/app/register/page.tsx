import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getSession, getRedirectForRole } from '@/lib/auth';

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(getRedirectForRole(session.role));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4 py-8">
      <Suspense fallback={<div className="text-[var(--color-outline)]">Memuat...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
