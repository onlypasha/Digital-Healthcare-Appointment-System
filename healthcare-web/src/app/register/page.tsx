import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default async function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4 py-8">
      <Suspense fallback={<div className="text-[var(--color-outline)]">Memuat...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
