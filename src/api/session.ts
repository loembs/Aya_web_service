const ACCESS_KEY = "aya.web.atk";
const REFRESH_KEY = "aya.web.rtk";
const TENANT_KEY = "aya.web.tid";
const INSTITUT_KEY = "aya.web.iid";
const INSTITUT_NAME_KEY = "aya.web.iname";
const USER_KEY = "aya.web.usr";

export interface StoredUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
}

export interface WorkspaceSelection {
  tenantId: string;
  institutId: string | null;
  institutName: string | null;
}

function store(): Storage {
  return sessionStorage;
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  store().setItem(ACCESS_KEY, accessToken);
  store().setItem(REFRESH_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return store().getItem(ACCESS_KEY);
}

export function saveWorkspace(selection: WorkspaceSelection): void {
  store().setItem(TENANT_KEY, selection.tenantId);
  if (selection.institutId) store().setItem(INSTITUT_KEY, selection.institutId);
  else store().removeItem(INSTITUT_KEY);
  if (selection.institutName) store().setItem(INSTITUT_NAME_KEY, selection.institutName);
  else store().removeItem(INSTITUT_NAME_KEY);
}

export function getTenantId(): string | null {
  return store().getItem(TENANT_KEY);
}

export function getInstitutId(): string | null {
  return store().getItem(INSTITUT_KEY);
}

export function getInstitutName(): string | null {
  return store().getItem(INSTITUT_NAME_KEY);
}

export function saveUser(user: StoredUser): void {
  store().setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  const raw = store().getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredUser;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return Boolean(getAccessToken() && getTenantId());
}

export function clearSession(): void {
  store().removeItem(ACCESS_KEY);
  store().removeItem(REFRESH_KEY);
  store().removeItem(TENANT_KEY);
  store().removeItem(INSTITUT_KEY);
  store().removeItem(INSTITUT_NAME_KEY);
  store().removeItem(USER_KEY);
}
