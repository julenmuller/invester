'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Stagger, StaggerItem } from '@/components/motion';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface NetWorthHeroProps {
  /** Consolidated market value across all portfolios — the headline number. */
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  profitPercentage: number;
  portfolioCount: number;
}

/**
 * Hero panel for the dashboard: the consolidated net worth shown large in the
 * monospace numeric face, with the result and a few secondary KPIs.
 */
export function NetWorthHero({
  totalValue,
  totalInvested,
  totalProfit,
  profitPercentage,
  portfolioCount,
}: NetWorthHeroProps) {
  const positive = totalProfit >= 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Soft accent wash in the corner — ambience, stays behind the text. */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary opacity-[0.07] blur-3xl" />
      <CardContent className="p-6 sm:p-8">
        <Stagger className="flex flex-col gap-6">
          <StaggerItem>
            <p className="text-sm text-text-muted">Patrimônio total</p>
            <p className="mt-1 font-mono text-4xl font-bold tabular-nums text-text sm:text-5xl">
              {formatCurrency(totalValue)}
            </p>
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1.5 text-sm font-medium',
                positive ? 'text-profit' : 'text-loss',
              )}
            >
              {positive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-mono tabular-nums">
                {formatCurrency(totalProfit)} ({formatPercent(profitPercentage)})
              </span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-2 gap-4 border-t border-surface-border pt-5 sm:grid-cols-3">
              <Stat label="Investido" value={formatCurrency(totalInvested)} />
              <Stat label="Valor de mercado" value={formatCurrency(totalValue)} />
              <Stat label="Carteiras" value={String(portfolioCount)} />
            </div>
          </StaggerItem>
        </Stagger>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-text">
        {value}
      </p>
    </div>
  );
}
