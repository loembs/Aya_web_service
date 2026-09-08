import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchMe } from "../api/me";
import {
  clearSession,
  getAccessToken,
  getInstitutId,
  getInstitutName,
  saveUser,
  saveWorkspace,
  type StoredUser,
} from "../api/session";

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  user: StoredUser | null;
  institutId: string | null;
  institutName: string | null;
  isAgencyAdmin: boolean;
  applySession: (profile?: StoredUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [institutId, setInstitutId] = useState<string | null>(null);
  const [institutName, setInstitutName] = useState<string | null>(null);
  const [isAgencyAdmin, setIsAgencyAdmin] = useState(false);

  const hydrateFromMe = useCallback(async (profile?: StoredUser) => {
    const me = await fetchMe();
    const nextUser = profile ?? me.user;
    saveUser(nextUser);
    setIsAgencyAdmin(Boolean(me.is_agency_admin));
    const workspace = me.workspaces[0];
    if (!workspace && me.is_agency_admin) {
      setUser(nextUser);
      setInstitutId(null);
      setInstitutName(null);
      setAuthenticated(true);
      return;
    }
    if (!workspace) {
      clearSession();
      setUser(null);
      setInstitutId(null);
      setInstitutName(null);
      setAuthenticated(false);
      setIsAgencyAdmin(false);
      throw new Error("Aucun institut n'est associé à ce compte.");
    }
    saveWorkspace({
      tenantId: workspace.tenant_id,
      institutId: workspace.institut_id,
      institutName: workspace.institut_name,
    });
    setUser(nextUser);
    setInstitutId(workspace.institut_id);
    setInstitutName(workspace.institut_name);
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getAccessToken()) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        await hydrateFromMe();
      } catch {
        if (!cancelled) {
          clearSession();
          setAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrateFromMe]);

  const logout = useCallback(() => {
    clearSession();
    setAuthenticated(false);
    setUser(null);
    setInstitutId(null);
    setInstitutName(null);
    setIsAgencyAdmin(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      authenticated,
      user,
      institutId: institutId ?? getInstitutId(),
      institutName: institutName ?? getInstitutName(),
      isAgencyAdmin,
      applySession: hydrateFromMe,
      logout,
    }),
    [ready, authenticated, user, institutId, institutName, isAgencyAdmin, hydrateFromMe, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return ctx;
}
