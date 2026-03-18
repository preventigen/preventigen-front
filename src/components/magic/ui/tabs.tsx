"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within <Tabs>.`);
  }

  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const baseId = React.useId();
  const currentValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue, baseId }}>
      <div className={cn("grid gap-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

function TabsList({ className, onKeyDown, ...props }: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];

    if (!keys.includes(event.key)) {
      onKeyDown?.(event);
      return;
    }

    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []
    );
    const currentIndex = triggers.findIndex((trigger) => trigger === document.activeElement);

    if (currentIndex === -1 || triggers.length === 0) {
      onKeyDown?.(event);
      return;
    }

    event.preventDefault();

    const firstIndex = 0;
    const lastIndex = triggers.length - 1;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = currentIndex === lastIndex ? firstIndex : currentIndex + 1;
    }

    if (event.key === "ArrowLeft") {
      nextIndex = currentIndex === firstIndex ? lastIndex : currentIndex - 1;
    }

    if (event.key === "Home") {
      nextIndex = firstIndex;
    }

    if (event.key === "End") {
      nextIndex = lastIndex;
    }

    triggers[nextIndex]?.focus();
    triggers[nextIndex]?.click();

    onKeyDown?.(event);
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "inline-flex w-full flex-wrap gap-2 rounded-2xl border border-border bg-surface p-2",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: currentValue, setValue, baseId } = useTabsContext("TabsTrigger");
  const isActive = currentValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-trigger-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-content-${value}`}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
        isActive
          ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
          : "border-transparent bg-surface text-heading hover:bg-surface-muted",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: currentValue, baseId } = useTabsContext("TabsContent");

  if (currentValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-content-${value}`}
      aria-labelledby={`${baseId}-trigger-${value}`}
      className={cn("grid gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
