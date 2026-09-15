import { useState, type FormEvent } from "react";
import { AyaLogo, Field, Input, PrimaryBtn } from "../components";
import { C } from "../theme";
import { activatePassword } from "../api/onboarding";
import { ApiError } from "../api/errors";
import { saveTokens } from "../api/session";
import { useAuth } from "../auth/AuthContext";

export default function Activate({
  token,
  onDone,
  onCancel,
}: {
  token: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const { applySession } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const session = await activatePassword(token, password);
      saveTokens(session.access_token, session.refresh_token);
      try {
        await applySession();
      } catch {
        // Mot de passe posé : on laisse la page de connexion reprendre.
      }
      setOk(true);
      setTimeout(onDone, 900);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Le lien n’est plus valable. Demandez un nouvel e-mail.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-aya-bg p-8">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8" style={{ boxShadow: "0 2px 16px rgba(60,33,100,0.08)" }}>
        <AyaLogo width={72} />
        <h1 className="mt-6 font-display text-2xl font-bold text-aya-ink">Choisissez votre mot de passe</h1>
        <p className="mt-2 text-sm text-aya-text">
          C’est une étape obligatoire avant d’accéder à votre institut. Le lien est à usage unique.
        </p>
        {ok ? (
          <p className="mt-6 text-center font-display text-sm font-semibold text-aya-purple">Mot de passe enregistré</p>
        ) : (
          <form className="mt-6 flex flex-col gap-3.5" onSubmit={submit}>
            <Field label="Nouveau mot de passe">
              <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </Field>
            <Field label="Confirmer">
              <Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required />
            </Field>
            {error && (
              <p className="text-xs" style={{ color: C.red }}>
                {error}
              </p>
            )}
            <PrimaryBtn type="submit" full disabled={busy}>
              {busy ? "Enregistrement…" : "Activer mon espace"}
            </PrimaryBtn>
            <button type="button" className="text-xs font-medium text-aya-pink" onClick={onCancel}>
              Aller à la connexion
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
