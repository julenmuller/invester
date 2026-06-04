'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp } from '@/components/motion';
import { formatCurrency } from '@/lib/format';
import type { PortfolioListItem } from '@/lib/types';

/** A single clickable portfolio entry in the dashboard list. */
export function PortfolioCard({ portfolio }: { portfolio: PortfolioListItem }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/dashboard/${portfolio.id}`}
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="transition-colors hover:border-primary hover:shadow-glow">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="truncate font-semibold text-text">{portfolio.name}</p>
              <p className="text-sm text-text-muted">
                {portfolio.assetsCount}{' '}
                {portfolio.assetsCount === 1 ? 'ativo' : 'ativos'} ·{' '}
                <span className="font-mono">{formatCurrency(portfolio.totalCost)}</span>
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
