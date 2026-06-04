'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ProfitabilityCardProps {
  /** Invested cost — denominator for the return percentage. */
  totalCost: number;
  /** Unrealized result in BRL. */
  totalProfit: number;
}

/**
 * Headline profitability of a portfolio: the return as a percentage shown large
 * (mono), the absolute result, and an up/down indicator. Green for gains, coral
 * for losses — same semantics as everywhere else.
 */
export function ProfitabilityCard({ totalCost, totalProfit }: ProfitabilityCardProps) {
  const percentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const positive = totalProfit >= 0;

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          'pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-[0.08] blur-2xl',
          positive ? 'bg-profit' : 'bg-loss',
        )}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">Rentabilidade</p>
          <span
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-full',
              positive ? 'bg-profit-soft text-profit' : 'bg-loss-soft text-loss',
            )}
          >
            {positive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </span>
        </div>
        <p
          className={cn(
            'mt-1 font-mono text-3xl font-bold tabular-nums',
            positive ? 'text-profit' : 'text-loss',
          )}
        >
          {formatPercent(percentage)}
        </p>
        <p className="mt-1 font-mono text-sm tabular-nums text-text-muted">
          {formatCurrency(totalProfit)}
        </p>
      </CardContent>
    </Card>
  );
}
