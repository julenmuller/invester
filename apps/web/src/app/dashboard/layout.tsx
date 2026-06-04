import { DashboardHeader } from '@/features/portfolio/components/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Transparent so the fixed InteractiveBackground (mounted in the root
    // layout) shows through the whitespace; cards remain solid surfaces.
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="container py-6 sm:py-8">{children}</div>
    </div>
  );
}
