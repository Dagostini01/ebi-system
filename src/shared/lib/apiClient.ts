import { getApiBaseUrl } from '@/shared/lib/env';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type JsonMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function apiRequest<T>(
  path: string,
  options: { method?: JsonMethod; body?: unknown; headers?: Record<string, string> } = {}
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError('VITE_API_BASE_URL não configurada', 0);
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await res.text();
  const parsed = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    throw new ApiError(
      typeof parsed === 'object' && parsed && 'message' in parsed
        ? String((parsed as { message: unknown }).message)
        : res.statusText,
      res.status,
      parsed
    );
  }

  return parsed as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
