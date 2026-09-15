import { useEffect, useState, type FormEvent, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { C, SHADOW } from "./theme";
import { AVATAR_COLORS } from "./data";
import type { Status } from "./data";
import { useAuth } from "./auth/AuthContext";
import { createBooking } from "./api/bookings";
import { createClient, listClients } from "./api/clients";
import { listServices } from "./api/catalog";
import { listPraticiens } from "./api/team";
import { ApiError } from "./api/errors";
import type { ClientListResponseDTO, PraticienListResponseDTO, ServiceListResponseDTO } from "./api/dto";

export const AYA_LOGO_URL =
  "https://res.cloudinary.com/dprbhsvxl/image/upload/v1787358731/WhatsApp_Image_2026-08-18_at_13.19.55_v4tlpn.jpg";

export function AyaLogo({
  width = 160,
  className = "",
  compact = false,
}: {
  width?: number;
  className?: string;
  compact?: boolean;
}) {
  const height = compact ? width : Math.round(width * 0.4);
  const zoom = compact ? 2.35 : 2.5;
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ${className}`}
      style={{ width, height }}
      role="img"
      aria-label="AYA"
    >
      <img
        src={AYA_LOGO_URL}
        alt="AYA"
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
        style={{
          width: width * zoom,
          height: width * zoom,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  const bg = AVATAR_COLORS[initials] || "#e0d8ec";
  const color = initials === "MO" ? "#fff" : C.purple;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.32,
        color,
      }}
    >
      {initials}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    confirmed: { label: "Confirmé", bg: C.greenBg, color: C.green },
    pending: { label: "En attente", bg: C.orangeBg, color: C.orange },
    cancelled: { label: "Annulé", bg: C.redBg, color: C.red },
    completed: { label: "Terminé", bg: "#EEEAF6", color: C.purple },
    paid: { label: "Payé", bg: C.greenBg, color: C.green },
    active: { label: "En cours", bg: C.greenBg, color: C.green },
    scheduled: { label: "Planifiée", bg: "#EEEAF6", color: C.purple },
    ended: { label: "Terminée", bg: "#F3F1F6", color: C.text },
    draft: { label: "Brouillon", bg: C.orangeBg, color: C.orange },
    rejected: { label: "Rejetée", bg: C.redBg, color: C.red },
    suspended: { label: "Suspendu", bg: C.redBg, color: C.red },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 font-medium"
      style={{ background: s.bg, color: s.color, fontSize: 11 }}
    >
      {s.label}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
  subColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  accent?: boolean;
  subColor?: string;
}) {
  return (
    <div
      className="min-w-0 flex-1 rounded-2xl border border-[#eee8f4] bg-white p-5 transition-shadow hover:shadow-[0_8px_28px_rgba(60,33,100,0.08)]"
      style={{ boxShadow: SHADOW }}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="font-display text-[12px] font-medium tracking-wide text-aya-text">{label}</span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: accent ? `${C.pink}16` : `${C.purple}10`, color: accent ? C.pink : C.purple }}
        >
          {icon}
        </div>
      </div>
      <div className="mb-1.5 font-display text-[25px] font-bold leading-none tracking-tight text-aya-ink">{value}</div>
      <div className="text-[12px] font-medium" style={{ color: subColor ?? C.green }}>
        {sub}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#eee8f4] bg-white p-5 ${className}`} style={{ boxShadow: SHADOW }}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[#efeaf6] bg-white/90 px-8 py-4 backdrop-blur-md">
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-aya-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-aya-text">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  type = "button",
  full,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-aya-pink px-4 py-2.5 font-display text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(230,79,146,0.28)] transition hover:bg-[#d64384] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

export function PurpleBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg bg-aya-purple px-3 py-1.5 font-display text-[11px] font-semibold text-aya-cream transition hover:brightness-110"
    >
      {children}
    </button>
  );
}

