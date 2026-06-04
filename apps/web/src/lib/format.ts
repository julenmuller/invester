/** Shared formatting helpers (pt-BR / BRL). */

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const decimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

const percentFmt = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
});

/** Format a number as Brazilian currency, e.g. 1234.5 → "R$ 1.234,50". */
export function formatCurrency(value: number): string {
  return brl.format(value);
}

/** Format a plain quantity, e.g. 10.5 → "10,5". */
export function formatQuantity(value: number): string {
  return decimal.format(value);
}

/** Format a percentage with explicit sign, e.g. 12.5 → "+12,50%". */
export function formatPercent(value: number): string {
  return `${percentFmt.format(value)}%`;
}
