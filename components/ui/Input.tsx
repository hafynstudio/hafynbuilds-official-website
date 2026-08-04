import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  hint?: string;
}

// forwardRef is required here even though no component consumes it yet —
// this Input is the exact component the Contact form (Phase 16) will
// register with React Hook Form, which requires ref access to the
// underlying <input> element. Building it correctly now avoids having to
// retrofit ref support into every call site later.
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            aria-invalid={!!error}
            aria-describedby={cn(hintId, errorId) || undefined}
            className={cn(
              "peer w-full rounded-md border bg-surface px-4 pt-5 pb-2 text-base text-text-primary",
              "transition-colors duration-base ease-out-quart",
              "placeholder-transparent focus:outline-none",
              error
                ? "border-error focus:border-error"
                : "border-border focus:border-accent",
              // Focus glow — a soft accent ring rather than a hard outline,
              // consistent with the "focus-glow borders" spec on Contact.
              "focus:shadow-[0_0_0_3px_rgb(var(--color-accent-primary)/0.15)]",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 top-3.5 origin-left text-text-secondary transition-all duration-fast ease-out-quart",
              // Floating-label mechanics: rests as placeholder text at
              // input height, floats up + shrinks on focus OR when filled
              // (the peer-[:not(:placeholder-shown)] check is what makes
              // it stay floated after the user types, not just on focus).
              "peer-focus:top-1.5 peer-focus:scale-75 peer-focus:text-accent",
              "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:scale-75"
            )}
          >
            {label}
          </label>
        </div>
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-text-tertiary">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
