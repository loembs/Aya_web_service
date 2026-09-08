import { useMemo, useState } from "react";
import type { Status } from "../data";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, SearchBar, StatusBadge, Avatar, Card, Empty } from "../components";
import { IconPlus, IconFilter } from "../icons";
import { useBookings } from "../api/useBookings";
import { formatDayLabel, formatFcfa, formatTime, initials } from "../api/format";

export default function RendezVous({ onNewRdv }: { onNewRdv: () => void }) {
  const { rows, loading, error } = useBookings();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (
        needle &&
        !a.client_name.toLowerCase().includes(needle) &&
        !a.service_name.toLowerCase().includes(needle)
      ) {
        return false;
      }
      return true;
    });
  }, [rows, q, status]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Rendez-vous"
        subtitle={loading ? "Chargement…" : `${filtered.length} rendez-vous affichés`}
        action={
          <PrimaryBtn onClick={onNewRdv}>
            <IconPlus size={14} /> Nouveau rendez-vous
          </PrimaryBtn>
        }
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <Card className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <SearchBar placeholder="Cliente, prestation..." value={q} onChange={setQ} />
          </div>
          <div className="flex items-center gap-1.5 text-aya-text">
            <IconFilter size={14} />
          </div>
          {(["all", "confirmed", "pending", "cancelled", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="rounded-full px-3 py-1 font-display text-[11px] font-semibold"
              style={{ background: status === s ? C.purple : C.bg, color: status === s ? C.cream : C.text }}
            >
              {s === "all" ? "Tous" : s === "confirmed" ? "Confirmé" : s === "pending" ? "En attente" : s === "cancelled" ? "Annulé" : "Terminé"}
            </button>
          ))}
        </Card>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#f0ebf8] bg-aya-bg/60 text-[11px] font-semibold tracking-wide text-aya-text uppercase">
                <th className="px-5 py-3">Cliente</th>
                <th className="px-3 py-3">Date & heure</th>
                <th className="px-3 py-3">Prestation</th>
                <th className="px-3 py-3">Praticienne</th>
                <th className="px-3 py-3">Montant</th>
                <th className="px-3 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8">
                    <Empty
                      title={error ?? "Aucun rendez-vous"}
                      sub={loading ? "Chargement depuis l'API…" : "Les réservations de votre institut apparaîtront ici."}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[#f6f2fb] last:border-0 hover:bg-aya-bg/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={initials(r.client_name)} size={32} />
                        <div>
                          <div className="font-display text-[13px] font-semibold text-aya-ink">{r.client_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-aya-ink">
                      {formatDayLabel(r.starts_at)}
                      <div className="text-[11px] text-aya-text">
                        {formatTime(r.starts_at)} – {formatTime(r.ends_at)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13px]">{r.service_name}</td>
                    <td className="px-3 py-3 text-[13px] text-aya-text">{r.praticien_name ?? "—"}</td>
                    <td className="px-3 py-3 font-display text-[13px] font-semibold text-aya-purple">
                      {r.service_price_cents != null ? formatFcfa(r.service_price_cents) : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
