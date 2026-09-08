import type { MeResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function fetchMe(): Promise<MeResponseDTO> {
  return apiRequest<MeResponseDTO>("/web/me", { tenant: false });
}
