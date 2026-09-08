import { useEffect, useState } from "react";
import {
  activateTenant,
  confirmApplication,
  createAgencyTenant,
  listAgencyTenants,
  listApplications,
  rejectApplication,
  resendActivation,
  suspendTenant,
} from "../api/onboarding";
import type { AgencyTenantListDTO, ApplicationListDTO } from "../api/dto";
import { ApiError } from "../api/errors";
import { formatDayLabel } from "../api/format";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, Card, Field, Input, Empty, StatusBadge } from "../components";
import { useAuth } from "../auth/AuthContext";

export default function Agency() {
  const { logout, user } = useAuth();
  const [tab, setTab] = useState<"demandes" | "instituts">("demandes");
  const [apps, setApps] = useState<ApplicationListDTO[]>([]);
  const [tenants, setTenants] = useState<AgencyTenantListDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  const load = () => {
    Promise.all([listApplications(), listAgencyTenants()])
      .then(([a, t]) => {
        setApps(a);
        setTenants(t);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Impossible de charger l’espace agence.");
      });
  };

  useEffect(() => {
    load();
  }, []);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      load();
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’action n’a pas abouti, réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    await run(() =>
      createAgencyTenant({
        institut_name: name.trim(),
        contact_name: contact.trim(),
        email: email.trim(),
      }),
    );
    setCreating(false);
    setName("");
    setContact("");
    setEmail("");
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-aya-bg">
      <PageHeader
        title="Espace agence"
        subtitle={user ? `${user.email} · super-admin` : "Tous les instituts"}
        action={
          <div className="flex gap-2">
            <PrimaryBtn onClick={() => setCreating(true)}>Créer un institut</PrimaryBtn>
            <button onClick={logout} className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-aya-text">
              Déconnexion
            </button>
          </div>
        }
      />
      <div className="flex gap-2 px-8 pt-4">
        {(["demandes", "instituts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-full px-3.5 py-1.5 font-display text-xs font-semibold"
            style={{ background: tab === t ? C.pink : "#fff", color: tab === t ? "#fff" : C.text }}
          >
            {t === "demandes" ? "Demandes" : "Instituts"}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {error && <p className="mb-3 text-xs text-aya-pink">{error}</p>}
        {creating && (
          <Card className="mb-4">
            <form className="grid grid-cols-3 gap-3" onSubmit={create}>
              <Field label="Nom de l’institut">
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Contact">
                <Input value={contact} onChange={(e) => setContact(e.target.value)} required />
              </Field>
              <Field label="E-mail">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <div className="col-span-3 flex gap-2">
                <PrimaryBtn type="submit" disabled={busy}>
                  {busy ? "Création…" : "Enregistrer et envoyer le lien"}
                </PrimaryBtn>
                <button type="button" onClick={() => setCreating(false)} className="text-xs text-aya-text">
                  Annuler
                </button>
              </div>
            </form>
          </Card>
        )}
        {tab === "demandes" && (
          <Card className="p-0">
            {apps.length === 0 && <Empty title="Aucune demande" sub="Les formulaires publics apparaîtront ici." />}
            {apps.map((row) => (
              <div key={row.id} className="flex items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[13px] font-semibold text-aya-ink">{row.institut_name}</div>
                  <div className="text-[11px] text-aya-text">
                    {row.contact_name} · {row.email} · {formatDayLabel(row.created_at)}
                  </div>
                </div>
                <StatusBadge
                  status={
                    row.status === "pending"
                      ? "pending"
                      : row.status === "confirmed"
                        ? "confirmed"
                        : "rejected"
                  }
                />
                {row.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => run(() => confirmApplication(row.id))}
                      className="rounded-lg bg-aya-pink px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      Confirmer
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => run(() => rejectApplication(row.id))}
                      className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-text"
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Card>
        )}
        {tab === "instituts" && (
          <Card className="p-0">
            {tenants.length === 0 && <Empty title="Aucun institut" sub="Créez un tenant ou confirmez une demande." />}
            {tenants.map((row) => (
              <div key={row.id} className="flex items-center gap-4 border-b border-[#f6f2fb] px-5 py-3.5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[13px] font-semibold text-aya-ink">{row.name}</div>
                  <div className="text-[11px] text-aya-text">
                    {row.slug} · {row.address || "Adresse non renseignée"}
                  </div>
                </div>
                <StatusBadge status={row.status === "active" ? "confirmed" : "suspended"} />
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    onClick={() => run(() => resendActivation(row.id))}
                    className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-purple"
                  >
                    Renvoyer le lien
                  </button>
                  {row.is_active ? (
                    <button
                      disabled={busy}
                      onClick={() => run(() => suspendTenant(row.id))}
                      className="rounded-lg bg-aya-bg px-3 py-1.5 text-[11px] font-semibold text-aya-text"
                    >
                      Suspendre
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => run(() => activateTenant(row.id))}
                      className="rounded-lg bg-aya-pink px-3 py-1.5 text-[11px] font-semibold text-white"
                    >
                      Réactiver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
