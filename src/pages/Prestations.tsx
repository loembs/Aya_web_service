import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { createService, listServices } from "../api/catalog";
import { formatFcfa } from "../api/format";
import type { ServiceCategory, ServiceListResponseDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, Card, Modal, Field, Input, Select, Empty } from "../components";
import { IconPlus } from "../icons";

const TABS: { id: string; label: string; category?: ServiceCategory }[] = [
  { id: "all", label: "Toutes" },
  { id: "maquillage", label: "Maquillage", category: "maquillage" },
  { id: "coiffure", label: "Coiffure", category: "coiffure" },
  { id: "onglerie", label: "Onglerie", category: "onglerie" },
  { id: "soins", label: "Soins", category: "soins" },
  { id: "autres", label: "Autres", category: "autres" },
];

export default function Prestations() {
  const { institutId } = useAuth();
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ServiceListResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("autres");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("20000");
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!institutId) return;
    setLoading(true);
    listServices(institutId)
      .then((data) => {
        setRows(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Les prestations n’ont pas pu être chargées.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutId]);

  const filtered = useMemo(() => {
    if (tab === "all") return rows;
    return rows.filter((p) => p.category === tab);
  }, [rows, tab]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!institutId) return;
    setSaving(true);
    try {
      await createService(institutId, {
        name: name.trim(),
        duration_min: Number(duration) || 60,
        price_cents: Number(price) || 0,
        category,
      });
      setOpen(false);
      setName("");
      load();
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’enregistrement n’a pas abouti, réessayez dans un instant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Prestations"
        subtitle="Catalogue visible sur votre fiche publique"
        action={
          <PrimaryBtn onClick={() => setOpen(true)}>
            <IconPlus size={14} /> Ajouter une prestation
          </PrimaryBtn>
        }
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="rounded-full px-3.5 py-1.5 font-display text-xs font-semibold"
              style={{ background: tab === t.id ? C.pink : "#fff", color: tab === t.id ? "#fff" : C.text }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-aya-pink">{error}</p>}
        <Card className="p-0">
          {loading && <p className="px-5 py-8 text-center text-xs text-aya-text">Chargement du catalogue…</p>}
          {!loading && filtered.length === 0 && (
            <Empty title="Aucune prestation" sub="Ajoutez un soin, une coupe ou un maquillage pour commencer." />
          )}
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aya-pink/10 font-display text-xs font-bold text-aya-pink">
                {p.duration_min}m
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[13px] font-semibold text-aya-ink">{p.name}</div>
                <div className="text-[12px] text-aya-text capitalize">{p.category}</div>
              </div>
              <span className="w-16 text-center text-xs text-aya-text">{p.duration_min} min</span>
              <span className="w-28 text-right font-display text-[13px] font-semibold text-aya-purple">
                {formatFcfa(p.price_cents)}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  background: p.is_active ? "#E8F8F0" : "#F3F1F6",
                  color: p.is_active ? "#1A8A55" : C.text,
                }}
              >
                {p.is_active ? "Disponible" : "Indisponible"}
              </span>
            </div>
          ))}
        </Card>
      </div>
      {open && (
        <Modal title="Nouvelle prestation" onClose={() => setOpen(false)}>
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <Field label="Nom">
              <Input placeholder="Ex. Lissage brésilien" value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Catégorie">
              <Select value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
                {TABS.filter((t) => t.category).map((t) => (
                  <option key={t.id} value={t.category}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée (min)">
                <Input type="number" min={5} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </Field>
              <Field label="Prix (FCFA)">
                <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
              </Field>
            </div>
            <PrimaryBtn type="submit" full disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
