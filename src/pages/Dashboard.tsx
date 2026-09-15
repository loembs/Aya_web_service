import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TODO_ITEMS, HOURS, WEEK, CALENDAR_EVENTS } from "../data";
import { C } from "../theme";
import {
  Avatar, StatusBadge, KpiCard, Card, PrimaryBtn, AyaLogo, Empty,
} from "../components";
import {
  IconBell, IconPlus, IconClock, IconCard, IconUsers, IconChart,
  IconCalendar, IconMail, IconMegaphone, IconSpark, IconSearch,
} from "../icons";
import { useAuth } from "../auth/AuthContext";
import { useBookings } from "../api/useBookings";
import { fetchDashboardActivity, fetchDashboardChart, fetchDashboardStats } from "../api/dashboard";
import { listClients } from "../api/clients";
import { listServices } from "../api/catalog";
import { formatDayLabel, formatFcfa, formatTime, initials } from "../api/format";
import type {
  ClientListResponseDTO,
  DashboardChartPointDTO,
  DashboardPeriodStatsDTO,
  RecentActivityItemDTO,
  ServiceListResponseDTO,
} from "../api/dto";

const TODO_ICONS: Record<string, typeof IconCalendar> = {
  calendar: IconCalendar,
  mail: IconMail,
  card: IconCard,
  mega: IconMegaphone,
};

