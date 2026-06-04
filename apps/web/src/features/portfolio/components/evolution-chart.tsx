'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { colors } from '@/styles/tokens';
import { formatCurrency } from '@/lib/format';
import { deriveNetWorthHistory } from '../lib/history';

interface EvolutionChartProps {
  totalInvested: number;
  totalValue: number;
}

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Net-worth evolution as an area chart. The series is DERIVED on the client
 * (see ../lib/history) because the API exposes only the current value — hence
 * the "estimativa" caption. Replace with a real history endpoint when available.
 */
export function EvolutionChart({ totalInvested, totalValue }: EvolutionChartProps) {
  const data = useMemo(
    () => deriveNetWorthHistory(totalInvested, totalValue, 6),
    [totalInvested, totalValue],
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="netWorthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.primary.DEFAULT} stopOpacity={0.35} />
            <stop offset="100%" stopColor={colors.primary.DEFAULT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={colors.surface.border}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          stroke={colors.text.muted}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          stroke={colors.text.muted}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={48}
          tickFormatter={(v: number) => compact.format(v)}
        />
        <Tooltip
          cursor={{ stroke: colors.surface.border }}
          contentStyle={{
            background: colors.surface.DEFAULT,
            border: `1px solid ${colors.surface.border}`,
            borderRadius: 12,
            color: colors.text.DEFAULT,
            fontFamily: 'var(--font-mono)',
          }}
          labelStyle={{ color: colors.text.muted }}
          formatter={(value: number) => [formatCurrency(value), 'Patrimônio']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.primary.DEFAULT}
          strokeWidth={2}
          fill="url(#netWorthFill)"
          dot={false}
          activeDot={{ r: 4, fill: colors.primary.DEFAULT }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
