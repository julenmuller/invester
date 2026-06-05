'use client';

import { useMemo } from 'react';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  AddAssetInput,
  AssetSnapshot,
  CreatePortfolioInput,
  PortfolioDetail,
  PortfolioListItem,
} from '@/lib/types';

export const portfolioKeys = {
  all: ['portfolios'] as const,
  list: () => [...portfolioKeys.all, 'list'] as const,
  detail: (id: string) => [...portfolioKeys.all, 'detail', id] as const,
};

/** GET /portfolios */
export function usePortfolios() {
  return useQuery({
    queryKey: portfolioKeys.list(),
    queryFn: async () => {
      const { data } = await api.get<PortfolioListItem[]>('/portfolios');
      return data;
    },
  });
}

/** GET /portfolios/:id */
export function usePortfolio(id: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<PortfolioDetail>(`/portfolios/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

/**
 * Consolidated view across every portfolio. Reuses the existing detail endpoint
 * (GET /portfolios/:id) once per portfolio via `useQueries` — no new backend —
 * to obtain market value and per-type allocation that the list endpoint omits.
 *
 * For a handful of portfolios this is cheap; results are cached under the same
 * keys as `usePortfolio`, so navigating into a portfolio hits the cache.
 */
export interface PortfoliosOverview {
  portfolioCount: number;
  totalInvested: number;
  totalValue: number;
  totalProfit: number;
  /** Profit as a percentage of invested cost. */
  profitPercentage: number;
  /** Every asset across all portfolios, for consolidated allocation charts. */
  allAssets: AssetSnapshot[];
}

export function usePortfoliosOverview() {
  const list = usePortfolios();
  const ids = list.data?.map((p) => p.id) ?? [];

  const detailQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: portfolioKeys.detail(id),
      queryFn: async () => {
        const { data } = await api.get<PortfolioDetail>(`/portfolios/${id}`);
        return data;
      },
      enabled: Boolean(id),
    })),
  });

  const detailsLoading = detailQueries.some((q) => q.isLoading);
  const detailsError = detailQueries.some((q) => q.isError);
  const details = detailQueries
    .map((q) => q.data)
    .filter((d): d is PortfolioDetail => Boolean(d));

  const data = useMemo<PortfoliosOverview | undefined>(() => {
    if (!list.data) return undefined;
    const totalInvested = details.reduce((s, p) => s + p.totalCost, 0);
    const totalValue = details.reduce((s, p) => s + p.totalValue, 0);
    const totalProfit = details.reduce((s, p) => s + p.totalProfit, 0);
    const allAssets = details.flatMap((p) => p.assets);
    return {
      portfolioCount: list.data.length,
      totalInvested,
      totalValue,
      totalProfit,
      profitPercentage: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
      allAssets,
    };
    // `details` is derived from detailQueries each render; depend on its values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.data, JSON.stringify(details.map((d) => d.id + d.totalValue))]);

  return {
    data,
    isLoading: list.isLoading || (ids.length > 0 && detailsLoading),
    isError: list.isError || detailsError,
    refetch: () => {
      list.refetch();
      detailQueries.forEach((q) => q.refetch());
    },
  };
}

/** POST /portfolios */
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePortfolioInput) => {
      const { data } = await api.post<PortfolioListItem>('/portfolios', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
    },
  });
}

/** POST /portfolios/:id/assets */
export function useAddAsset(portfolioId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddAssetInput) => {
      const { data } = await api.post(
        `/portfolios/${portfolioId}/assets`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(portfolioId),
      });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
    },
  });
}

/** PATCH /portfolios/:id — renomeia a carteira. */
export function useRenamePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await api.patch<
        Pick<PortfolioListItem, 'id' | 'name' | 'userId' | 'createdAt'>
      >(`/portfolios/${id}`, { name });
      return data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(id) });
    },
  });
}

/** DELETE /portfolios/:id — exclui a carteira. Redirecionamento fica no componente. */
export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/portfolios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
    },
  });
}
