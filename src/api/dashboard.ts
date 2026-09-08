import type {
  DashboardChartDataDTO,
  DashboardStatsResponseDTO,
  RecentActivityResponseDTO,
} from "./dto";
import { apiRequest } from "./http";

export function fetchDashboardStats(institutId: string): Promise<DashboardStatsResponseDTO> {
  return apiRequest<DashboardStatsResponseDTO>(`/web/instituts/${institutId}/dashboard/stats`);
}

export function fetchDashboardChart(institutId: string): Promise<DashboardChartDataDTO> {
  return apiRequest<DashboardChartDataDTO>(`/web/instituts/${institutId}/dashboard/chart`);
}

export function fetchDashboardActivity(institutId: string): Promise<RecentActivityResponseDTO> {
  return apiRequest<RecentActivityResponseDTO>(`/web/instituts/${institutId}/dashboard/activity`);
}
