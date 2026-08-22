import { useState } from "react";
import { CAMPAIGNS, fmt } from "../data";
import { PageHeader, PrimaryBtn, Card, StatusBadge, Modal, Field, Input, Select, KpiCard } from "../components";
import { IconPlus, IconMegaphone, IconUsers, IconChart } from "../icons";

export default function Marketing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Marketing"
        subtitle="Offres, campagnes et performance"
        action={
          <PrimaryBtn onClick={() => setOpen(true)}>
            <IconPlus size={14} /> Nouvelle campagne
          </PrimaryBtn>
        }
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <div className="flex gap-4">
          <KpiCard label="Réservations via campagnes" value="29" sub="ce mois-ci" icon={<IconMegaphone size={18} />} accent />
          <KpiCard label="Portée totale" value="1 326" sub="Instagram, WhatsApp, AYA" icon={<IconUsers size={18} />} />
          <KpiCard label="CA attribué" value={fmt(660000)} sub="+22% vs avril" icon={<IconChart size={18} />} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {CAMPAIGNS.map((k) => (
            <Card key={k.id}>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-bold text-aya-ink">{k.title}</h3>
                  <p className="text-xs text-aya-text">
                    {k.channel} · {k.period}
                  </p>
                </div>
                <StatusBadge status={k.status} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Mini n={k.reach.toLocaleString("fr-FR")} l="Portée" />
                <Mini n={String(k.bookings)} l="RDV" />
                <Mini n={k.revenue ? fmt(k.revenue) : "—"} l="CA" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      {open && (
        <Modal title="Nouvelle campagne" onClose={() => setOpen(false)}>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <Field label="Titre de l'offre">
              <Input placeholder="Ex. Soft Glam -15% ce week-end" />
            </Field>
            <Field label="Canal">
              <Select>
                <option>WhatsApp</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>Marketplace AYA</option>
                <option>SMS</option>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Début">
                <Input type="date" defaultValue="2025-05-26" />
              </Field>
              <Field label="Fin">
                <Input type="date" defaultValue="2025-05-31" />
              </Field>
            </div>
            <PrimaryBtn type="submit" full>
              Créer la campagne
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Mini({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-xl bg-aya-bg p-2.5">
      <div className="font-display text-sm font-bold text-aya-ink">{n}</div>
      <div className="text-[10px] text-aya-text">{l}</div>
    </div>
  );
}
