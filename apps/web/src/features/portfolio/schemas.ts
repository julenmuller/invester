import { z } from 'zod';
import { ASSET_TYPES } from '@/lib/types';

/**
 * Client-side validation mirroring the backend schemas
 * (apps/api/src/http/routes/portfolios.ts).
 */

export const createPortfolioSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome precisa de pelo menos 2 caracteres.')
    .max(120, 'O nome pode ter no máximo 120 caracteres.'),
});

export const renamePortfolioSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome precisa de pelo menos 2 caracteres.')
    .max(60, 'O nome pode ter no máximo 60 caracteres.'),
});

export const addAssetSchema = z.object({
  ticker: z
    .string()
    .trim()
    .toUpperCase()
    .min(4, 'O ticker precisa de pelo menos 4 caracteres.')
    .max(6, 'O ticker pode ter no máximo 6 caracteres.'),
  type: z.enum(ASSET_TYPES as [string, ...string[]], {
    required_error: 'Selecione o tipo de ativo.',
  }),
  quantity: z.coerce.number().positive('A quantidade deve ser maior que zero.'),
  avgPrice: z.coerce.number().positive('O preço médio deve ser maior que zero.'),
});

export type CreatePortfolioFormValues = z.infer<typeof createPortfolioSchema>;
export type RenamePortfolioFormValues = z.infer<typeof renamePortfolioSchema>;
export type AddAssetFormValues = z.infer<typeof addAssetSchema>;