export default function Dashboard({
  onNavigate,
  onNewRdv,
}: {
  onNavigate: (id: string) => void;
  onNewRdv: () => void;
}) {
  const { user, institutName, institutId } = useAuth();
  const { rows: bookings, loading } = useBookings();
  const [dayStats, setDayStats] = useState<DashboardPeriodStatsDTO | null>(null);
  const [chart, setChart] = useState<DashboardChartPointDTO[]>([]);
  const [activity, setActivity] = useState<RecentActivityItemDTO[]>([]);
  const [clients, setClients] = useState<ClientListResponseDTO[]>([]);
  const [services, setServices] = useState<ServiceListResponseDTO[]>([]);
  const [calView, setCalView] = useState<"Jour" | "Semaine" | "Mois">("Semaine");
  const [prestaTab, setPrestaTab] = useState("Toutes");
  const firstName = user?.full_name.trim().split(/\s+/)[0] ?? "";
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const upcoming = bookings
    .filter((b) => b.status !== "cancelled")
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, 6);

  useEffect(() => {
    if (!institutId) return;
    let cancelled = false;
    Promise.all([
      fetchDashboardStats(institutId),
      fetchDashboardChart(institutId),
      fetchDashboardActivity(institutId),
      listClients(institutId),
      listServices(institutId),
    ])
      .then(([stats, chartData, activityData, clientRows, serviceRows]) => {
        if (cancelled) return;
        setDayStats(stats.day);
        setChart(chartData.points);
        setActivity(activityData.items);
        setClients(clientRows);
        setServices(serviceRows);
      })
      .catch(() => {
        if (!cancelled) setDayStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [institutId]);

  const categoryMap: Record<string, string> = {
    Toutes: "Toutes",
    Maquillage: "maquillage",
    Coiffure: "coiffure",
    Onglerie: "onglerie",
  };
  const filteredPresta = services
    .filter((p) => prestaTab === "Toutes" || p.category === categoryMap[prestaTab])
    .slice(0, 5);
  const pieData = dayStats
    ? [
        { name: "Confirmés", value: dayStats.confirmed, color: C.pink },
        { name: "En attente", value: dayStats.pending, color: C.purple },
        { name: "Terminés", value: dayStats.completed, color: "#C9F0DC" },
      ].filter((d) => d.value > 0)
    : [];
  const chartRows = chart.map((p) => ({
    day: new Date(p.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    v: p.bookings_total,
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[#efeaf6] bg-white/90 px-8 py-4 backdrop-blur-md">
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-tight text-aya-ink">
            Bonjour{firstName ? ` ${firstName}` : ""}
          </h1>
          <p className="mt-0.5 text-[13px] text-aya-text">
            {todayLabel}
            {institutName ? ` · ${institutName}` : ""}
            {dayStats ? ` · ${dayStats.bookings_total} rendez-vous aujourd'hui` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryBtn onClick={onNewRdv}>
            <IconPlus size={15} /> Nouveau rendez-vous
          </PrimaryBtn>
          <button className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-aya-bg text-aya-purple">
            <IconBell size={18} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-aya-pink text-[9px] font-bold text-white">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-8 py-6">
        <div className="flex gap-4">
          <KpiCard
            label="RDV aujourd'hui"
            value={dayStats ? String(dayStats.bookings_total) : loading ? "…" : "0"}
            sub={dayStats ? `${dayStats.pending} en attente` : "Données API"}
            icon={<IconCalendar size={18} />}
          />
          <KpiCard
            label="Confirmés"
            value={dayStats ? String(dayStats.confirmed) : loading ? "…" : "0"}
            sub="Statut confirmé"
            icon={<IconCard size={18} />}
            accent
          />
          <KpiCard
            label="Annulés"
            value={dayStats ? String(dayStats.cancelled) : loading ? "…" : "0"}
            sub="Aujourd'hui"
            icon={<IconUsers size={18} />}
          />
          <KpiCard
            label="Terminés"
            value={dayStats ? String(dayStats.completed) : loading ? "…" : "0"}
            sub="Aujourd'hui"
            icon={<IconChart size={18} />}
            accent
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-3">
            <RowTitle title="Prochains rendez-vous" onAll={() => onNavigate("rdv")} />
            <div className="flex flex-col gap-2.5">
              {upcoming.length === 0 ? (
                <Empty title="Aucun rendez-vous" sub={loading ? "Chargement…" : "Les prochains RDV apparaîtront ici."} />
              ) : (
                upcoming.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-2.5 rounded-xl bg-aya-bg px-3 py-2.5 transition hover:bg-[#efeaf6]">
                    <Avatar initials={initials(apt.client_name)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[13px] font-semibold text-aya-ink">{apt.client_name}</div>
                      <div className="truncate text-[11px] text-aya-text">
                        {formatDayLabel(apt.starts_at)} · {formatTime(apt.starts_at)} · {apt.service_name}
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))
              )}
            </div>
            <button onClick={() => onNavigate("rdv")} className="mt-3.5 w-full font-display text-xs font-semibold text-aya-pink">
              Voir tous les rendez-vous →
            </button>
          </Card>

          <Card className="col-span-3">
            <RowTitle title="À faire aujourd'hui" />
            <div className="flex flex-col gap-2.5">
              {TODO_ITEMS.map((item) => {
                const Ico = TODO_ICONS[item.icon];
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.page)}
                    className="flex items-center gap-3 rounded-xl bg-aya-bg px-3 py-2.5 text-left transition hover:bg-[#efeaf6]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-aya-purple/10 text-aya-purple">
                      {Ico && <Ico size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-xs font-semibold text-aya-ink">{item.title}</div>
                      <div className="text-[11px] text-aya-text">{item.sub}</div>
                    </div>
                    <span className="text-aya-text">›</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="col-span-6 overflow-hidden">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-aya-ink">Agenda</span>
                <button onClick={() => onNavigate("agenda")} className="text-[12px] font-medium text-aya-pink">
                  Ouvrir →
                </button>
              </div>
              <div className="flex gap-1">
                {(["Jour", "Semaine", "Mois"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalView(v)}
                    className="rounded-md px-2.5 py-1 font-display text-[11px] font-semibold"
                    style={{
                      background: calView === v ? C.pink : C.bg,
                      color: calView === v ? "#fff" : C.text,
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2 font-display text-xs font-semibold text-aya-ink">19 – 25 Mai 2025</div>
            {calView === "Mois" ? (
              <MonthMini />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                  <div className="mb-0.5 grid" style={{ gridTemplateColumns: "44px repeat(7,1fr)" }}>
                    <div />
                    {WEEK.map((d, i) => (
                      <div key={d} className="py-1 text-center text-[10px] font-semibold" style={{ color: i === 2 ? C.pink : C.text }}>
                        <div>{d.split(" ")[0]}</div>
                        <div
                          className="mx-auto mt-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold"
                          style={{ background: i === 2 ? C.pink : "transparent", color: i === 2 ? "#fff" : C.text }}
                        >
                          {d.split(" ")[1]}
                        </div>
                      </div>
                    ))}
                  </div>
                  {HOURS.map((hour) => (
                    <div key={hour} className="grid min-h-[34px] border-t border-[#f0ebf8]" style={{ gridTemplateColumns: "44px repeat(7,1fr)" }}>
                      <div className="pt-1 pr-1.5 text-right text-[10px] text-[#b0a8c2]">{hour}</div>
                      {WEEK.map((day) => {
                        const events = CALENDAR_EVENTS[`${day}:${hour}`];
                        return (
                          <div key={day} className="relative p-0.5">
                            {events?.map((ev) => (
                              <div
                                key={ev.name}
                                className="overflow-hidden rounded-[5px] px-1.5 py-0.5 text-[9px] font-semibold leading-tight text-aya-ink"
                                style={{ background: ev.color }}
                              >
                                <div className="truncate">{ev.name}</div>
                                <div className="truncate font-normal opacity-75">{ev.service}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-aya-ink">Prestations</span>
              <button onClick={() => onNavigate("presta")} className="rounded-lg bg-aya-purple px-2.5 py-1 font-display text-[11px] font-semibold text-aya-cream">
                + Ajouter
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {["Toutes", "Maquillage", "Coiffure", "Onglerie"].map((t) => (
                <button
                  key={t}
                  onClick={() => setPrestaTab(t)}
                  className="rounded-full px-2.5 py-1 font-display text-[11px] font-semibold"
                  style={{ background: prestaTab === t ? C.pink : C.bg, color: prestaTab === t ? "#fff" : C.text }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {filteredPresta.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded-[10px] bg-aya-bg px-2.5 py-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aya-pink/15 text-aya-pink">
                    <IconSpark size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-xs font-semibold text-aya-ink">{p.name}</div>
                    <div className="text-[10px] text-aya-text">
                      {p.duration_min} min · {formatFcfa(p.price_cents)}
                    </div>
                  </div>
                  <span className="rounded-full bg-[#E8F8F0] px-2 py-0.5 text-[10px] font-semibold text-[#1A8A55]">
                    {p.is_active ? "Disponible" : "Pause"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-aya-ink">Clientes</span>
              <button onClick={() => onNavigate("clientes")} className="rounded-lg bg-aya-pink px-2.5 py-1 font-display text-[11px] font-semibold text-white">
                + Ajouter
              </button>
            </div>
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-aya-bg px-3 py-1.5">
              <IconSearch size={14} />
              <span className="text-xs text-aya-text">Rechercher une cliente...</span>
            </div>
            <div className="flex flex-col gap-2">
              {clients.slice(0, 5).map((cl) => (
                <button key={cl.id} onClick={() => onNavigate("clientes")} className="flex items-center gap-2.5 rounded-[10px] bg-aya-bg px-2.5 py-2 text-left">
                  <Avatar initials={initials(cl.full_name)} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xs font-semibold text-aya-ink">{cl.full_name}</div>
                    <div className="text-[10px] text-aya-text">
                      Dernière visite : {cl.last_visit_at ? formatDayLabel(cl.last_visit_at) : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-aya-purple">{formatFcfa(cl.total_cents)}</div>
                    <span className="text-[10px] text-aya-text">Total dépensé</span>
                  </div>
                </button>
              ))}
              {clients.length === 0 && (
                <p className="text-[11px] text-aya-text">{activity[0] ? `${activity[0].client_name} · dernière activité` : "Aucune cliente pour le moment."}</p>
              )}
            </div>
          </Card>

          <Card className="col-span-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-aya-ink">Statistiques</span>
              <button onClick={() => onNavigate("stats")} className="rounded-lg bg-aya-bg px-2.5 py-1 text-[11px] text-aya-text">
                Ce mois-ci ▾
              </button>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {[
                { label: "Rendez-vous semaine", val: String(chart.reduce((sum, p) => sum + p.bookings_total, 0)), unit: "", delta: "7 jours" },
                { label: "Rendez-vous", val: String(dayStats?.bookings_total ?? 0), unit: "", delta: "Aujourd'hui" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[10px] text-aya-text">{s.label}</div>
                  <div className="font-display text-base font-bold text-aya-ink">
                    {s.val} <span className="text-[10px] font-normal">{s.unit}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-[#1A8A55]">{s.delta}</div>
                </div>
              ))}
            </div>
            <div className="mb-3 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartRows} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.pink} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.pink} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: C.text }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "none" }} formatter={(v) => [`${Number(v ?? 0)} RDV`, "Volume"]} />
                  <Area type="monotone" dataKey="v" stroke={C.pink} strokeWidth={2} fill="url(#revGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-[90px] w-[90px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={2} dataKey="value">
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
                      <span className="text-[11px] text-aya-text">{d.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-aya-ink">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-aya-ink">Ma fiche publique</span>
              <button onClick={() => onNavigate("fiche")} className="text-[11px] font-medium text-aya-pink">
                Voir ma page
              </button>
            </div>
            <div className="mb-3 overflow-hidden rounded-xl" style={{ background: "linear-gradient(135deg,#1a0a2e 0%,#3C2164 100%)" }}>
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=120&fit=crop&auto=format"
                alt="Salon"
                className="h-20 w-full object-cover opacity-80"
              />
              <div className="px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-2">
                    <AyaLogo width={36} compact className="-mt-5 rounded-[10px] border-2 border-aya-cream/30" />
                  <div>
                    <div className="font-display text-[11px] font-bold text-aya-cream">{institutName ?? "Votre institut"}</div>
                    <div className="text-[9px] text-aya-cream/60">⭐ 4,9 (126 avis) · Dakar, Sénégal</div>
                  </div>
                </div>
                <button className="mb-2 w-full rounded-md bg-aya-pink py-1.5 font-display text-[10px] font-bold text-white">
                  Réserver maintenant
                </button>
                {[["Maquillage Soft Glam", "25 000"], ["Pose perruque", "35 000"]].map(([name, price]) => (
                  <div key={name} className="flex items-center justify-between border-b border-white/5 py-1">
                    <span className="text-[9px] text-aya-cream">{name}</span>
                    <span className="text-[9px] text-aya-pink">{price} F</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-aya-bg px-2.5 py-2">
              <IconClock size={12} />
              <span className="flex-1 text-[11px] font-medium text-aya-purple">aya.app/andalbeautystudio</span>
              <button onClick={() => onNavigate("fiche")} className="rounded-md bg-aya-purple px-2.5 py-1 font-display text-[10px] font-semibold text-aya-cream">
                Partager
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RowTitle({ title, onAll }: { title: string; onAll?: () => void }) {
  return (
    <div className="mb-3.5 flex items-center justify-between">
      <span className="font-display text-sm font-bold text-aya-ink">{title}</span>
      {onAll && (
        <button onClick={onAll} className="text-xs font-medium text-aya-pink">
          Voir tout
        </button>
      )}
    </div>
  );
}

function MonthMini() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const busy = [3, 7, 12, 15, 18, 19, 20, 21, 22, 23, 24, 28];
  return (
    <div className="grid grid-cols-7 gap-1 pt-1">
      {["L", "M", "M", "J", "V", "S", "D"].map((d) => (
        <div key={d} className="text-center text-[10px] font-semibold text-aya-text">
          {d}
        </div>
      ))}
      {days.map((d) => (
        <div
          key={d}
          className="flex h-8 items-center justify-center rounded-lg text-[11px]"
          style={{
            background: d === 21 ? C.pink : busy.includes(d) ? `${C.purple}12` : "transparent",
            color: d === 21 ? "#fff" : C.ink,
            fontWeight: d === 21 ? 700 : 500,
          }}
        >
          {d}
        </div>
      ))}
    </div>
  );
}
