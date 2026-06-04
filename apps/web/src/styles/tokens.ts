/**
 * Design tokens — single source of truth for the InvestHub design system.
 *
 * Theme: dark "fintech" — deep graphite layered surfaces, a single cyan neon
 * accent used sparingly, and green/red kept strictly for financial semantics.
 *
 * These values are consumed in two places:
 *  - `tailwind.config.ts`, which maps them into the Tailwind theme so every
 *    component references a token instead of a hardcoded color.
 *  - JavaScript-land consumers that cannot use Tailwind classes (e.g. Recharts),
 *    which import the raw hex values directly.
 *
 * Rules:
 *  - profit is ALWAYS green, loss is ALWAYS red. Never hardcode a color in a
 *    component — add it here and reference the token.
 *  - the cyan accent is the ONLY neon. Use it with restraint (CTAs, the focused
 *    value, active borders/hover glow). The accent is intentionally NOT green so
 *    it never reads as "profit".
 */

export const colors = {
  /**
   * Brand / signature accent — electric cyan. Primary actions, the focused
   * value, active borders. `soft` is a low-opacity wash for icon chips.
   */
  primary: {
    DEFAULT: '#22d3ee',
    foreground: '#04141a',
    hover: '#67e8f9',
    soft: 'rgba(34, 211, 238, 0.12)',
  },
  /** Positive results: gains, appreciation. Legible on graphite. */
  profit: {
    DEFAULT: '#34d399',
    foreground: '#04140d',
    soft: 'rgba(52, 211, 153, 0.12)',
  },
  /** Negative results: losses, depreciation. Coral red for dark backgrounds. */
  loss: {
    DEFAULT: '#fb7185',
    foreground: '#1a0608',
    soft: 'rgba(251, 113, 133, 0.12)',
  },
  /**
   * Surfaces — layered for depth: `background` is the page (deepest graphite),
   * `DEFAULT` is a card (one step lighter), `muted` a slightly raised surface.
   * `border` is white at low opacity so separations read as soft, not hard lines.
   */
  surface: {
    DEFAULT: '#14161d',
    muted: '#1c1f29',
    border: 'rgba(255, 255, 255, 0.10)',
    background: '#0a0b0f',
  },
  /** Text — soft white for titles, light gray for secondary (never pure #fff). */
  text: {
    DEFAULT: '#e9eaef',
    muted: '#9aa0ac',
    inverted: '#0a0b0f',
  },
} as const;

/** Color used per asset type in charts and badges — distinct hues on dark. */
export const assetTypeColors = {
  STOCK: '#22d3ee',
  FII: '#a78bfa',
  FIXED_INCOME: '#fbbf24',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const radii = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    /** UI font. */
    sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    /** Numbers and monetary values ONLY — for alignment and a technical feel. */
    mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
} as const;

/** Diffuse, soft shadows + a discreet accent glow for interactive elements. */
export const shadows = {
  soft: '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px -12px rgba(0, 0, 0, 0.6)',
  glow: '0 0 0 1px rgba(34, 211, 238, 0.35), 0 0 24px -4px rgba(34, 211, 238, 0.30)',
} as const;

export const tokens = {
  colors,
  assetTypeColors,
  spacing,
  radii,
  typography,
  shadows,
} as const;

export type AssetTypeColorKey = keyof typeof assetTypeColors;
