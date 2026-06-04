'use client';

import {
  motion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import { TableBody, TableRow } from '@/components/ui/table';

/**
 * Sober micro-interactions for InvestHub. Short (150–300ms), natural easing,
 * no bounce — restraint signals trust in a financial product.
 *
 * `prefers-reduced-motion` is honored globally: the root <MotionConfig
 * reducedMotion="user"> (in providers/query-provider) makes Framer skip
 * transform animations and keep only opacity when the user asks for less motion.
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Container that reveals its children in a short cascade. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};

/** Item entrance: fade + a small upward slide. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } },
};

/** A `motion.div` pre-wired as a stagger container (initial → animate). */
export function Stagger({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A child of <Stagger>; fades and rises into place. */
export function StaggerItem({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}

/** A `<tbody>` (shadcn TableBody) pre-wired as a stagger container. */
export const MotionTableBody = motion.create(TableBody);

/** A `<tr>` (shadcn TableRow) that participates in a stagger cascade. */
export const MotionTableRow = motion.create(TableRow);
