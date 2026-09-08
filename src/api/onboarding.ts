import type {
  ActivatePasswordResponseDTO,
  AgencyActionResponseDTO,
  AgencyTenantListDTO,
  ApplicationListDTO,
  PublicApplicationRequestDTO,
} from "./dto";
import { apiRequest } from "./http";

export function submitTenantApplication(
  body: PublicApplicationRequestDTO,
): Promise<{ status: string; message: string }> {
  return apiRequest("/web/public/tenant-applications", {
    method: "POST",
    body,
    auth: false,
    tenant: false,
  });
}

export function activatePassword(token: string, password: string): Promise<ActivatePasswordResponseDTO> {
  return apiRequest<ActivatePasswordResponseDTO>("/web/auth/activate", {
    method: "POST",
    body: { token, password },
    auth: false,
    tenant: false,
  });
}

export function listApplications(status?: string): Promise<ApplicationListDTO[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<ApplicationListDTO[]>(`/agency/applications${query}`, { tenant: false });
}

export function confirmApplication(id: string): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>(`/agency/applications/${id}/confirm`, {
    method: "POST",
    body: {},
    tenant: false,
  });
}

export function rejectApplication(id: string, note?: string): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>(`/agency/applications/${id}/reject`, {
    method: "POST",
    body: { note },
    tenant: false,
  });
}

export function listAgencyTenants(): Promise<AgencyTenantListDTO[]> {
  return apiRequest<AgencyTenantListDTO[]>("/agency/tenants", { tenant: false });
}

export function createAgencyTenant(body: {
  institut_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  address?: string;
}): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>("/agency/tenants", {
    method: "POST",
    body,
    tenant: false,
  });
}

export function suspendTenant(id: string): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>(`/agency/tenants/${id}/suspend`, {
    method: "POST",
    body: {},
    tenant: false,
  });
}

export function activateTenant(id: string): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>(`/agency/tenants/${id}/activate`, {
    method: "POST",
    body: {},
    tenant: false,
  });
}

export function resendActivation(id: string): Promise<AgencyActionResponseDTO> {
  return apiRequest<AgencyActionResponseDTO>(`/agency/tenants/${id}/resend-activation`, {
    method: "POST",
    body: {},
    tenant: false,
  });
}
