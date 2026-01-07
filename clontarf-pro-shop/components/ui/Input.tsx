import * as React from "react";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl px-4 py-3 text-base outline-none transition",
        "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
        "placeholder:text-[var(--text-secondary)]",
        "focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-green)_35%,transparent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
