export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

export function toOptionalString(value: unknown): string | null {
  return toStringValue(value) ?? null;
}

export function toNumberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return undefined;
}

export function toArray<T>(value: unknown, mapper: (item: unknown) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(mapper);
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => toStringValue(entry))
      .filter((entry): entry is string => Boolean(entry));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

export function pickArrayCandidate(record: Record<string, unknown>, keys: string[]): unknown[] {
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}
