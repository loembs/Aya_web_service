import type { LoginResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function startGoogleOAuth(): Promise<{ url: string }> {
  const origin = encodeURIComponent(window.location.origin);
  return apiRequest<{ url: string }>(`/web/auth/oauth/google?redirect_origin=${origin}`, {
    auth: false,
    tenant: false,
  });
}

export function completeOAuth(accessToken: string, refreshToken: string): Promise<LoginResponseDTO> {
  return apiRequest<LoginResponseDTO>("/web/auth/oauth/complete", {
    method: "POST",
    body: { access_token: accessToken, refresh_token: refreshToken },
    auth: false,
    tenant: false,
  });
}

export function readOAuthCallback(): { accessToken: string; refreshToken: string } | { error: string } | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  const error = hash.get("error_description") || query.get("error_description") || hash.get("error") || query.get("error");
  if (error) {
    return { error };
  }
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (!accessToken || !refreshToken) {
    return null;
  }
  return { accessToken, refreshToken };
}

export function clearOAuthCallback() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("auth");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  url.searchParams.delete("error_code");
  window.history.replaceState({}, "", url.pathname + url.search);
}
