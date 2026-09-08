export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type MemberRole = "owner" | "admin" | "praticien";

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  status: "2FA requis" | "connecté";
  temp_token?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  user_profile?: UserRead | null;
}

export interface Verify2FARequestDTO {
  temp_token: string;
  code: string;
}

export interface Verify2FAResponseDTO {
  access_token: string;
  refresh_token: string;
  user_profile: UserRead;
}

export interface WorkspaceDTO {
  tenant_id: string;
  role: MemberRole;
  institut_id: string | null;
  institut_name: string | null;
}

export interface MeResponseDTO {
  user: UserRead;
  workspaces: WorkspaceDTO[];
  must_set_password?: boolean;
  is_agency_admin?: boolean;
}

export interface PublicApplicationRequestDTO {
  institut_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  address?: string;
  documents?: string[];
  website?: string;
}

export interface ActivatePasswordResponseDTO {
  access_token: string;
  refresh_token: string;
  must_enable_2fa: boolean;
}

export interface ApplicationListDTO {
  id: string;
  institut_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
  tenant_id: string | null;
}

export interface AgencyTenantListDTO {
  id: string;
  slug: string;
  name: string;
  status: string;
  is_active: boolean;
  plan: string;
  created_at: string;
  institut_id: string | null;
  address: string | null;
}

export interface AgencyActionResponseDTO {
  status: string;
  tenant_id: string | null;
}

export interface AppointmentListResponseDTO {
  id: string;
  client_id?: string | null;
  client_name: string;
  service_name: string;
  service_price_cents?: number;
  praticien_name: string | null;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
}

export interface AppointmentDetailResponseDTO {
  id: string;
  tenant_id: string;
  client_id?: string | null;
  client_user_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_id: string;
  service_name: string;
  service_duration_min: number;
  service_price_cents: number;
  praticien_id: string | null;
  praticien_name: string | null;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  created_at: string;
}

export interface DashboardPeriodStatsDTO {
  bookings_total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface DashboardStatsResponseDTO {
  day: DashboardPeriodStatsDTO;
  week: DashboardPeriodStatsDTO;
}

export interface DashboardChartPointDTO {
  date: string;
  bookings_total: number;
}

export interface DashboardChartDataDTO {
  points: DashboardChartPointDTO[];
}

export interface RecentActivityItemDTO {
  booking_id: string;
  status: BookingStatus;
  client_name: string;
  service_name: string;
  starts_at: string;
}

export interface RecentActivityResponseDTO {
  items: RecentActivityItemDTO[];
}

export interface PlanningSlotResponseDTO {
  starts_at: string;
  ends_at: string;
  praticien_id: string | null;
  booking_id: string | null;
  status: BookingStatus | null;
}

export type ServiceCategory = "maquillage" | "coiffure" | "onglerie" | "soins" | "autres";

export interface ClientListResponseDTO {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  visits: number;
  last_visit_at: string | null;
  total_cents: number;
}

export interface ClientDetailResponseDTO extends ClientListResponseDTO {
  tenant_id: string;
  notes: string | null;
  user_id: string | null;
  created_at: string;
}

export interface ClientBookingHistoryItemDTO {
  id: string;
  service_name: string;
  praticien_name: string | null;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  price_cents: number;
}

export interface ServiceListResponseDTO {
  id: string;
  name: string;
  duration_min: number;
  price_cents: number;
  category: ServiceCategory | string;
  is_active: boolean;
}

export interface ServiceDetailResponseDTO extends ServiceListResponseDTO {
  tenant_id: string;
  description: string | null;
  created_at: string;
}

export interface PraticienListResponseDTO {
  id: string;
  display_name: string;
  service_ids: string[];
  service_names: string[];
}

export interface DayHoursDTO {
  open?: string | null;
  close?: string | null;
}

export interface OpeningHoursDTO {
  monday?: DayHoursDTO | null;
  tuesday?: DayHoursDTO | null;
  wednesday?: DayHoursDTO | null;
  thursday?: DayHoursDTO | null;
  friday?: DayHoursDTO | null;
  saturday?: DayHoursDTO | null;
  sunday?: DayHoursDTO | null;
}

export interface InstitutAdminResponseDTO {
  id: string;
  tenant_id: string;
  name: string;
  address: string | null;
  timezone: string;
  description: string | null;
  phone: string | null;
  public_email: string | null;
  opening_hours: OpeningHoursDTO;
  photos: string[];
}

export interface ApiErrorBody {
  detail?: string | Array<{ msg?: string }>;
}
