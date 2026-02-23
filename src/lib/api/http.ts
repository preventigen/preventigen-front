interface ApiRequestOptions<TBody> {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  token?: string;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_URL;
  if (!baseUrl) {
    throw new Error(
      "No se encontro la URL del backend. Define NEXT_PUBLIC_API_URL o BACKEND_URL."
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

function parseUnknownPayload(rawPayload: string): unknown {
  if (!rawPayload) return null;

  try {
    return JSON.parse(rawPayload);
  } catch {
    return rawPayload;
  }
}

function extractErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload) return fallbackMessage;

  if (typeof payload === "string") return payload;

  if (Array.isArray(payload)) {
    return payload.map((item) => String(item)).join(", ");
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (Array.isArray(record.message)) return record.message.join(", ");
    if (typeof record.error === "string") return record.error;
  }

  return fallbackMessage;
}

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function apiRequest<TResponse, TBody = undefined>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    token,
    body,
    headers,
    signal,
    cache = "no-store",
  } = options;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const endpoint = `${resolveApiBaseUrl()}${normalizedPath}`;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache,
  });

  const rawPayload = await response.text();
  const parsedPayload = parseUnknownPayload(rawPayload);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(parsedPayload, "Error al comunicarse con el backend."),
      parsedPayload
    );
  }

  return unwrapData<TResponse>(parsedPayload);
}
