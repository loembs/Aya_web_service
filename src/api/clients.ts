import type {
  ClientBookingHistoryItemDTO,
  ClientDetailResponseDTO,
  ClientListResponseDTO,
} from "./dto";
import { apiRequest } from "./http";

export function listClients(institutId: string): Promise<ClientListResponseDTO[]> {
  return apiRequest<ClientListResponseDTO[]>(`/web/instituts/${institutId}/clients`);
}

export function createClient(
  institutId: string,
  body: { full_name: string; phone?: string; email?: string; notes?: string },
): Promise<ClientDetailResponseDTO> {
  return apiRequest<ClientDetailResponseDTO>(`/web/instituts/${institutId}/clients`, {
    method: "POST",
    body,
  });
}

export function listClientBookings(
  institutId: string,
  clientId: string,
): Promise<ClientBookingHistoryItemDTO[]> {
  return apiRequest<ClientBookingHistoryItemDTO[]>(
    `/web/instituts/${institutId}/clients/${clientId}/bookings`,
  );
}
