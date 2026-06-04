'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StateMessage } from '@/components/state-message';
import { Stagger } from '@/components/motion';
import { CreatePortfolioDialog } from '@/features/portfolio/components/create-portfolio-dialog';
import { PortfolioCard } from '@/features/portfolio/components/portfolio-card';
import { NetWorthHero } from '@/features/portfolio/components/net-worth-hero';
import { EvolutionChart } from '@/features/portfolio/components/evolution-chart';
import { AllocationChart } from '@/features/portfolio/components/allocation-chart';
import { usePortfolios, usePortfoliosOverview } from '@/features/portfolio/hooks';

export default function DashboardPage() {
  const { data: portfolios } = usePortfolios();
  const { data: overview, isLoading, isError, refetch } = usePortfoliosOverview();

  const hasPortfolios = (portfolios?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Visão geral</h1>
          <p className="text-sm text-text-muted">
            Acompanhe o desempenho consolidado dos seus investimentos.
          </p>
        </div>
        <CreatePortfolioDialog />
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <StateMessage
          variant="error"
          title="Não foi possível carregar suas carteiras."
          description="Verifique sua conexão e tente novamente."
          onRetry={() => refetch()}
        />
      ) : !hasPortfolios ? (
        <StateMessage
          title="Você ainda não tem carteiras."
          description="Crie sua primeira carteira para começar a acompanhar seus ativos."
        />
      ) : (
        overview && (
          <>
            <NetWorthHero
              totalValue={overview.totalValue}
              totalInvested={overview.totalInvested}
              totalProfit={overview.totalProfit}
              profitPercentage={overview.profitPercentage}
              portfolioCount={overview.portfolioCount}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-baseline justify-between space-y-0">
                  <CardTitle>Evolução do patrimônio</CardTitle>
                  <span className="text-xs text-text-muted">estimativa</span>
                </CardHeader>
                <CardContent>
                  <EvolutionChart
                    totalInvested={overview.totalInvested}
                    totalValue={overview.totalValue}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alocação por classe</CardTitle>
                </CardHeader>
                <CardContent>
                  <AllocationChart assets={overview.allAssets} />
                </CardContent>
              </Card>
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-text">Minhas carteiras</h2>
              <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {portfolios?.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </Stagger>
            </section>
          </>
        )
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-44" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
