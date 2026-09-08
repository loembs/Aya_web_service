import type { InstitutAdminResponseDTO, OpeningHoursDTO } from "./dto";
import { apiRequest } from "./http";

export function fetchInstitut(institutId: string): Promise<InstitutAdminResponseDTO> {
  return apiRequest<InstitutAdminResponseDTO>(`/web/instituts/${institutId}`);
}

export function updateInstitut(
  institutId: string,
  body: {
    name?: string;
    address?: string;
    description?: string;
    phone?: string;
    public_email?: string;
    opening_hours?: OpeningHoursDTO;
    photos?: string[];
  },
): Promise<InstitutAdminResponseDTO> {
  return apiRequest<InstitutAdminResponseDTO>(`/web/instituts/${institutId}`, {
    method: "PATCH",
    body,
  });
}
