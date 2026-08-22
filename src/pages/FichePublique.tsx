import { useState } from "react";
import { PRESTATIONS, fmt } from "../data";
import { C, SHADOW } from "../theme";
import { PageHeader, Card, AyaLogo, Field, Input, Toast } from "../components";
import { IconCopy, IconShare, IconStar, IconMap } from "../icons";

export default function FichePublique() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("Andal Beauty Studio");
  const [desc, setDesc] = useState(
    "Spécialiste en maquillage, coiffure, soins et mise en beauté. Réservez votre moment à Dakar.",
  );
  const [hours, setHours] = useState("Mar–Sam · 09h–18h");
  const link = "aya.app/andalbeautystudio";

  const copy = () => {
    navigator.clipboard?.writeText("https://" + link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Ma fiche publique" subtitle="Ce que voient vos clientes avant de réserver" />
      <div className="grid flex-1 grid-cols-12 gap-6 overflow-y-auto px-7 py-5">
        <div className="col-span-7 flex flex-col gap-4">
          <Card>
            <h3 className="mb-4 font-display text-sm font-bold text-aya-ink">Informations visibles</h3>
            <div className="flex flex-col gap-3">
              <Field label="Nom de l'établissement">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Description">
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="h-24 w-full rounded-xl border border-[#e6dff0] px-3.5 py-2.5 text-sm outline-none focus:border-aya-pink"
                />
              </Field>
              <Field label="Horaires affichés">
                <Input value={hours} onChange={(e) => setHours(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-2 font-display text-sm font-bold text-aya-ink">Prestations affichées</h3>
            <p className="mb-3 text-xs text-aya-text">Les services marqués disponibles apparaissent sur votre fiche.</p>
            <div className="space-y-2">
              {PRESTATIONS.filter((p) => p.available).slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-aya-bg px-3 py-2">
                  <img src={p.img} alt="" className="h-9 w-9 rounded-lg object-cover" />
                  <div className="flex-1 text-[13px] font-medium text-aya-ink">{p.name}</div>
                  <div className="text-xs text-aya-text">{p.duration}</div>
                  <div className="text-xs font-semibold text-aya-purple">{fmt(p.price)}</div>
                </div>
              ))}
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
            <PhonePreview name={name} desc={desc} hours={hours} />
          </div>
        </div>
      </div>
      {copied && <Toast text="Lien copié — prêt à coller sur WhatsApp" />}
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

function PhonePreview({ name, desc, hours }: { name: string; desc: string; hours: string }) {
  return (
    <div className="w-[300px] overflow-hidden rounded-[36px] border-[10px] border-[#1a1030] bg-white shadow-2xl">
      <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-[#1a1030]" />
      <div className="h-[560px] overflow-y-auto bg-[#F5F3F8]">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=280&fit=crop"
          alt=""
          className="h-36 w-full object-cover"
        />
        <div className="-mt-6 px-4">
          <div className="flex items-end gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-aya-purple">
              <AyaLogo width={52} />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-aya-pink">
                <IconStar size={12} /> 4,9 · 126 avis
              </div>
            </div>
          </div>
          <h2 className="mt-2 font-display text-lg font-bold text-aya-ink">{name}</h2>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-aya-text">
            <IconMap size={12} /> Almadies, Dakar · {hours}
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-aya-text">{desc}</p>
          <button className="mt-3 w-full rounded-xl bg-aya-pink py-2.5 font-display text-[13px] font-bold text-white">
            Réserver maintenant
          </button>
          <div className="mt-4 space-y-2 pb-6">
            {PRESTATIONS.filter((p) => p.available).slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-xl bg-white p-2.5">
                <img src={p.img} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold text-aya-ink">{p.name}</div>
                  <div className="text-[10px] text-aya-text">
                    {p.duration} · {fmt(p.price)}
                  </div>
                </div>
                <span className="rounded-md border border-aya-pink px-2 py-1 text-[10px] font-semibold text-aya-pink">
                  Réserver
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
