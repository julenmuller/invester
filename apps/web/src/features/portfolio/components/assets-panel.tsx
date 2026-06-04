'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StateMessage } from '@/components/state-message';
import { AssetsTable } from './assets-table';
import {
  ASSET_TYPES,
  ASSET_TYPE_LABELS,
  type AssetSnapshot,
  type AssetType,
} from '@/lib/types';
import { cn } from '@/lib/utils';

type TypeFilter = AssetType | 'ALL';

/**
 * Interactive wrapper around AssetsTable: real-time ticker search and an
 * asset-type filter, applied client-side over the already-loaded positions.
 */
export function AssetsPanel({ assets }: { assets: AssetSnapshot[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return assets.filter(
      (a) =>
        (type === 'ALL' || a.type === type) &&
        (q === '' || a.ticker.toUpperCase().includes(q)),
    );
  }, [assets, query, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ticker..."
            aria-label="Buscar por ticker"
            className="pl-9 font-mono uppercase placeholder:normal-case"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={type === 'ALL'} onClick={() => setType('ALL')}>
            Todos
          </FilterChip>
          {ASSET_TYPES.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
              {ASSET_TYPE_LABELS[t]}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <AssetsTable assets={filtered} />
      ) : (
        <StateMessage
          title="Nenhum ativo encontrado."
          description="Ajuste a busca ou o filtro de tipo."
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-all duration-200',
        active
          ? 'border-primary bg-primary-soft text-primary shadow-glow'
          : 'border-surface-border text-text-muted hover:border-primary/40 hover:text-text',
      )}
    >
      {children}
    </button>
  );
}
