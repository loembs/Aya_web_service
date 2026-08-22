import { useState } from "react";
import { PLANS } from "../data";
import { C } from "../theme";
import { PageHeader, Card, Field, Input, PrimaryBtn } from "../components";
import { IconCheck, IconCrown, IconLogout } from "../icons";

export default function Parametres({
  initialTab = "general",
  onLogout,
}: {
  initialTab?: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState(initialTab);

  const tabs = [
    { id: "general", label: "Établissement" },
    { id: "hours", label: "Horaires" },
    { id: "notif", label: "Notifications" },
    { id: "pay", label: "Paiements" },
    { id: "plan", label: "Abonnement" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Paramètres"
        subtitle="Andal Beauty Studio"
        action={
          <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg bg-aya-bg px-3 py-2 text-xs font-semibold text-aya-text">
            <IconLogout size={14} /> Déconnexion
          </button>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 shrink-0 border-r border-[#ede8f5] bg-white p-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="mb-1 w-full rounded-xl px-3 py-2.5 text-left font-display text-[13px] font-medium"
              style={{
                background: tab === t.id ? C.cream : "transparent",
                color: tab === t.id ? C.purple : C.text,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {tab === "general" && (
            <Card className="max-w-xl">
              <h3 className="mb-4 font-display text-sm font-bold">Informations de l'établissement</h3>
              <div className="flex flex-col gap-3">
                <Field label="Nom">
                  <Input defaultValue="Andal Beauty Studio" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ville">
                    <Input defaultValue="Dakar" />
                  </Field>
                  <Field label="Quartier">
                    <Input defaultValue="Almadies" />
                  </Field>
                </div>
                <Field label="Adresse">
                  <Input defaultValue="Route des Almadies, Dakar" />
                </Field>
                <Field label="WhatsApp">
                  <Input defaultValue="+221 77 000 00 00" />
                </Field>
                <PrimaryBtn>Enregistrer</PrimaryBtn>
              </div>
            </Card>
          )}

          {tab === "hours" && (
            <Card className="max-w-xl p-0">
              {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((d, i) => (
                <div key={d} className="flex items-center justify-between border-b border-[#f3eef8] px-5 py-3.5 last:border-0">
                  <span className="text-sm font-medium">{d}</span>
                  {i === 6 ? (
                    <span className="text-xs text-aya-text">Fermé</span>
                  ) : (
                    <span className="text-sm text-aya-ink">09:00 — 18:00</span>
                  )}
                </div>
              ))}
            </Card>
          )}

          {tab === "notif" && (
            <Card className="max-w-xl">
              {[
                ["Nouveau rendez-vous", true],
                ["Annulation cliente", true],
                ["Paiement reçu", true],
                ["Relance automatique envoyée", false],
                ["Récap quotidien par e-mail", true],
              ].map(([label, on]) => (
                <div key={String(label)} className="flex items-center justify-between border-b border-[#f3eef8] py-3 last:border-0">
                  <span className="text-sm">{label as string}</span>
                  <div className="h-5 w-9 rounded-full p-0.5" style={{ background: on ? C.pink : "#d4cce0" }}>
                    <div className="h-4 w-4 rounded-full bg-white" style={{ marginLeft: on ? 14 : 0 }} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          {tab === "pay" && (
            <Card className="max-w-xl">
              <h3 className="mb-3 font-display text-sm font-bold">Moyens de paiement acceptés</h3>
              {["Wave", "Orange Money", "Carte bancaire", "Espèces", "Acompte en ligne"].map((m, i) => (
                <div key={m} className="flex items-center justify-between border-b border-[#f3eef8] py-3 last:border-0">
                  <span className="text-sm">{m}</span>
                  <div className="h-5 w-9 rounded-full p-0.5" style={{ background: i < 4 ? C.pink : "#d4cce0" }}>
                    <div className="h-4 w-4 rounded-full bg-white" style={{ marginLeft: i < 4 ? 14 : 0 }} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          {tab === "plan" && (
            <div>
              <div className="mb-5 flex items-center gap-2">
                <IconCrown size={18} />
                <h3 className="font-display text-lg font-bold text-aya-ink">Choisissez votre plan</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {PLANS.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-white p-5"
                    style={{
                      boxShadow: "0 2px 12px rgba(60,33,100,0.07)",
                      border: p.current ? `2px solid ${C.pink}` : "2px solid transparent",
                      background: p.current ? C.cream : "#fff",
                    }}
                  >
                    <div className="text-[11px] font-bold tracking-wide text-aya-pink uppercase">{p.tagline}</div>
                    <h4 className="mt-1 font-display text-lg font-bold text-aya-ink">{p.name}</h4>
                    <div className="mt-2 font-display text-3xl font-extrabold text-aya-purple">
                      {p.price}
                      <span className="ml-1 text-sm font-medium text-aya-text">{p.price === "0" ? "FCFA" : "FCFA"} {p.period}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[13px] text-aya-ink">
                          <span className="mt-0.5 text-aya-pink">
                            <IconCheck size={14} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="mt-5 w-full rounded-xl py-2.5 font-display text-[13px] font-semibold"
                      style={{
                        background: p.current ? C.purple : C.pink,
                        color: "#fff",
                      }}
                    >
                      {p.current ? "Plan actuel" : p.id === "starter" ? "Rétrograder" : "Passer en Premium"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
