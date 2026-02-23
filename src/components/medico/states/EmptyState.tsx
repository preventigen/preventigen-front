import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted p-8 text-center">
      <Inbox className="mx-auto h-7 w-7 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold text-heading">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-5">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
