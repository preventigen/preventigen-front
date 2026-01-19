import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ title, subtitle, align = "left", className = "" }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`${alignCls} ${className} max-w-2xl`}>
      <h2 className="text-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
