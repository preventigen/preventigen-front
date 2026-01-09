"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed";

  const style =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-95 active:brightness-90"
      : "border border-border-strong bg-surface text-heading hover:bg-surface-muted";

  return <button className={`${base} ${style} ${className}`} {...props} />;
}
