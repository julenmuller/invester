'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LineChart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAuth, getUser } from '@/lib/auth';

/** Top bar shown across the dashboard: brand, current user, and logout. */
export function DashboardHeader() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    setName(getUser()?.name ?? null);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-surface-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary">
          <LineChart className="h-6 w-6" />
          <span className="text-lg font-bold text-text">InvestHub</span>
        </Link>
        <div className="flex items-center gap-3">
          {name && (
            <span className="hidden text-sm text-text-muted sm:inline">
              Olá, {name}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
