import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { listServices } from "../api/catalog";
import { createPraticien, listPraticiens } from "../api/team";
import type { PraticienListResponseDTO, ServiceListResponseDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { PageHeader, PrimaryBtn, Card, Modal, Field, Input, Empty } from "../components";
import { IconPlus } from "../icons";

export default function Equipe({ onAgenda }: { onAgenda: () => void }) {
  const { institutId } = useAuth();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<PraticienListResponseDTO[]>([]);
  const [services, setServices] = useState<ServiceListResponseDTO[]>([]);
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!institutId) return;
    setLoading(true);
    Promise.all([listPraticiens(institutId), listServices(institutId)])
      .then(([team, catalog]) => {
        setRows(team);
        setServices(catalog);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "L’équipe n’a pas pu être chargée.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!institutId) return;
    setSaving(true);
    try {
      await createPraticien(institutId, { display_name: name.trim(), service_ids: picked });
      setOpen(false);
      setName("");
      setPicked([]);
      load();
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’invitation n’a pas abouti, réessayez dans un instant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Équipe"
        subtitle={loading ? "Chargement…" : `${rows.length} membres · agendas individuels`}
        action={
          <PrimaryBtn onClick={() => setOpen(true)}>
            <IconPlus size={14} /> Inviter un membre
          </PrimaryBtn>
        }
      />
      <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto px-7 py-5">
        {error && <p className="col-span-2 text-xs text-aya-pink">{error}</p>}
        {loading && <p className="col-span-2 text-center text-xs text-aya-text">Chargement de l’équipe…</p>}
        {!loading && rows.length === 0 && (
          <div className="col-span-2">
            <Empty title="Aucun membre pour l’instant" sub="Invitez une première praticienne pour ouvrir les agendas." />
          </div>
        )}
        {rows.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aya-purple text-sm font-bold text-white">
                {m.display_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-aya-ink">{m.display_name}</h3>
                <p className="text-xs text-aya-text">Praticienne</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold tracking-wide text-aya-text uppercase">Prestations assignées</div>
              <div className="flex flex-wrap gap-1.5">
                {m.service_names.length === 0 && <span className="text-[11px] text-aya-text">Aucune prestation liée</span>}
                {m.service_names.map((s) => (
                  <span key={s} className="rounded-full bg-aya-bg px-2.5 py-1 text-[11px] text-aya-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onAgenda()} className="flex-1 rounded-lg bg-aya-bg py-2 font-display text-xs font-semibold text-aya-purple">
                Voir l'agenda
              </button>
            </div>
          </Card>
        ))}
        <button
          onClick={() => setOpen(true)}
          className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4cce0] bg-white text-sm font-medium text-aya-pink"
        >
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-aya-pink/10">
            <IconPlus size={18} />
          </span>
          Inviter un nouveau membre
        </button>
      </div>
      {open && (
        <Modal title="Inviter un membre" onClose={() => setOpen(false)}>
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <Field label="Nom complet">
              <Input placeholder="Ex. Ndeye Seck" value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Prestations">
              <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-xl border border-[#e6dff0] p-2">
                {services.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-aya-ink">
                    <input
                      type="checkbox"
                      checked={picked.includes(s.id)}
                      onChange={() =>
                        setPicked((prev) => (prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]))
                      }
                    />
                    {s.name}
                  </label>
                ))}
                {services.length === 0 && <span className="text-xs text-aya-text">Ajoutez d’abord des prestations.</span>}
              </div>
            </Field>
            <PrimaryBtn type="submit" full disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
