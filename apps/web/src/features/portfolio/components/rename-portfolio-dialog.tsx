'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Pencil } from 'lucide-react';
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
import { useRenamePortfolio } from '../hooks';
import {
  renamePortfolioSchema,
  type RenamePortfolioFormValues,
} from '../schemas';

export function RenamePortfolioDialog({
  id,
  currentName,
}: {
  id: string;
  currentName: string;
}) {
  const [open, setOpen] = useState(false);
  const renamePortfolio = useRenamePortfolio();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RenamePortfolioFormValues>({
    resolver: zodResolver(renamePortfolioSchema),
    mode: 'onChange',
    defaultValues: { name: currentName },
  });

  const onSubmit = handleSubmit(({ name }) => {
    renamePortfolio.mutate(
      { id, name },
      {
        onSuccess: () => {
          toast.success('Carteira renomeada!');
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Não foi possível renomear a carteira.'),
          );
        },
      },
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Re-seed with the current name whenever the dialog (re)opens.
        if (next) reset({ name: currentName });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Renomear carteira">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear carteira</DialogTitle>
          <DialogDescription>
            Escolha um novo nome para esta carteira.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="rename-portfolio">Nome</Label>
            <Input
              id="rename-portfolio"
              autoFocus
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!isValid || renamePortfolio.isPending}
            >
              {renamePortfolio.isPending && <Loader2 className="animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
