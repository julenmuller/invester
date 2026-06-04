import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/lib/format';

interface ProfitValueProps {
  /** Absolute profit/loss in BRL. Drives the color: green when ≥ 0, red below. */
  value: number;
  /** Optional percentage shown next to the amount. */
  percentage?: number;
  className?: string;
}

/**
 * Renders a monetary result colored by sign — profit is always green, loss
 * always red. The single place that maps "is this a gain?" to a token color.
 */
export function ProfitValue({ value, percentage, className }: ProfitValueProps) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        'font-mono font-medium tabular-nums',
        isPositive ? 'text-profit' : 'text-loss',
        className,
      )}
    >
      {formatCurrency(value)}
      {percentage !== undefined && (
        <span className="ml-1 text-xs">({formatPercent(percentage)})</span>
      )}
    </span>
  );
}
