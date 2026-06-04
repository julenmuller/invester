'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldError } from '@/features/auth/components/field-error';
import { getApiErrorMessage } from '@/lib/api';
import { ASSET_TYPE_LABELS, ASSET_TYPES, type AddAssetInput } from '@/lib/types';
import { useAddAsset } from '../hooks';
import { addAssetSchema, type AddAssetFormValues } from '../schemas';

export function AddAssetDialog({ portfolioId }: { portfolioId: string }) {
  const [open, setOpen] = useState(false);
  const addAsset = useAddAsset(portfolioId);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: { ticker: '', type: undefined, quantity: undefined, avgPrice: undefined },
  });

  const onSubmit = handleSubmit((values) => {
    addAsset.mutate(values as AddAssetInput, {
      onSuccess: () => {
        toast.success('Ativo adicionado!');
        reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Não foi possível adicionar o ativo.'));
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
          Adicionar ativo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar ativo</DialogTitle>
          <DialogDescription>
            Informe os dados da posição que você possui.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              placeholder="Ex.: PETR4"
              autoFocus
              className="uppercase"
              aria-invalid={!!errors.ticker}
              {...register('ticker')}
            />
            <FieldError message={errors.ticker?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset-type">Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="asset-type" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {ASSET_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.type?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                min="0"
                placeholder="0"
                aria-invalid={!!errors.quantity}
                {...register('quantity')}
              />
              <FieldError message={errors.quantity?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Preço médio (R$)</Label>
              <Input
                id="avgPrice"
                type="number"
                step="any"
                min="0"
                placeholder="0,00"
                aria-invalid={!!errors.avgPrice}
                {...register('avgPrice')}
              />
              <FieldError message={errors.avgPrice?.message} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={addAsset.isPending}>
              {addAsset.isPending && <Loader2 className="animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
