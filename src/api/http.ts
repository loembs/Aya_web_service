import { apiBaseUrl, TENANT_HEADER } from "./config";
import { ApiError, publicApiMessage } from "./errors";
import { clearSession, getAccessToken, getTenantId } from "./session";

type Json = Record<string, unknown> | unknown[] | null;

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  tenant?: boolean;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as Json;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const auth = options.auth !== false;
  if (auth) {
    const token = getAccessToken();
    if (!token) {
      throw new ApiError(401, "Session expirée. Reconnectez-vous.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.tenant !== false && auth) {
    const tenantId = getTenantId();
    if (tenantId) {
      headers.set(TENANT_HEADER, tenantId);
    }
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "omit",
    cache: "no-store",
    mode: "cors",
  });

  const payload = await parseJsonSafe(response);

  if (response.status === 401 && auth) {
    clearSession();
  }

  if (!response.ok) {
    throw new ApiError(response.status, publicApiMessage(response.status, payload));
  }

  return payload as T;
}
