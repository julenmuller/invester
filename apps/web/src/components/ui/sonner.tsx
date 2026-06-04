'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/** App-wide toast host. Colors come from the design tokens via Tailwind. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-surface group-[.toaster]:text-text group-[.toaster]:border-surface-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-text-muted',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-surface-muted group-[.toast]:text-text-muted',
          success: 'group-[.toaster]:text-profit',
          error: 'group-[.toaster]:text-loss',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
