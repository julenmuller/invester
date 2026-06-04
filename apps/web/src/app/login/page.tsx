import Link from 'next/link';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <AuthShell
      title="Entrar"
      description="Acesse sua conta para gerenciar suas carteiras."
      footer={
        <>
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
