import { Briefcase, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Stagger, StaggerItem } from '@/components/motion';
import { formatCurrency } from '@/lib/format';

interface SummaryCardsProps {
  /** Sum of invested cost across all portfolios. */
  totalInvested: number;
  /** Number of portfolios. */
  portfolioCount: number;
}

/** Top-of-dashboard KPI cards. */
export function SummaryCards({ totalInvested, portfolioCount }: SummaryCardsProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SummaryCard
        icon={<Wallet className="h-5 w-5 text-primary" />}
        label="Patrimônio investido"
        value={formatCurrency(totalInvested)}
      />
      <SummaryCard
        icon={<Briefcase className="h-5 w-5 text-primary" />}
        label="Carteiras"
        value={String(portfolioCount)}
      />
    </Stagger>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <StaggerItem>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft">
            {icon}
          </div>
          <div>
            <p className="text-sm text-text-muted">{label}</p>
            <p className="font-mono text-2xl font-bold tabular-nums text-text">
              {value}
            </p>
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}
