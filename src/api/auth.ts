import type { LoginRequestDTO, LoginResponseDTO, Verify2FARequestDTO, Verify2FAResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function login(payload: LoginRequestDTO): Promise<LoginResponseDTO> {
  return apiRequest<LoginResponseDTO>("/web/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
    tenant: false,
  });
}

export function requestPasswordReset(email: string): Promise<{ status: string; message: string }> {
  return apiRequest("/web/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
    tenant: false,
  });
}

export function verify2fa(payload: Verify2FARequestDTO): Promise<Verify2FAResponseDTO> {
  return apiRequest<Verify2FAResponseDTO>("/web/auth/2fa/verify", {
    method: "POST",
    body: payload,
    auth: false,
    tenant: false,
  });
}
