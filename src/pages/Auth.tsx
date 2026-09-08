import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AyaLogo, Field, Input, Select, PrimaryBtn } from "../components";
import { C } from "../theme";
import { IconCheck, IconGoogle } from "../icons";
import { login, requestPasswordReset, verify2fa } from "../api/auth";
import { clearOAuthCallback, completeOAuth, readOAuthCallback, startGoogleOAuth } from "../api/oauth";
import { submitTenantApplication } from "../api/onboarding";
import { ApiError } from "../api/errors";
import { saveTokens } from "../api/session";
import { useAuth } from "../auth/AuthContext";
import { DevTestTotpHint, isDevTestStaff } from "../dev/DevTestTotpHint";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [needOtp, setNeedOtp] = useState(false);
  const [applied, setApplied] = useState(false);
  const [contactName, setContactName] = useState("");
  const [institutName, setInstitutName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const tempTokenRef = useRef<string | null>(null);
  const { applySession } = useAuth();
  const oauthHandled = useRef(false);

  async function applyLoginResult(result: Awaited<ReturnType<typeof completeOAuth>>) {
    if (result.status === "connecté" && result.access_token && result.refresh_token) {
      saveTokens(result.access_token, result.refresh_token);
      await applySession(result.user_profile ?? undefined);
      onEnter();
      return;
    }
    if (!result.temp_token) {
      setAuthError("Connexion incomplète. Réessayez.");
      return;
    }
    tempTokenRef.current = result.temp_token;
    setNeedOtp(true);
  }

  async function onGoogleClick() {
    setAuthError(null);
    setBusy(true);
    try {
      const { url } = await startGoogleOAuth();
      window.location.assign(url);
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : "Google est indisponible pour le moment.");
      setBusy(false);
    }
  }

  useEffect(() => {
    if (oauthHandled.current) return;
    const callback = readOAuthCallback();
    if (!callback) return;
    oauthHandled.current = true;
    if ("error" in callback) {
      clearOAuthCallback();
      setAuthError("La connexion Google a été annulée ou refusée.");
      return;
    }
    setBusy(true);
    void (async () => {
      try {
        const result = await completeOAuth(callback.accessToken, callback.refreshToken);
        clearOAuthCallback();
        await applyLoginResult(result);
      } catch (err) {
        clearOAuthCallback();
        setAuthError(err instanceof ApiError ? err.message : "Connexion Google impossible.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  async function onLoginSubmit(event: FormEvent) {
    event.preventDefault();
    setAuthError(null);
    setBusy(true);
    try {
      const challenge = await login({ email: email.trim(), password });
      await applyLoginResult(challenge);
      setPassword("");
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : "Connexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  async function onOtpSubmit(event: FormEvent) {
    event.preventDefault();
    const tempToken = tempTokenRef.current;
    if (!tempToken) {
      setNeedOtp(false);
      setAuthError("Session 2FA expirée. Recommencez la connexion.");
      return;
    }
    setAuthError(null);
    setBusy(true);
    try {
      const session = await verify2fa({ temp_token: tempToken, code: otp });
      tempTokenRef.current = null;
      setOtp("");
      saveTokens(session.access_token, session.refresh_token);
      await applySession(session.user_profile);
      onEnter();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Code 2FA refusé.");
    } finally {
      setBusy(false);
    }
  }

  if (mode === "login") {
    return (
      <Shell>
        <h1 className="mb-1 font-display text-2xl font-bold text-aya-ink">
          {needOtp ? "Vérification" : "Bon retour"}
        </h1>
        <p className="mb-6 text-sm text-aya-text">
          {needOtp
            ? "Saisissez le code à 6 chiffres de votre application d'authentification."
            : "Connectez-vous à votre espace AYA Pro."}
        </p>
        {needOtp ? (
          <form className="flex flex-col gap-3.5" onSubmit={onOtpSubmit} autoComplete="off">
            <Field label="Code 2FA">
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </Field>
            {isDevTestStaff(email) && <DevTestTotpHint onFill={setOtp} />}
            {authError && (
              <p className="text-xs" style={{ color: C.red }}>
                {authError}
              </p>
            )}
            <PrimaryBtn type="submit" full disabled={busy || otp.length !== 6}>
              {busy ? "Vérification…" : "Valider"}
            </PrimaryBtn>
            <button
              type="button"
              className="text-xs font-medium text-aya-pink"
              onClick={() => {
                tempTokenRef.current = null;
                setNeedOtp(false);
                setOtp("");
                setAuthError(null);
              }}
            >
              Revenir à la connexion
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-3.5" onSubmit={onLoginSubmit} autoComplete="on">
            <GoogleBtn busy={busy} onClick={onGoogleClick} />
            <AuthDivider />
            <Field label="E-mail">
              <Input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Mot de passe">
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {authError && (
              <p className="text-xs" style={{ color: C.red }}>
                {authError}
              </p>
            )}
            <PrimaryBtn type="submit" full disabled={busy}>
              {busy ? "Connexion…" : "Se connecter"}
            </PrimaryBtn>
            <button
              type="button"
              className="text-xs font-medium text-aya-pink"
              disabled={busy || !email.trim()}
              onClick={async () => {
                setAuthError(null);
                setBusy(true);
                try {
                  await requestPasswordReset(email.trim());
                  setResetSent(true);
                } catch (err) {
                  setAuthError(err instanceof ApiError ? err.message : "L’e-mail n’a pas pu partir.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {resetSent ? "E-mail envoyé — regardez votre boîte" : "Recevoir un lien par e-mail"}
            </button>
          </form>
        )}
        {!needOtp && (
        <p className="mt-6 text-center text-sm text-aya-text">
          Pas encore de compte ?{" "}
          <button className="font-semibold text-aya-pink" onClick={() => onMode("signup")}>
            Créer un espace Pro
          </button>
        </p>
        )}
      </Shell>
    );
  }

  if (mode === "signup") {
    return (
      <Shell>
        <h1 className="mb-1 font-display text-2xl font-bold text-aya-ink">Demander un espace Pro</h1>
        <p className="mb-6 text-sm text-aya-text">
          Envoyez votre dossier. Nous confirmons chaque institut avant l’ouverture du compte.
        </p>
        {applied ? (
          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-aya-pink/15 text-aya-pink">
              <IconCheck size={24} />
            </div>
            <p className="font-display text-sm font-semibold text-aya-ink">Demande bien reçue</p>
            <p className="mt-2 text-xs text-aya-text">Nous revenons vers vous par e-mail dès validation.</p>
            <button className="mt-4 text-sm font-semibold text-aya-pink" onClick={() => onMode("login")}>
              Revenir à la connexion
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col gap-3.5"
            onSubmit={async (e) => {
              e.preventDefault();
              setAuthError(null);
              setBusy(true);
              try {
                await submitTenantApplication({
                  institut_name: institutName,
                  contact_name: contactName,
                  email: email.trim(),
                  phone: phone || undefined,
                  address: address || undefined,
                  website: honeypot,
                });
                setApplied(true);
              } catch (err) {
                setAuthError(err instanceof ApiError ? err.message : "La demande n’a pas pu partir, réessayez dans un instant.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <GoogleBtn busy={busy} onClick={onGoogleClick} />
            <AuthDivider />
            <Field label="Votre nom">
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} required />
            </Field>
            <Field label="Nom de l'établissement">
              <Input value={institutName} onChange={(e) => setInstitutName(e.target.value)} required />
            </Field>
            <Field label="E-mail professionnel">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Téléphone">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Adresse">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
            <div aria-hidden className="hidden">
              <Input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>
            {authError && (
              <p className="text-xs" style={{ color: C.red }}>
                {authError}
              </p>
            )}
            <PrimaryBtn type="submit" full disabled={busy}>
              {busy ? "Envoi…" : "Envoyer ma demande"}
            </PrimaryBtn>
          </form>
        )}
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

function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-[11px] text-aya-text">
      <span className="h-px flex-1 bg-[#eeeaf6]" />
      ou
      <span className="h-px flex-1 bg-[#eeeaf6]" />
    </div>
  );
}

function GoogleBtn({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e6e1ef] bg-white px-4 py-2.5 text-sm font-semibold text-aya-ink disabled:opacity-60"
    >
      <IconGoogle size={18} />
      Continuer avec Google
    </button>
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
