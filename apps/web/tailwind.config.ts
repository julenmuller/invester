import type { Config } from 'tailwindcss';
import { colors, radii, shadows, spacing, typography } from './src/styles/tokens';

/**
 * Tailwind is configured from the design tokens so components never reference a
 * raw color. The shadcn/ui primitives use CSS variables (defined in
 * globals.css) for their neutral palette; our domain colors (primary, profit,
 * loss, surface, text) come straight from `tokens.ts`.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: [...typography.fontFamily.sans],
        mono: [...typography.fontFamily.mono],
      },
      fontSize: typography.fontSize,
      spacing,
      colors: {
        // shadcn/ui neutral palette (CSS variables, see globals.css)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Domain tokens
        primary: {
          DEFAULT: colors.primary.DEFAULT,
          foreground: colors.primary.foreground,
          hover: colors.primary.hover,
          soft: colors.primary.soft,
        },
        profit: {
          DEFAULT: colors.profit.DEFAULT,
          foreground: colors.profit.foreground,
          soft: colors.profit.soft,
        },
        loss: {
          DEFAULT: colors.loss.DEFAULT,
          foreground: colors.loss.foreground,
          soft: colors.loss.soft,
        },
        surface: {
          DEFAULT: colors.surface.DEFAULT,
          muted: colors.surface.muted,
          border: colors.surface.border,
          background: colors.surface.background,
        },
        text: {
          DEFAULT: colors.text.DEFAULT,
          muted: colors.text.muted,
          inverted: colors.text.inverted,
        },
      },
      borderRadius: {
        lg: radii.lg,
        md: radii.md,
        sm: radii.sm,
      },
      boxShadow: {
        soft: shadows.soft,
        glow: shadows.glow,
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
