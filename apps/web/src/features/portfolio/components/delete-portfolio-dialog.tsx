'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDeletePortfolio } from '../hooks';

export function DeletePortfolioDialog({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deletePortfolio = useDeletePortfolio();

  const onConfirm = () => {
    deletePortfolio.mutate(id, {
      onSuccess: () => {
        toast.success('Carteira excluída.');
        setOpen(false);
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(
          getApiErrorMessage(error, 'Não foi possível excluir a carteira.'),
        );
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      // Don't let the dialog close mid-flight.
      onOpenChange={(next) => {
        if (!deletePortfolio.isPending) setOpen(next);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Excluir carteira"
          className="text-text-muted hover:text-loss"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A carteira e todos os seus ativos
            serão removidos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePortfolio.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // keep open; we close on success
              onConfirm();
            }}
            disabled={deletePortfolio.isPending}
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'hover:shadow-none',
            )}
          >
            {deletePortfolio.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
