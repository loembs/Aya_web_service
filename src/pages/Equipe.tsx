import { useState } from "react";
import { TEAM } from "../data";
import { PageHeader, PrimaryBtn, Card, Modal, Field, Input, Select } from "../components";
import { IconPlus } from "../icons";

export default function Equipe({ onAgenda }: { onAgenda: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Équipe"
        subtitle={`${TEAM.length} membres · agendas individuels`}
        action={
          <PrimaryBtn onClick={() => setOpen(true)}>
            <IconPlus size={14} /> Inviter un membre
          </PrimaryBtn>
        }
      />
      <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto px-7 py-5">
        {TEAM.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white" style={{ background: m.color }}>
                {m.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-aya-ink">{m.name}</h3>
                <p className="text-xs text-aya-text">{m.role}</p>
                <p className="mt-1 text-[11px] text-aya-text">{m.hours}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-bold text-aya-purple">{m.rating}</div>
                <div className="text-[10px] text-aya-text">{m.rdv} RDV / mois</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold tracking-wide text-aya-text uppercase">Prestations assignées</div>
              <div className="flex flex-wrap gap-1.5">
                {m.services.map((s) => (
                  <span key={s} className="rounded-full bg-aya-bg px-2.5 py-1 text-[11px] text-aya-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onAgenda()} className="flex-1 rounded-lg bg-aya-bg py-2 font-display text-xs font-semibold text-aya-purple">Voir l'agenda</button>
              <button className="rounded-lg bg-aya-bg px-3 py-2 text-xs font-semibold text-aya-text">Modifier</button>
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
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <Field label="Nom complet">
              <Input placeholder="Ex. Ndeye Seck" />
            </Field>
            <Field label="Rôle">
              <Select>
                <option>Coiffeuse</option>
                <option>Maquilleuse</option>
                <option>Nail artist</option>
                <option>Barbier</option>
                <option>Esthéticienne</option>
                <option>Réception</option>
              </Select>
            </Field>
            <Field label="E-mail d'invitation">
              <Input type="email" placeholder="prenom@studio.sn" />
            </Field>
            <PrimaryBtn type="submit" full>
              Envoyer l'invitation
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
