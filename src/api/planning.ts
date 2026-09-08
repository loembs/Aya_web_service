import type { PlanningSlotResponseDTO } from "./dto";
import { apiRequest } from "./http";

export function listPlanningSlots(
  institutId: string,
  dateFrom: string,
  dateTo: string,
): Promise<PlanningSlotResponseDTO[]> {
  const params = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
  return apiRequest<PlanningSlotResponseDTO[]>(
    `/web/instituts/${institutId}/planning/slots?${params.toString()}`,
  );
}
