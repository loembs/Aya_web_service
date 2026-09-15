import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { fetchInstitut, updateInstitut } from "../api/institut";
import { listServices } from "../api/catalog";
import { formatFcfa } from "../api/format";
import type { InstitutAdminResponseDTO, ServiceListResponseDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { C, SHADOW } from "../theme";
import { PageHeader, Card, AyaLogo, Field, Input, Toast, PrimaryBtn } from "../components";
import { IconCopy, IconShare, IconStar, IconMap } from "../icons";

export default function FichePublique() {
  const { institutId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [fiche, setFiche] = useState<InstitutAdminResponseDTO | null>(null);
  const [services, setServices] = useState<ServiceListResponseDTO[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("09:00–18:00");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const link = fiche ? `aya.app/${fiche.id.slice(0, 8)}` : "aya.app/institut";

  useEffect(() => {
    if (!institutId) return;
    let cancelled = false;
    Promise.all([fetchInstitut(institutId), listServices(institutId)])
      .then(([info, catalog]) => {
        if (cancelled) return;
        setFiche(info);
        setName(info.name);
        setDesc(info.description ?? "");
        setAddress(info.address ?? "");
        const monday = info.opening_hours?.monday;
        if (monday?.open && monday.close) setHours(`${monday.open}–${monday.close}`);
        setServices(catalog.filter((s) => s.is_active));
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "La fiche n’a pas pu être chargée.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [institutId]);

  const copy = () => {
    navigator.clipboard?.writeText("https://" + link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const save = async () => {
    if (!institutId) return;
    setSaving(true);
    try {
      const [open, close] = hours.split("–").map((part) => part.trim());
      const updated = await updateInstitut(institutId, {
        name: name.trim(),
        description: desc,
        address,
        opening_hours:
          open && close
            ? {
                monday: { open, close },
                tuesday: { open, close },
                wednesday: { open, close },
                thursday: { open, close },
                friday: { open, close },
                saturday: { open, close },
              }
            : undefined,
      });
      setFiche(updated);
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 1800);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "La fiche n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Ma fiche publique"
        subtitle="Ce que voient vos clientes avant de réserver"
        action={
          <PrimaryBtn onClick={save} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </PrimaryBtn>
        }
      />
      <div className="grid flex-1 grid-cols-12 gap-6 overflow-y-auto px-7 py-5">
        <div className="col-span-7 flex flex-col gap-4">
          {error && <p className="text-xs text-aya-pink">{error}</p>}
          <Card>
            <h3 className="mb-4 font-display text-sm font-bold text-aya-ink">Informations visibles</h3>
            <div className="flex flex-col gap-3">
              <Field label="Nom de l'établissement">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Adresse">
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </Field>
              <Field label="Description">
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="h-24 w-full rounded-xl border border-[#e6dff0] px-3.5 py-2.5 text-sm outline-none focus:border-aya-pink"
                />
              </Field>
              <Field label="Horaires affichés (HH:MM–HH:MM)">
                <Input value={hours} onChange={(e) => setHours(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-2 font-display text-sm font-bold text-aya-ink">Prestations affichées</h3>
            <p className="mb-3 text-xs text-aya-text">Les services actifs apparaissent sur votre fiche.</p>
            <div className="space-y-2">
              {services.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-aya-bg px-3 py-2">
                  <div className="h-9 w-9 rounded-lg bg-aya-pink/10" />
                  <div className="flex-1 text-[13px] font-medium text-aya-ink">{p.name}</div>
                  <div className="text-xs text-aya-text">{p.duration_min} min</div>
                  <div className="text-xs font-semibold text-aya-purple">{formatFcfa(p.price_cents)}</div>
                </div>
              ))}
              {services.length === 0 && <p className="text-xs text-aya-text">Aucune prestation active.</p>}
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-sm font-bold text-aya-ink">Lien unique & QR code</h3>
            <div className="flex items-start gap-5">
              <QrCode />
              <div className="flex-1">
                <p className="mb-2 text-xs text-aya-text">
                  Partagez ce lien sur WhatsApp, Instagram, TikTok ou imprimez le QR en vitrine.
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-aya-bg px-3 py-2.5">
                  <span className="flex-1 text-sm font-medium text-aya-purple">{link}</span>
                  <button onClick={copy} className="rounded-lg bg-aya-purple p-2 text-aya-cream" title="Copier">
                    <IconCopy size={14} />
                  </button>
                  <button onClick={copy} className="rounded-lg bg-aya-pink p-2 text-white" title="Partager">
                    <IconShare size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-5 flex justify-center">
          <div className="sticky top-0">
            <div className="mb-2 text-center text-[11px] font-semibold tracking-wide text-aya-text uppercase">Aperçu cliente</div>
            <PhonePreview name={name || "Votre institut"} desc={desc} hours={hours} address={address} services={services} />
          </div>
        </div>
      </div>
      {copied && <Toast text="Lien copié — prêt à coller sur WhatsApp" />}
      {saved && <Toast text="Fiche enregistrée" />}
    </div>
  );
}

function QrCode() {
  const cells = 17;
  const bits: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const r = i % cells;
    const c = Math.floor(i / cells);
    const finder = (r < 5 && c < 5) || (r < 5 && c > cells - 6) || (r > cells - 6 && c < 5);
    bits.push(finder ? (r === 0 || c === 0 || r === 4 || c === 4 || (r > 1 && r < 3 && c > 1 && c < 3) || (r > cells - 5 && (c === 0 || c === 4))) : ((r * 7 + c * 13) % 5 !== 0));
  }
  return (
    <div className="rounded-2xl bg-white p-3" style={{ boxShadow: SHADOW, border: `2px solid ${C.purple}` }}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cells}, 7px)`, gap: 1 }}>
        {bits.map((on, i) => (
          <div key={i} style={{ width: 7, height: 7, background: on ? C.purple : C.cream }} />
        ))}
      </div>
    </div>
  );
}

function PhonePreview({
  name,
  desc,
  hours,
  address,
  services,
}: {
  name: string;
  desc: string;
  hours: string;
  address: string;
  services: ServiceListResponseDTO[];
}) {
  return (
    <div className="w-[300px] overflow-hidden rounded-[36px] border-[10px] border-[#1a1030] bg-white shadow-2xl">
      <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-[#1a1030]" />
      <div className="h-[560px] overflow-y-auto bg-[#F5F3F8]">
        <div className="h-36 w-full bg-aya-purple" />
        <div className="-mt-6 px-4">
          <div className="flex items-end gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-aya-purple">
              <AyaLogo width={48} compact className="rounded-none" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-aya-pink">
                <IconStar size={12} /> Votre fiche AYA
              </div>
            </div>
          </div>
          <h2 className="mt-2 font-display text-lg font-bold text-aya-ink">{name}</h2>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-aya-text">
            <IconMap size={12} /> {address || "Adresse à renseigner"} · {hours}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-aya-text">{desc || "Présentez votre institut en quelques lignes."}</p>
          <button className="mt-3 w-full rounded-xl bg-aya-pink py-2.5 font-display text-[13px] font-bold text-white">
            Réserver maintenant
          </button>
          <div className="mt-4 space-y-2 pb-6">
            {services.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-xl bg-white p-2.5">
                <div className="h-10 w-10 rounded-lg bg-aya-pink/10" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold text-aya-ink">{p.name}</div>
                  <div className="text-[10px] text-aya-text">
                    {p.duration_min} min · {formatFcfa(p.price_cents)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
