import type { ServiceCategory, ServiceDetailResponseDTO, ServiceListResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function listServices(institutId: string): Promise<ServiceListResponseDTO[]> {
  return apiRequest<ServiceListResponseDTO[]>(`/web/instituts/${institutId}/services`);
}

export function createService(
  institutId: string,
  body: {
    name: string;
    duration_min: number;
    price_cents: number;
    category: ServiceCategory;
    description?: string;
    is_active?: boolean;
  },
): Promise<ServiceDetailResponseDTO> {
  return apiRequest<ServiceDetailResponseDTO>(`/web/instituts/${institutId}/services`, {
    method: "POST",
    body,
  });
}
