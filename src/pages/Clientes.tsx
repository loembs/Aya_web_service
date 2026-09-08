import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createClient, listClientBookings, listClients } from "../api/clients";
import { formatDayLabel, formatFcfa, formatTime, initials } from "../api/format";
import type { ClientBookingHistoryItemDTO, ClientListResponseDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, SearchBar, Card, Avatar, StatusBadge, Field, Input, Empty } from "../components";
import { IconPlus } from "../icons";

export default function Clientes({ onMessage: _onMessage }: { onMessage: () => void }) {
  const { institutId } = useAuth();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ClientListResponseDTO[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [history, setHistory] = useState<ClientBookingHistoryItemDTO[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!institutId) return;
    setLoading(true);
    listClients(institutId)
      .then((data) => {
        setRows(data);
        setError(null);
        setSel((current) => current ?? data[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Impossible de charger les clientes pour le moment.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutId]);

  useEffect(() => {
    if (!institutId || !sel) {
      setHistory([]);
      return;
    }
    let cancelled = false;
    listClientBookings(institutId, sel)
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch(() => {
        if (!cancelled) setHistory([]);
      });
    return () => {
      cancelled = true;
    };
  }, [institutId, sel]);

  const list = useMemo(
    () => rows.filter((c) => c.full_name.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );
  const client = rows.find((c) => c.id === sel) ?? null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!institutId || name.trim().length < 2) return;
    setSaving(true);
    try {
      const created = await createClient(institutId, {
        full_name: name.trim(),
        phone: phone.trim() || undefined,
      });
      setName("");
      setPhone("");
      setAdding(false);
      await Promise.resolve();
      setRows((prev) => [
        {
          id: created.id,
          full_name: created.full_name,
          phone: created.phone,
          email: created.email,
          visits: created.visits,
          last_visit_at: created.last_visit_at,
          total_cents: created.total_cents,
        },
        ...prev,
      ]);
      setSel(created.id);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’enregistrement n’a pas abouti, réessayez dans un instant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Clientes"
        subtitle={loading ? "Chargement…" : `${rows.length} clientes · fichier du salon`}
        action={
          <PrimaryBtn onClick={() => setAdding(!adding)}>
            <IconPlus size={14} /> Ajouter une cliente
          </PrimaryBtn>
        }
      />
      <div className="grid flex-1 grid-cols-12 gap-4 overflow-hidden px-7 py-5">
        <Card className="col-span-5 flex flex-col overflow-hidden p-4">
          <SearchBar placeholder="Rechercher une cliente..." value={q} onChange={setQ} />
          {adding && (
            <form className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-aya-bg p-3" onSubmit={submit}>
              <Field label="Nom">
                <Input placeholder="Prénom Nom" value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Téléphone">
                <Input placeholder="+221 …" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <div className="col-span-2 flex gap-2">
                <button type="button" onClick={() => setAdding(false)} className="flex-1 rounded-lg bg-white py-2 text-xs font-semibold text-aya-text">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-aya-pink py-2 text-xs font-semibold text-white disabled:opacity-50">
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          )}
          {error && <p className="mt-3 text-xs text-aya-pink">{error}</p>}
          <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
            {loading && <p className="px-2 py-6 text-center text-xs text-aya-text">Chargement du fichier…</p>}
            {!loading && list.length === 0 && (
              <Empty title="Aucune cliente" sub="Ajoutez une première cliente pour constituer votre fichier." />
            )}
            {list.map((cl) => (
              <button
                key={cl.id}
                onClick={() => setSel(cl.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                style={{ background: sel === cl.id ? C.cream : C.bg }}
              >
                <Avatar initials={initials(cl.full_name)} />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[13px] font-semibold text-aya-ink">{cl.full_name}</div>
                  <div className="text-[11px] text-aya-text">
                    {cl.phone || "Sans téléphone"} · {cl.visits} visites
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-semibold text-aya-purple">{formatFcfa(cl.total_cents)}</div>
                  <div className="text-[10px] text-aya-text">
                    {cl.last_visit_at ? formatDayLabel(cl.last_visit_at) : "—"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="col-span-7 overflow-y-auto">
          {!client ? (
            <Card>
              <Empty title="Sélectionnez une cliente" sub="Son historique de rendez-vous apparaîtra ici." />
            </Card>
          ) : (
            <Card>
              <div className="flex items-start gap-4">
                <Avatar initials={initials(client.full_name)} size={64} />
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-aya-ink">{client.full_name}</h2>
                  <p className="text-sm text-aya-text">{client.phone || "Téléphone non renseigné"}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>
                      <b className="text-aya-ink">{formatFcfa(client.total_cents)}</b>
                      <span className="ml-1 text-aya-text">dépensés</span>
                    </span>
                    <span>
                      <b className="text-aya-ink">{client.visits}</b>
                      <span className="ml-1 text-aya-text">visites</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-aya-bg p-3">
                  <div className="text-[11px] text-aya-text">Téléphone</div>
                  <div className="font-medium text-aya-ink">{client.phone || "—"}</div>
                </div>
                <div className="rounded-xl bg-aya-bg p-3">
                  <div className="text-[11px] text-aya-text">E-mail</div>
                  <div className="font-medium text-aya-ink">{client.email || "—"}</div>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 font-display text-sm font-bold text-aya-ink">Historique des rendez-vous</div>
                <div className="space-y-2">
                  {history.length === 0 && <p className="text-xs text-aya-text">Aucun rendez-vous enregistré.</p>}
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between rounded-xl bg-aya-bg px-3 py-2.5">
                      <div>
                        <div className="text-[13px] font-semibold text-aya-ink">{h.service_name}</div>
                        <div className="text-[11px] text-aya-text">
                          {formatDayLabel(h.starts_at)} · {formatTime(h.starts_at)} · {h.praticien_name ?? "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-aya-purple">{formatFcfa(h.price_cents)}</span>
                        <StatusBadge status={h.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
