import { useState } from "react";
import type { ReactNode } from "react";
import { AyaLogo, Field, Input, Select, PrimaryBtn } from "../components";
import { C } from "../theme";
import { IconCheck } from "../icons";

const STEPS = [
  { id: 1, title: "Votre établissement", sub: "Qui êtes-vous ?" },
  { id: 2, title: "Prestations", sub: "Ce que vous proposez" },
  { id: 3, title: "Horaires", sub: "Quand vous recevez" },
  { id: 4, title: "Équipe", sub: "Qui travaille avec vous" },
  { id: 5, title: "Votre lien", sub: "Prêt à recevoir des RDV" },
];

const CATS = ["Salon de coiffure", "Institut de beauté", "Barbier", "Nail artist", "Maquilleuse", "Spa", "Indépendant·e"];
const CITIES = ["Dakar", "Thiès", "Saint-Louis", "Mbour", "Ziguinchor", "Kaolack"];
const PRESET = ["Maquillage Soft Glam", "Pose perruque", "Brushing", "Tresses", "Soin du visage", "Pose gel", "Nail art", "Taille + Barbe"];

export default function Auth({
  mode,
  onMode,
  onEnter,
}: {
  mode: "login" | "signup" | "onboarding";
  onMode: (m: "login" | "signup" | "onboarding") => void;
  onEnter: () => void;
}) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>(["Maquillage Soft Glam", "Pose perruque"]);
  const [copied, setCopied] = useState(false);

  if (mode === "login") {
    return (
      <Shell>
        <h1 className="mb-1 font-display text-2xl font-bold text-aya-ink">Bon retour</h1>
        <p className="mb-6 text-sm text-aya-text">Connectez-vous à votre espace AYA Pro.</p>
        <form
          className="flex flex-col gap-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            onEnter();
          }}
        >
          <Field label="E-mail">
            <Input type="email" defaultValue="mourzane@andalbeauty.sn" />
          </Field>
          <Field label="Mot de passe">
            <Input type="password" defaultValue="••••••••" />
          </Field>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-aya-text">
              <input type="checkbox" defaultChecked className="accent-[#E64F92]" /> Se souvenir de moi
            </label>
            <button type="button" className="font-medium text-aya-pink">
              Mot de passe oublié ?
            </button>
          </div>
          <PrimaryBtn type="submit" full>
            Se connecter
          </PrimaryBtn>
        </form>
        <p className="mt-6 text-center text-sm text-aya-text">
          Pas encore de compte ?{" "}
          <button className="font-semibold text-aya-pink" onClick={() => onMode("signup")}>
            Créer un espace Pro
          </button>
        </p>
      </Shell>
    );
  }

  if (mode === "signup") {
    return (
      <Shell>
        <h1 className="mb-1 font-display text-2xl font-bold text-aya-ink">Créer votre espace Pro</h1>
        <p className="mb-6 text-sm text-aya-text">Gratuit pour démarrer. Aucune carte requise.</p>
        <form
          className="flex flex-col gap-3.5"
          onSubmit={(e) => {
            e.preventDefault();
            onMode("onboarding");
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <Input defaultValue="Mourzane" />
            </Field>
            <Field label="Nom">
              <Input defaultValue="Ouédraogo" />
            </Field>
          </div>
          <Field label="Nom de l'établissement">
            <Input defaultValue="Andal Beauty Studio" />
          </Field>
          <Field label="Catégorie">
            <Select defaultValue="Institut de beauté">
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville">
              <Select defaultValue="Dakar">
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Quartier">
              <Input defaultValue="Almadies" />
            </Field>
          </div>
          <Field label="E-mail professionnel">
            <Input type="email" defaultValue="mourzane@andalbeauty.sn" />
          </Field>
          <Field label="Mot de passe">
            <Input type="password" defaultValue="••••••••" />
          </Field>
          <PrimaryBtn type="submit" full>
            Continuer la configuration
          </PrimaryBtn>
        </form>
        <p className="mt-6 text-center text-sm text-aya-text">
          Déjà inscrit·e ?{" "}
          <button className="font-semibold text-aya-pink" onClick={() => onMode("login")}>
            Se connecter
          </button>
        </p>
      </Shell>
    );
  }

  const current = STEPS[step - 1];

  return (
    <div className="flex min-h-screen bg-aya-bg">
      <aside className="hidden w-[340px] shrink-0 flex-col justify-between p-10 lg:flex" style={{ background: C.purple }}>
        <div>
          <AyaLogo width={168} />
          <div className="mt-1 text-xs font-semibold tracking-[0.22em] text-aya-cream">PRO</div>
          <h2 className="mt-10 font-display text-2xl font-bold leading-snug text-aya-cream">
            Configurez votre salon en quelques minutes.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-aya-cream/65">
            À la fin, vous obtenez un lien unique à partager sur WhatsApp, Instagram et TikTok.
          </p>
        </div>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: s.id < step ? C.pink : s.id === step ? C.cream : "rgba(253,241,229,0.12)",
                  color: s.id < step ? "#fff" : s.id === step ? C.purple : "rgba(253,241,229,0.5)",
                }}
              >
                {s.id < step ? "✓" : s.id}
              </div>
              <span className="text-sm" style={{ color: s.id <= step ? C.cream : "rgba(253,241,229,0.4)" }}>
                {s.title}
              </span>
            </li>
          ))}
        </ol>
      </aside>

      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-[520px]">
          <div className="mb-6 text-[13px] font-medium text-aya-text">
            Étape {step} sur {STEPS.length} · {current.sub}
          </div>
          <h1 className="mb-6 font-display text-2xl font-bold text-aya-ink">{current.title}</h1>

          {step === 1 && (
            <div className="flex flex-col gap-3.5">
              <Field label="Description courte">
                <textarea
                  defaultValue="Spécialiste en maquillage, coiffure, soins et mise en beauté à Dakar."
                  className="h-24 w-full rounded-xl border border-[#e6dff0] px-3.5 py-2.5 text-sm outline-none focus:border-aya-pink"
                />
              </Field>
              <Field label="Téléphone WhatsApp">
                <Input defaultValue="+221 77 000 00 00" />
              </Field>
              <Field label="Adresse">
                <Input defaultValue="Route des Almadies, Dakar" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-4 text-sm text-aya-text">Sélectionnez vos prestations de départ — vous pourrez tout modifier ensuite.</p>
              <div className="flex flex-wrap gap-2">
                {PRESET.map((p) => {
                  const on = selected.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => setSelected(on ? selected.filter((x) => x !== p) : [...selected, p])}
                      className="rounded-full px-3.5 py-1.5 font-display text-xs font-semibold"
                      style={{
                        background: on ? C.pink : "#fff",
                        color: on ? "#fff" : C.purple,
                        border: on ? "none" : "1px solid #e6dff0",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 2px 12px rgba(60,33,100,0.07)" }}>
              {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((d, i) => (
                <div key={d} className="flex items-center justify-between border-b border-[#f3eef8] px-4 py-3 last:border-0">
                  <span className="text-sm font-medium text-aya-ink">{d}</span>
                  {i === 6 ? (
                    <span className="text-xs text-aya-text">Fermé</span>
                  ) : (
                    <span className="text-xs text-aya-text">09:00 — 18:00</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {["Mourzane O. · Propriétaire", "Awa Ndiaye · Coiffeuse", "Khady Fall · Nail artist"].map((m) => (
                <div key={m} className="flex items-center justify-between rounded-xl bg-white px-4 py-3" style={{ boxShadow: "0 2px 12px rgba(60,33,100,0.07)" }}>
                  <span className="text-sm font-medium text-aya-ink">{m}</span>
                  <span className="text-xs text-aya-green">Ajouté</span>
                </div>
              ))}
              <button className="w-full rounded-xl border border-dashed border-[#d4cce0] py-3 text-sm font-medium text-aya-pink">
                + Inviter un membre
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="rounded-2xl bg-white p-6 text-center" style={{ boxShadow: "0 2px 12px rgba(60,33,100,0.07)" }}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aya-pink/15 text-aya-pink">
                <IconCheck size={28} />
              </div>
              <h2 className="font-display text-lg font-bold text-aya-ink">Votre fiche est en ligne</h2>
              <p className="mt-1 text-sm text-aya-text">Partagez ce lien à vos clientes dès maintenant.</p>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-aya-bg px-3 py-2.5">
                <span className="flex-1 text-left text-sm font-medium text-aya-purple">aya.app/andalbeautystudio</span>
                <button
                  className="rounded-lg bg-aya-purple px-3 py-1.5 text-xs font-semibold text-aya-cream"
                  onClick={() => {
                    navigator.clipboard?.writeText("https://aya.app/andalbeautystudio");
                    setCopied(true);
                  }}
                >
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-[10px] bg-white px-5 py-2.5 font-display text-[13px] font-semibold text-aya-text"
              >
                Retour
              </button>
            )}
            <PrimaryBtn
              full
              onClick={() => {
                if (step < 5) setStep(step + 1);
                else onEnter();
              }}
            >
              {step === 5 ? "Entrer dans AYA Pro" : "Continuer"}
            </PrimaryBtn>
          </div>
        </div>
      </main>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden p-12 lg:flex" style={{ background: C.purple }}>
        <div>
          <AyaLogo width={200} />
          <div className="mt-1 text-xs font-semibold tracking-[0.22em] text-aya-cream">PRO</div>
        </div>
        <div>
          <h2 className="max-w-sm font-display text-3xl font-bold leading-snug text-aya-cream">
            L'espace des professionnels de la beauté au Sénégal.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-aya-cream/70">
            Agenda, clientes, prestations, paiements et lien de réservation unique — pensé pour les salons, instituts et indépendant·e·s de Dakar.
          </p>
        </div>
        <div className="text-xs text-aya-cream/40">© 2026 AYA · Dakar</div>
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-aya-pink/20 blur-3xl" />
      </aside>
      <main className="flex flex-1 items-center justify-center bg-aya-bg p-8">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
    </div>
  );
}
