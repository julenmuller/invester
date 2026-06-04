'use client';

import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MotionTableBody,
  MotionTableRow,
  fadeUp,
  staggerContainer,
} from '@/components/motion';
import { ProfitValue } from '@/components/profit-value';
import { formatCurrency, formatQuantity } from '@/lib/format';
import { ASSET_TYPE_LABELS, type AssetSnapshot } from '@/lib/types';

/** Tabular view of a portfolio's positions with per-asset profit/loss. */
export function AssetsTable({ assets }: { assets: AssetSnapshot[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ativo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Qtd.</TableHead>
          <TableHead className="text-right">Preço médio</TableHead>
          <TableHead className="text-right">Cotação</TableHead>
          <TableHead className="text-right">Posição</TableHead>
          <TableHead className="text-right">Resultado</TableHead>
        </TableRow>
      </TableHeader>
      <MotionTableBody
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {assets.map((asset) => (
          <MotionTableRow key={asset.id} variants={fadeUp}>
            <TableCell className="font-mono font-medium text-text">
              {asset.ticker}
            </TableCell>
            <TableCell className="text-text-muted">
              {ASSET_TYPE_LABELS[asset.type]}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatQuantity(asset.quantity)}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatCurrency(asset.avgPrice)}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatCurrency(asset.currentPrice)}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatCurrency(asset.marketValue)}
            </TableCell>
            <TableCell className="text-right">
              <ProfitValue
                value={asset.unrealizedProfit}
                percentage={asset.profitPercentage}
              />
            </TableCell>
          </MotionTableRow>
        ))}
      </MotionTableBody>
    </Table>
  );
}
