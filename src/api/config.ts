/** Origine publique de l'API. Jamais de secret ici (pas de JWT_SECRET, pas d'anon key). */
const DEFAULT_API_ORIGIN = "https://aya-backend-service.onrender.com";

export function apiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
  // En local, même origine + proxy Vite : le navigateur ne traverse plus CORS.
  if (!raw) {
    if (import.meta.env.DEV) {
      return "";
    }
    return DEFAULT_API_ORIGIN;
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("URL d'API invalide");
  }
  if (import.meta.env.PROD && parsed.protocol !== "https:") {
    throw new Error("L'API de production doit utiliser HTTPS");
  }
  if (parsed.username || parsed.password) {
    throw new Error("L'URL d'API ne doit pas contenir d'identifiants");
  }
  return parsed.origin;
}

export const TENANT_HEADER = "X-Tenant-ID";
