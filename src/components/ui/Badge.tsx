type Props = {
  children: React.ReactNode;
  variant?: "default" | "accent" | "navy";
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: Props) {
  const styles =
    variant === "accent"
      ? "border-accent/30 bg-accent/10 text-heading"
      : variant === "navy"
      ? "border-heading/20 bg-heading/5 text-heading"
      : "border-border bg-surface text-foreground";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
