"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/src/components/magic/ui/button";
import { cn } from "@/lib/utils";

interface LongTextBlockProps {
  value?: string | null;
  emptyText?: string;
  previewLines?: number;
  collapseAfter?: number;
  className?: string;
  contentClassName?: string;
}

export function LongTextBlock({
  value,
  emptyText = "-",
  previewLines = 6,
  collapseAfter = 360,
  className,
  contentClassName,
}: LongTextBlockProps) {
  const contentId = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  const normalized = useMemo(() => value?.trim() ?? "", [value]);
  const isEmpty = normalized.length === 0;
  const lineCount = normalized.split(/\r?\n/).length;
  const shouldCollapse = normalized.length > collapseAfter || lineCount > previewLines + 1;
  const isCollapsed = shouldCollapse && !isExpanded;

  if (isEmpty) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{emptyText}</p>;
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "relative",
          isCollapsed &&
            "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-10 after:bg-gradient-to-t after:from-white after:to-transparent",
        )}
      >
        <p
          id={contentId}
          className={cn(
            "max-w-[72ch] whitespace-pre-wrap break-words text-sm leading-6 text-heading",
            contentClassName,
          )}
          style={
            isCollapsed
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: previewLines,
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {normalized}
        </p>
      </div>

      {shouldCollapse ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border/70 pt-3">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto px-0 text-primary"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Mostrar menos" : "Mostrar mas"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {isExpanded ? "Vista completa" : `Vista previa de ${previewLines} lineas`}
          </span>
        </div>
      ) : null}
    </div>
  );
}
