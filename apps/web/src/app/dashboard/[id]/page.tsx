'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StateMessage } from '@/components/state-message';
import { Stagger, StaggerItem } from '@/components/motion';
import { AddAssetDialog } from '@/features/portfolio/components/add-asset-dialog';
import { AllocationChart } from '@/features/portfolio/components/allocation-chart';
import { AssetsPanel } from '@/features/portfolio/components/assets-panel';
import { ProfitabilityCard } from '@/features/portfolio/components/profitability-card';
import { RenamePortfolioDialog } from '@/features/portfolio/components/rename-portfolio-dialog';
import { DeletePortfolioDialog } from '@/features/portfolio/components/delete-portfolio-dialog';
import { usePortfolio } from '@/features/portfolio/hooks';
import { formatCurrency } from '@/lib/format';

export default function PortfolioDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: portfolio, isLoading, isError, refetch } = usePortfolio(id);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !portfolio ? (
        <StateMessage
          variant="error"
          title="Não foi possível carregar a carteira."
          description="Ela pode não existir ou houve um erro de conexão."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-2xl font-bold text-text">{portfolio.name}</h1>
                <RenamePortfolioDialog
                  id={portfolio.id}
                  currentName={portfolio.name}
                />
                <DeletePortfolioDialog id={portfolio.id} />
              </div>
              <p className="text-sm text-text-muted">
                {portfolio.assets.length}{' '}
                {portfolio.assets.length === 1 ? 'ativo' : 'ativos'}
              </p>
            </div>
            <AddAssetDialog portfolioId={portfolio.id} />
          </div>

          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StaggerItem>
              <SummaryStat label="Custo total" value={formatCurrency(portfolio.totalCost)} />
            </StaggerItem>
            <StaggerItem>
              <SummaryStat label="Valor de mercado" value={formatCurrency(portfolio.totalValue)} />
            </StaggerItem>
            <StaggerItem>
              <ProfitabilityCard
                totalCost={portfolio.totalCost}
                totalProfit={portfolio.totalProfit}
              />
            </StaggerItem>
          </Stagger>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.assets.length > 0 ? (
                  <AssetsPanel assets={portfolio.assets} />
                ) : (
                  <StateMessage
                    title="Nenhum ativo nesta carteira."
                    description="Adicione seu primeiro ativo para ver o desempenho."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alocação por tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <AllocationChart assets={portfolio.assets} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-text">{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
