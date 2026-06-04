import { z } from 'zod';

/**
 * Client-side validation mirroring the backend zod schemas
 * (apps/api/src/http/routes/auth.ts).
 */

export const registerSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  name: z
    .string()
    .min(2, 'O nome precisa de pelo menos 2 caracteres.')
    .max(120, 'O nome pode ter no máximo 120 caracteres.'),
  password: z
    .string()
    .min(8, 'A senha precisa de pelo menos 8 caracteres.')
    .max(128, 'A senha pode ter no máximo 128 caracteres.'),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
