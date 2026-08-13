"use client";

/**
 * Typed fetch wrapper for the احجزلي REST API.
 * Handles JSON serialization, error normalization, and (in Phase 2)
 * transparent access-token refresh via the /api/v1/auth/refresh endpoint.
 */

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, headers, ...rest } = options;

  const res = await fetch(path, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string } | null)?.message ?? res.statusText,
      res.status,
      (data as { error?: string } | null)?.error
    );
  }

  return data as T;
}
