import { useState } from "react";
import { PRESTATIONS, fmt } from "../data";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, Card, Modal, Field, Input, Select } from "../components";
import { IconPlus, IconMore } from "../icons";

const TABS = ["Toutes", "Maquillage", "Coiffure", "Onglerie", "Soins", "Autres"];

export default function Prestations() {
  const [tab, setTab] = useState("Toutes");
  const [open, setOpen] = useState(false);
  const rows = PRESTATIONS.filter((p) => tab === "Toutes" || p.cat === tab);

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
              key={t}
              onClick={() => setTab(t)}
              className="rounded-full px-3.5 py-1.5 font-display text-xs font-semibold"
              style={{ background: tab === t ? C.pink : "#fff", color: tab === t ? "#fff" : C.text }}
            >
              {t}
            </button>
          ))}
        </div>
        <Card className="p-0">
          {rows.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
              <img src={p.img} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-[13px] font-semibold text-aya-ink">{p.name}</div>
                <div className="text-[12px] text-aya-text">{p.desc}</div>
              </div>
              <span className="rounded-full bg-aya-bg px-2.5 py-0.5 text-[11px] text-aya-text">{p.cat}</span>
              <span className="w-16 text-center text-xs text-aya-text">{p.duration}</span>
              <span className="w-28 text-right font-display text-[13px] font-semibold text-aya-purple">{fmt(p.price)}</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  background: p.available ? "#E8F8F0" : "#F3F1F6",
                  color: p.available ? "#1A8A55" : C.text,
                }}
              >
                {p.available ? "Disponible" : "Indisponible"}
              </span>
              <button className="text-aya-text">
                <IconMore size={16} />
              </button>
            </div>
          ))}
        </Card>
      </div>
      {open && (
        <Modal title="Nouvelle prestation" onClose={() => setOpen(false)}>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <Field label="Nom">
              <Input placeholder="Ex. Lissage brésilien" />
            </Field>
            <Field label="Catégorie">
              <Select>
                {TABS.filter((t) => t !== "Toutes").map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée">
                <Input defaultValue="1h00" />
              </Field>
              <Field label="Prix (FCFA)">
                <Input type="number" defaultValue="20000" />
              </Field>
            </div>
            <PrimaryBtn type="submit" full>
              Enregistrer
            </PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
}
