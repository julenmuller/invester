'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import type {
  LoginResponse,
  RegisterResponse,
} from '@/lib/types';
import type { LoginFormValues, RegisterFormValues } from './schemas';

/** POST /auth/register */
export function useRegister() {
  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data } = await api.post<RegisterResponse>('/auth/register', values);
      return data;
    },
  });
}

/** POST /auth/login — persists the token + user on success. */
export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await api.post<LoginResponse>('/auth/login', values);
      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
  });
}
