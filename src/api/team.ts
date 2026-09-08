import type { PraticienListResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function listPraticiens(institutId: string): Promise<PraticienListResponseDTO[]> {
  return apiRequest<PraticienListResponseDTO[]>(`/web/instituts/${institutId}/praticiens`);
}

export function createPraticien(
  institutId: string,
  body: { display_name: string; service_ids?: string[] },
): Promise<PraticienListResponseDTO> {
  return apiRequest<PraticienListResponseDTO>(`/web/instituts/${institutId}/praticiens`, {
    method: "POST",
    body,
  });
}
