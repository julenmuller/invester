/**
 * Derived (synthetic) net-worth history.
 *
 * TODO(api): replace with a real time series from the backend, e.g.
 *   GET /portfolios/history?range=6m → [{ date, value }]
 * The REST API currently exposes only the *current* consolidated value, so this
 * derives a plausible curve from invested cost → current market value purely on
 * the client. It is deterministic (no Math.random) so it never jitters between
 * renders, and is clearly labelled as an estimate in the UI. Do NOT treat these
 * points as real historical data.
 */

export interface HistoryPoint {
  /** Month label, e.g. "jan". */
  label: string;
  value: number;
}

const MONTH_LABELS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

/**
 * Build a `months`-point series easing from `start` (invested cost) to `end`
 * (current market value), with a small deterministic wave so it doesn't read as
 * a straight line. Labels are the trailing calendar months ending this month.
 */
export function deriveNetWorthHistory(
  start: number,
  end: number,
  months = 6,
): HistoryPoint[] {
  const now = new Date();
  const points: HistoryPoint[] = [];

  for (let i = 0; i < months; i++) {
    const t = months === 1 ? 1 : i / (months - 1);
    // Smoothstep easing for an organic ramp.
    const eased = t * t * (3 - 2 * t);
    const base = start + (end - start) * eased;
    // Deterministic ±1.5% ripple, fading toward the (known) latest value.
    const ripple = Math.sin(i * 1.3) * 0.015 * base * (1 - t);
    const monthIndex = (now.getMonth() - (months - 1 - i) + 12) % 12;
    points.push({
      label: MONTH_LABELS[monthIndex],
      value: Math.max(0, Math.round(base + ripple)),
    });
  }

  return points;
}
