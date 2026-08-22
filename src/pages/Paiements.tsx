import { PAYMENTS, fmt } from "../data";
import { C } from "../theme";
import { PageHeader, Card, Avatar, StatusBadge, KpiCard } from "../components";
import { IconCard, IconClock, IconChart } from "../icons";

export default function Paiements() {
  const paid = PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Paiements" subtitle="Encaissements, acomptes et soldes" />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <div className="flex gap-4">
          <KpiCard label="Encaissé ce mois" value={fmt(1850000)} sub="+18% vs mois dernier" icon={<IconCard size={18} />} accent />
          <KpiCard label="Acomptes reçus" value={fmt(paid)} sub="Wave, OM, carte, espèces" icon={<IconChart size={18} />} />
          <KpiCard label="En attente" value={fmt(pending)} sub="2 acomptes à relancer" icon={<IconClock size={18} />} />
        </div>

        <Card className="p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-display text-sm font-bold text-aya-ink">Historique</h3>
            <div className="flex gap-2">
              {["Tous", "Payé", "En attente"].map((t, i) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{ background: i === 0 ? C.purple : C.bg, color: i === 0 ? C.cream : C.text }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-[#f0ebf8] bg-aya-bg/50 text-[11px] font-semibold tracking-wide text-aya-text uppercase">
                <th className="px-5 py-3">Cliente</th>
                <th className="px-3 py-3">Prestation</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Moyen</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Montant</th>
                <th className="px-3 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="border-b border-[#f6f2fb] last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={p.avatar} size={30} />
                      <span className="font-medium">{p.client}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-aya-text">{p.service}</td>
                  <td className="px-3 py-3">{p.type}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-aya-bg px-2 py-0.5 text-[11px]">{p.method}</span>
                  </td>
                  <td className="px-3 py-3 text-aya-text">{p.date}</td>
                  <td className="px-3 py-3 font-display font-semibold text-aya-purple">{fmt(p.amount)}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
