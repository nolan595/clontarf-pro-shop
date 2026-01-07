"use client";

import * as React from "react";
import clsx from "clsx";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-green)_35%,transparent)] " +
  "focus:ring-offset-2 focus:ring-offset-[var(--background)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-[var(--accent-green)] text-black hover:brightness-110 active:brightness-95",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)]",
  ghost:
    "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)]",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = clsx(base, variants[variant], sizes[size], className);

  // Allows: <Button asChild><Link ... /></Button>
  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: clsx(classes, child.props.className),
    });
  }

  return <button className={classes} {...props} />;
}
