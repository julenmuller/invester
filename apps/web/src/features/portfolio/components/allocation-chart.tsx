'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { assetTypeColors, colors } from '@/styles/tokens';
import { formatCurrency, formatPercent } from '@/lib/format';
import { ASSET_TYPE_LABELS, type AssetSnapshot, type AssetType } from '@/lib/types';

interface AllocationDatum {
  type: AssetType;
  name: string;
  value: number;
}

/**
 * Donut chart of allocation by asset type, derived from the assets' market
 * value. Computed on the client because the REST endpoints return raw assets.
 * Works for a single portfolio or the consolidated set (all assets concatenated).
 */
export function AllocationChart({ assets }: { assets: AssetSnapshot[] }) {
  const data = useMemo<AllocationDatum[]>(() => {
    const byType = new Map<AssetType, number>();
    for (const asset of assets) {
      byType.set(asset.type, (byType.get(asset.type) ?? 0) + asset.marketValue);
    }
    return Array.from(byType.entries())
      .filter(([, value]) => value > 0)
      .map(([type, value]) => ({
        type,
        name: ASSET_TYPE_LABELS[type],
        value,
      }));
  }, [assets]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">
        Sem dados de alocação ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke={colors.surface.DEFAULT}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.type} fill={assetTypeColors[entry.type]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: colors.surface.DEFAULT,
              border: `1px solid ${colors.surface.border}`,
              borderRadius: 12,
              color: colors.text.DEFAULT,
              fontFamily: 'var(--font-mono)',
            }}
            formatter={(value: number) => [
              `${formatCurrency(value)} (${formatPercent(
                total === 0 ? 0 : (value / total) * 100,
              )})`,
              'Alocação',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend — token colors + share, legible on dark. */}
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.type} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-text-muted">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: assetTypeColors[d.type] }}
              />
              {d.name}
            </span>
            <span className="font-mono tabular-nums text-text">
              {formatPercent(total === 0 ? 0 : (d.value / total) * 100).replace('+', '')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
