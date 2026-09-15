import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activateTenant,
  confirmApplication,
  createAgencyTenant,
  listAgencyTenants,
  listApplications,
  rejectApplication,
  resendActivation,
  suspendTenant,
} from "../api/onboarding";
import type { AgencyTenantListDTO, ApplicationListDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { formatDayLabel, initials } from "../api/format";
import { C, SHADOW } from "../theme";
import {
  Avatar,
  AyaLogo,
  Card,
  Empty,
  Field,
  Input,
  KpiCard,
  Modal,
  PrimaryBtn,
  StatusBadge,
} from "../components";
import {
  IconChart,
  IconClock,
  IconGrid,
  IconLogout,
  IconMail,
  IconPlus,
  IconSearch,
  IconSpark,
  IconUsers,
} from "../icons";
import { useAuth } from "../auth/AuthContext";

type AgencyPage = "dashboard" | "demandes" | "instituts";

const PROJECT_TONES = [
  { bg: `${C.pink}18`, color: C.pink, Icon: IconSpark },
  { bg: `${C.purple}12`, color: C.purple, Icon: IconUsers },
  { bg: C.cream, color: C.orange, Icon: IconClock },
  { bg: C.greenBg, color: C.green, Icon: IconChart },
];

function matchesQuery(query: string, ...parts: Array<string | null | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts.some((part) => (part ?? "").toLowerCase().includes(q));
}

function weekSeries(tenants: AgencyTenantListDTO[]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  return days.map((d) => ({
    day: d.toLocaleDateString("fr-FR", { weekday: "short" }),
    v: tenants.filter((t) => {
      const created = new Date(t.created_at);
      return created.toDateString() === d.toDateString();
    }).length,
  }));
}

export default function Agency() {
  const { logout, user } = useAuth();
  const [page, setPage] = useState<AgencyPage>("dashboard");
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<ApplicationListDTO[]>([]);
  const [tenants, setTenants] = useState<AgencyTenantListDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 1100);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const load = () => {
    Promise.all([listApplications(), listAgencyTenants()])
      .then(([a, t]) => {
        setApps(a);
        setTenants(t);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Impossible de charger l’espace agence.");
      });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      load();
      setError(null);
      return true;
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’action n’a pas abouti, réessayez dans un instant.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const filteredApps = useMemo(
    () => apps.filter((row) => matchesQuery(query, row.institut_name, row.contact_name, row.email)),
    [apps, query],
  );
  const filteredTenants = useMemo(
    () => tenants.filter((row) => matchesQuery(query, row.name, row.slug, row.address)),
    [tenants, query],
  );

  const pendingApps = apps.filter((row) => row.status === "pending");
  const activeTenants = tenants.filter((row) => row.is_active);
  const suspendedTenants = tenants.filter((row) => !row.is_active);
  const thisMonth = tenants.filter((row) => {
    const created = new Date(row.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const chartRows = weekSeries(tenants);
  const chartVals = chartRows.map((row) => row.v);
  const chartPeak = chartVals.length ? Math.max(...chartVals) : 0;
  const chartAvg = chartVals.length ? Math.round((chartVals.reduce((sum, n) => sum + n, 0) / chartVals.length) * 10) / 10 : 0;

  const pieData = [
    { name: "Actifs", value: activeTenants.length, color: C.green },
    { name: "Suspendus", value: suspendedTenants.length, color: C.pink },
    { name: "Demandes", value: pendingApps.length, color: C.purple },
  ].filter((d) => d.value > 0);
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  const userName = user?.full_name?.trim() || "Agence AYA";
  const userEmail = user?.email ?? "";
  const userInitials = initials(userName === "Agence AYA" && userEmail ? userEmail : userName);

  const titles: Record<AgencyPage, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Tableau de bord",
      subtitle: "Pilotez vos instituts et vos demandes d’onboarding.",
    },
    demandes: {
      title: "Demandes",
      subtitle: "Confirmez ou rejetez les candidatures reçues.",
    },
    instituts: {
      title: "Instituts",
      subtitle: "Activez, suspendez ou renvoyez le lien d’accès.",
    },
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-aya-bg">
      <aside
        className="flex h-screen shrink-0 flex-col border-r border-[#efeaf6] bg-white"
        style={{ width: collapsed ? 84 : 248 }}
      >
        <div className={`flex border-b border-[#efeaf6] ${collapsed ? "justify-center px-2 py-4" : "px-5 py-5"}`}>
          <AyaLogo width={collapsed ? 44 : 164} compact={collapsed} />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.16em] text-aya-text/70 uppercase">
              Menu
            </p>
          )}
          <AgencyNavItem
            active={page === "dashboard"}
            collapsed={collapsed}
            icon={<IconGrid size={17} />}
            label="Tableau de bord"
            onClick={() => setPage("dashboard")}
          />
          <AgencyNavItem
            active={page === "demandes"}
            collapsed={collapsed}
            icon={<IconMail size={17} />}
            label="Demandes"
            badge={pendingApps.length || undefined}
            onClick={() => setPage("demandes")}
          />
          <AgencyNavItem
            active={page === "instituts"}
            collapsed={collapsed}
            icon={<IconSpark size={17} />}
            label="Instituts"
            badge={tenants.length || undefined}
            onClick={() => setPage("instituts")}
          />
        </nav>
        <div className="border-t border-[#efeaf6] px-3 py-4">
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.16em] text-aya-text/70 uppercase">
              Général
            </p>
          )}
          <button
            onClick={logout}
            title="Déconnexion"
            className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-left text-aya-text transition hover:bg-aya-bg ${collapsed ? "justify-center px-0" : "px-3"}`}
          >
            <IconLogout size={17} />
            {!collapsed && <span className="font-display text-[13px] font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#efeaf6] bg-white/90 px-5 py-3.5 backdrop-blur-md md:px-8">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-aya-bg px-3.5 py-2.5">
            <IconSearch size={16} className="shrink-0 text-aya-text" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un institut, un contact, un e-mail…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-aya-ink outline-none placeholder:text-aya-text/70"
            />
            <kbd className="hidden rounded-md bg-white px-1.5 py-0.5 font-display text-[10px] font-semibold text-aya-text shadow-sm sm:inline">
              ⌘K
            </kbd>
          </label>
          <div className="flex items-center gap-3">
            <Avatar initials={userInitials} size={40} />
            <div className="hidden min-w-0 sm:block">
              <div className="truncate font-display text-[13px] font-semibold text-aya-ink">{userName}</div>
              <div className="truncate text-[11px] text-aya-text">{userEmail}</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-[28px] font-bold tracking-tight text-aya-ink">{titles[page].title}</h1>
              <p className="mt-1 text-[13px] text-aya-text">{titles[page].subtitle}</p>
            </div>
            <PrimaryBtn onClick={() => setCreating(true)}>
              <IconPlus size={15} /> Créer un institut
            </PrimaryBtn>
          </div>

          {error && <p className="mb-4 text-xs text-aya-pink">{error}</p>}

          {page === "dashboard" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  label="Instituts"
                  value={String(tenants.length)}
                  sub={`${thisMonth} créé${thisMonth > 1 ? "s" : ""} ce mois-ci`}
                  icon={<IconSpark size={18} />}
                />
                <KpiCard
                  label="Actifs"
                  value={String(activeTenants.length)}
                  sub="En production"
                  icon={<IconUsers size={18} />}
                  accent
                />
                <KpiCard
                  label="Suspendus"
                  value={String(suspendedTenants.length)}
                  sub="À relancer"
                  icon={<IconClock size={18} />}
                  subColor={C.orange}
                />
                <KpiCard
                  label="Demandes en attente"
                  value={String(pendingApps.length)}
                  sub={pendingApps.length ? "À traiter" : "File claire"}
                  icon={<IconMail size={18} />}
                  accent
                  subColor={pendingApps.length ? C.orange : C.green}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="flex flex-col gap-4 xl:col-span-8">
                  <Card>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-sm font-bold text-aya-ink">Activité d’onboarding</h2>
                        <p className="mt-0.5 text-[12px] text-aya-text">Instituts créés sur 7 jours</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-aya-text">Moyenne : {chartAvg}</div>
                        <div className="text-[11px] font-semibold text-aya-pink">Pic : {chartPeak}</div>
                      </div>
                    </div>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="agencyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={C.pink} stopOpacity={0.28} />
                              <stop offset="95%" stopColor={C.pink} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.text }} axisLine={false} tickLine={false} />
                          <YAxis hide allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 10, border: "none", boxShadow: SHADOW }}
                            formatter={(v) => [`${Number(v ?? 0)} institut(s)`, "Créations"]}
                          />
                          <Area type="monotone" dataKey="v" stroke={C.pink} strokeWidth={2.4} fill="url(#agencyGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-display text-sm font-bold text-aya-ink">Demandes récentes</h2>
                      <button onClick={() => setPage("demandes")} className="text-xs font-medium text-aya-pink">
                        Voir tout
                      </button>
                    </div>
                    {filteredApps.length === 0 ? (
                      <Empty title="Aucune demande" sub="Les formulaires publics apparaîtront ici." />
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {filteredApps.slice(0, 5).map((row) => (
                          <div key={row.id} className="flex items-center gap-3 rounded-xl bg-aya-bg px-3 py-2.5">
                            <Avatar initials={initials(row.contact_name)} />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-display text-[13px] font-semibold text-aya-ink">
                                {row.contact_name}
                              </div>
                              <div className="truncate text-[11px] text-aya-text">
                                {row.institut_name} · {row.email}
                              </div>
                            </div>
                            <StatusBadge
                              status={
                                row.status === "pending"
                                  ? "pending"
                                  : row.status === "confirmed"
                                    ? "confirmed"
                                    : "rejected"
                              }
                            />
                            {row.status === "pending" && (
                              <button
                                disabled={busy}
                                onClick={() => run(() => confirmApplication(row.id))}
                                className="hidden rounded-lg bg-aya-pink px-2.5 py-1 text-[11px] font-semibold text-white sm:inline"
                              >
                                Confirmer
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                <div className="flex flex-col gap-4 xl:col-span-4">
                  <div
                    className="rounded-2xl p-5 text-white"
                    style={{
                      background: "linear-gradient(145deg, #3C2164 0%, #6B2B7A 52%, #E64F92 100%)",
                      boxShadow: SHADOW,
                    }}
                  >
                    <p className="font-display text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
                      À traiter
                    </p>
                    <h2 className="mt-3 font-display text-lg font-bold leading-snug">
                      {pendingApps.length > 0
                        ? `${pendingApps.length} demande${pendingApps.length > 1 ? "s" : ""} en attente`
                        : "File d’onboarding claire"}
                    </h2>
                    <p className="mt-2 text-[12px] text-white/80">
                      {pendingApps.length > 0
                        ? "Confirmez les instituts pour envoyer le lien d’activation."
                        : "Créez un institut ou attendez une nouvelle candidature."}
                    </p>
                    <button
                      onClick={() => (pendingApps.length ? setPage("demandes") : setCreating(true))}
                      className="mt-4 w-full rounded-xl bg-white py-2.5 font-display text-[13px] font-semibold text-aya-purple"
                    >
                      {pendingApps.length ? "Ouvrir les demandes" : "Créer un institut"}
                    </button>
                  </div>

                  <Card>
                    <h2 className="mb-3 font-display text-sm font-bold text-aya-ink">Répartition</h2>
                    {pieTotal === 0 ? (
                      <Empty title="Pas encore de données" sub="Les instituts apparaîtront ici." />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="relative h-[120px] w-[120px] shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={36}
                                outerRadius={52}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry) => (
                                  <Cell key={entry.name} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display text-lg font-bold text-aya-ink">{pieTotal}</span>
                            <span className="text-[9px] text-aya-text">total</span>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          {pieData.map((d) => (
                            <div key={d.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                                <span className="text-[11px] text-aya-text">{d.name}</span>
                              </div>
                              <span className="text-[11px] font-semibold text-aya-ink">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="font-display text-sm font-bold text-aya-ink">Instituts</h2>
                      <button onClick={() => setPage("instituts")} className="text-xs font-medium text-aya-pink">
                        Voir tout
                      </button>
                    </div>
                    {filteredTenants.length === 0 ? (
                      <Empty title="Aucun institut" sub="Créez un tenant ou confirmez une demande." />
                    ) : (
                      <div className="flex flex-col gap-2">
                        {filteredTenants.slice(0, 5).map((row, i) => {
                          const tone = PROJECT_TONES[i % PROJECT_TONES.length];
                          const Icon = tone.Icon;
                          return (
                            <div key={row.id} className="flex items-center gap-3 rounded-xl bg-aya-bg px-3 py-2.5">
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: tone.bg, color: tone.color }}
                              >
                                <Icon size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-display text-[12px] font-semibold text-aya-ink">{row.name}</div>
                                <div className="truncate text-[10px] text-aya-text">
                                  Créé le {formatDayLabel(row.created_at)}
                                </div>
                              </div>
                              <StatusBadge status={row.is_active ? "active" : "suspended"} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}

          {page === "demandes" && (
            <Card className="p-0">
              {filteredApps.length === 0 && <Empty title="Aucune demande" sub="Les formulaires publics apparaîtront ici." />}
              {filteredApps.map((row) => (
                <div key={row.id} className="flex flex-wrap items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
                  <Avatar initials={initials(row.contact_name)} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[13px] font-semibold text-aya-ink">{row.institut_name}</div>
                    <div className="text-[11px] text-aya-text">
                      {row.contact_name} · {row.email} · {formatDayLabel(row.created_at)}
                    </div>
                  </div>
                  <StatusBadge
                    status={
                      row.status === "pending" ? "pending" : row.status === "confirmed" ? "confirmed" : "rejected"
                    }
                  />
                  {row.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        disabled={busy}
                        onClick={() => run(() => confirmApplication(row.id))}
                        className="rounded-lg bg-aya-pink px-3 py-1.5 text-[11px] font-semibold text-white"
                      >
                        Confirmer
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => run(() => rejectApplication(row.id))}
                        className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-text"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}

          {page === "instituts" && (
            <Card className="p-0">
              {filteredTenants.length === 0 && (
                <Empty title="Aucun institut" sub="Créez un tenant ou confirmez une demande." />
              )}
              {filteredTenants.map((row, i) => {
                const tone = PROJECT_TONES[i % PROJECT_TONES.length];
                const Icon = tone.Icon;
                return (
                  <div key={row.id} className="flex flex-wrap items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: tone.bg, color: tone.color }}
                    >
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-[13px] font-semibold text-aya-ink">{row.name}</div>
                      <div className="text-[11px] text-aya-text">
                        {row.slug} · {row.address || "Adresse non renseignée"}
                      </div>
                    </div>
                    <StatusBadge status={row.is_active ? "active" : "suspended"} />
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={busy}
                        onClick={() => run(() => resendActivation(row.id))}
                        className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-purple"
                      >
                        Renvoyer le lien
                      </button>
                      {row.is_active ? (
                        <button
                          disabled={busy}
                          onClick={() => run(() => suspendTenant(row.id))}
                          className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-text"
                        >
                          Suspendre
                        </button>
                      ) : (
                        <button
                          disabled={busy}
                          onClick={() => run(() => activateTenant(row.id))}
                          className="rounded-lg bg-aya-pink px-3 py-1.5 text-[11px] font-semibold text-white"
                        >
                          Réactiver
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      </div>

      {creating && (
        <Modal title="Créer un institut" onClose={() => setCreating(false)}>
          <CreateInstitutForm
            busy={busy}
            onCancel={() => setCreating(false)}
            onSubmit={async (payload) => {
              const ok = await run(() => createAgencyTenant(payload));
              if (ok) setCreating(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function AgencyNavItem({
  active,
  collapsed,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  collapsed: boolean;
  icon: ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`mb-1 flex w-full items-center gap-3 rounded-xl py-2.5 text-left transition ${collapsed ? "justify-center px-0" : "px-3"}`}
      style={{
        background: active ? `${C.pink}14` : "transparent",
        color: active ? C.pink : C.text,
      }}
    >
      <span style={{ color: active ? C.pink : C.purple }}>{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 font-display text-[13px]" style={{ fontWeight: active ? 600 : 500, color: active ? C.ink : C.text }}>
            {label}
          </span>
          {badge != null && (
            <span
              className="rounded-full px-1.5 py-0.5 font-display text-[10px] font-bold"
              style={{ background: active ? C.pink : C.bg, color: active ? "#fff" : C.purple }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}

function CreateInstitutForm({
  busy,
  onCancel,
  onSubmit,
}: {
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: { institut_name: string; contact_name: string; email: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit({
          institut_name: name.trim(),
          contact_name: contact.trim(),
          email: email.trim(),
        });
      }}
    >
      <Field label="Nom de l’institut">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Contact">
        <Input value={contact} onChange={(e) => setContact(e.target.value)} required />
      </Field>
      <Field label="E-mail">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <div className="mt-2 flex gap-2">
        <PrimaryBtn type="submit" disabled={busy} full>
          {busy ? "Création…" : "Enregistrer et envoyer le lien"}
        </PrimaryBtn>
        <button type="button" onClick={onCancel} className="rounded-xl px-4 text-xs font-semibold text-aya-text">
          Annuler
        </button>
      </div>
    </form>
  );
}
