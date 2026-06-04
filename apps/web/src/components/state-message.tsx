import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StateMessageProps {
  title: string;
  description?: string;
  /** When provided, renders a retry button. */
  onRetry?: () => void;
  variant?: 'error' | 'empty';
}

/** Friendly empty/error state used by data-fetching screens. */
export function StateMessage({
  title,
  description,
  onRetry,
  variant = 'empty',
}: StateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface p-10 text-center">
      {variant === 'error' && <AlertCircle className="h-8 w-8 text-loss" />}
      <div>
        <p className="font-medium text-text">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