export function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-transparent bg-aya-bg px-3 py-2.5 transition focus-within:border-aya-pink/40 focus-within:bg-white">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8" aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] text-aya-ink outline-none placeholder:text-aya-text"
      />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-xs font-medium text-aya-ink">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[#e6dff0] bg-white px-3.5 py-2.5 text-sm text-aya-ink outline-none transition placeholder:text-aya-text focus:border-aya-pink focus:ring-4 focus:ring-aya-pink/10 ${props.className || ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-[#e6dff0] bg-white px-3.5 py-2.5 text-sm text-aya-ink outline-none focus:border-aya-pink focus:ring-4 focus:ring-aya-pink/10 ${props.className || ""}`}
    />
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,16,48,0.48)] p-6 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] overflow-y-auto rounded-[22px] bg-white p-6"
        style={{ width: wide ? 720 : 460, boxShadow: "0 24px 64px rgba(60,33,100,0.22)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-title" className="font-display text-lg font-bold text-aya-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-aya-bg text-aya-text hover:text-aya-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function NewRdvForm({ onClose }: { onClose: () => void }) {
  const { institutId } = useAuth();
  const [clients, setClients] = useState<ClientListResponseDTO[]>([]);
  const [services, setServices] = useState<ServiceListResponseDTO[]>([]);
  const [praticiens, setPraticiens] = useState<PraticienListResponseDTO[]>([]);
  const [clientId, setClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [praticienId, setPraticienId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!institutId) {
      setError("Aucun institut n’est associé à cette session.");
      return;
    }
    let cancelled = false;
    void (async () => {
      const [clientsRes, servicesRes, praticiensRes] = await Promise.allSettled([
        listClients(institutId),
        listServices(institutId),
        listPraticiens(institutId),
      ]);
      if (cancelled) return;
      if (clientsRes.status === "fulfilled") setClients(clientsRes.value);
      if (servicesRes.status === "fulfilled") {
        setServices(servicesRes.value.filter((item) => item.is_active !== false));
      }
      if (praticiensRes.status === "fulfilled") setPraticiens(praticiensRes.value);
      const failed = [clientsRes, servicesRes, praticiensRes].find(
        (item): item is PromiseRejectedResult => item.status === "rejected",
      );
      if (failed) {
        const reason = failed.reason;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "Certaines listes n’ont pas pu être chargées. Vous pouvez quand même saisir une cliente.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [institutId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!institutId || !serviceId || !startsAt) return;
    setSaving(true);
    setError(null);
    try {
      let resolvedClientId = clientId;
      if (!resolvedClientId) {
        const name = newClientName.trim();
        if (name.length < 2) {
          setError("Choisissez une cliente ou saisissez son nom.");
          setSaving(false);
          return;
        }
        const created = await createClient(institutId, {
          full_name: name,
          phone: newClientPhone.trim() || undefined,
        });
        resolvedClientId = created.id;
      }
      await createBooking(institutId, {
        client_id: resolvedClientId,
        service_id: serviceId,
        praticien_id: praticienId || null,
        starts_at: new Date(startsAt).toISOString(),
      });
      setDone(true);
      setTimeout(onClose, 900);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Le rendez-vous n’a pas pu être créé.");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return <p className="py-6 text-center font-display text-sm font-semibold text-aya-purple">Rendez-vous enregistré</p>;
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={submit}>
      {error && <p className="text-xs text-aya-pink">{error}</p>}
      <Field label="Cliente">
        <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="">Nouvelle cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </Select>
      </Field>
      {!clientId && (
        <>
          <Field label="Nom de la cliente">
            <Input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} required={clients.length === 0} />
          </Field>
          <Field label="Téléphone">
            <Input value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} />
          </Field>
        </>
      )}
      <Field label="Prestation">
        <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
          <option value="">{services.length ? "Choisir une prestation" : "Aucune prestation — créez-en une d’abord"}</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Praticienne">
        <Select value={praticienId} onChange={(e) => setPraticienId(e.target.value)}>
          <option value="">Sans préférence</option>
          {praticiens.map((p) => (
            <option key={p.id} value={p.id}>
              {p.display_name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Début">
        <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
      </Field>
      <PrimaryBtn type="submit" full disabled={saving || !serviceId}>
        {saving ? "Enregistrement…" : "Créer le rendez-vous"}
      </PrimaryBtn>
    </form>
  );
}

export function Toast({ text }: { text: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aya-purple px-5 py-2.5 font-display text-sm font-medium text-aya-cream shadow-lg">
      {text}
    </div>
  );
}

export function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-sm font-semibold text-aya-ink">{title}</p>
      <p className="mt-1 text-xs text-aya-text">{sub}</p>
    </div>
  );
}

export type StatusFilter = Status | "all";
