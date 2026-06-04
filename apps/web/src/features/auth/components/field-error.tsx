/** Inline validation message for a form field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-loss">
      {message}
    </p>
  );
}
