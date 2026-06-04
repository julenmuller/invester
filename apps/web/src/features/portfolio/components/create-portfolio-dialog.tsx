'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/features/auth/components/field-error';
import { getApiErrorMessage } from '@/lib/api';
import { useCreatePortfolio } from '../hooks';
import {
  createPortfolioSchema,
  type CreatePortfolioFormValues,
} from '../schemas';

export function CreatePortfolioDialog() {
  const [open, setOpen] = useState(false);
  const createPortfolio = useCreatePortfolio();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePortfolioFormValues>({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = handleSubmit((values) => {
    createPortfolio.mutate(values, {
      onSuccess: () => {
        toast.success('Carteira criada!');
        reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Não foi possível criar a carteira.'));
      },
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Nova carteira
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova carteira</DialogTitle>
          <DialogDescription>
            Dê um nome para organizar seus investimentos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="portfolio-name">Nome</Label>
            <Input
              id="portfolio-name"
              placeholder="Ex.: Carteira de Ações"
              autoFocus
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createPortfolio.isPending}>
              {createPortfolio.isPending && <Loader2 className="animate-spin" />}
              Criar carteira
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
