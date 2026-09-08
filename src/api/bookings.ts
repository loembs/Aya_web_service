import type { AppointmentDetailResponseDTO, AppointmentListResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function listBookings(institutId: string): Promise<AppointmentListResponseDTO[]> {
  return apiRequest<AppointmentListResponseDTO[]>(`/web/instituts/${institutId}/bookings`);
}

export function createBooking(
  institutId: string,
  body: {
    client_id: string;
    service_id: string;
    praticien_id?: string | null;
    starts_at: string;
  },
): Promise<AppointmentDetailResponseDTO> {
  return apiRequest<AppointmentDetailResponseDTO>(`/web/instituts/${institutId}/bookings`, {
    method: "POST",
    body,
  });
}
