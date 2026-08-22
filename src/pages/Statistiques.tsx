import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { REVENUE_DATA, PIE_DATA, SOURCE_DATA, fmt } from "../data";
import { C } from "../theme";
import { PageHeader, Card, KpiCard } from "../components";
import { IconCard, IconCalendar, IconUsers, IconChart } from "../icons";

const PROFIT = [
  { name: "Maquillage soirée", ca: 320000 },
  { name: "Pose perruque", ca: 280000 },
  { name: "Soft Glam", ca: 250000 },
  { name: "Tresses collées", ca: 200000 },
  { name: "Soin du visage", ca: 160000 },
];

export default function Statistiques() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Statistiques" subtitle="Mai 2025 · performance de l'établissement" />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <div className="flex gap-4">
          <KpiCard label="Chiffre d'affaires" value="1 850 000 FCFA" sub="+18% vs avril" icon={<IconCard size={18} />} accent />
          <KpiCard label="Rendez-vous" value="87" sub="+12% vs avril" icon={<IconCalendar size={18} />} />
          <KpiCard label="Nouveaux clients" value="34" sub="+12 vs avril" icon={<IconUsers size={18} />} />
          <KpiCard label="Clients fidèles" value="62%" sub="+10 pts" icon={<IconChart size={18} />} />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-8">
            <h3 className="mb-1 font-display text-sm font-bold text-aya-ink">Chiffre d'affaires</h3>
            <p className="mb-3 text-xs text-aya-text">Évolution quotidienne · mai 2025</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.pink} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={C.pink} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.text }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 10, fill: C.text }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip formatter={(v: number) => [fmt(v), "CA"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "none" }} />
                  <Area type="monotone" dataKey="v" stroke={C.pink} strokeWidth={2.5} fill="url(#caGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="col-span-4">
            <h3 className="mb-1 font-display text-sm font-bold text-aya-ink">Répartition des prestations</h3>
            <p className="mb-2 text-xs text-aya-text">Part du CA par catégorie</p>
            <div className="mx-auto h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                    {PIE_DATA.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2">
                    <i className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <b>{d.value}%</b>
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-7">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-aya-ink">Sources de réservation</h3>
                <p className="text-xs text-aya-text">Là où vos clientes vous trouvent — un avantage AYA Pro</p>
              </div>
              <span className="rounded-full bg-aya-pink/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-aya-pink uppercase">
                Différenciant
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {SOURCE_DATA.map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-medium text-aya-ink">
                      {s.name} <span className="font-normal text-aya-text">· {s.hint}</span>
                    </span>
                    <b>{s.value}%</b>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-aya-bg">
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-5">
            <h3 className="mb-1 font-display text-sm font-bold text-aya-ink">Prestations les plus rentables</h3>
            <p className="mb-3 text-xs text-aya-text">CA généré ce mois</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROFIT} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: C.ink }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [fmt(v), "CA"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "none" }} />
                  <Bar dataKey="ca" fill={C.purple} radius={[0, 8, 8, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
