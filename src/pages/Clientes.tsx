import { useState } from "react";
import { CLIENTS, APPOINTMENTS, fmt } from "../data";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, SearchBar, Card, Avatar, StatusBadge, Field, Input } from "../components";
import { IconPlus, IconMail } from "../icons";

export default function Clientes({ onMessage }: { onMessage: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(CLIENTS[0].id);
  const [adding, setAdding] = useState(false);
  const client = CLIENTS.find((c) => c.id === sel)!;
  const history = APPOINTMENTS.filter((a) => a.name === client.name);
  const list = CLIENTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Clientes"
        subtitle={`${CLIENTS.length} clientes · fichier du salon`}
        action={
          <PrimaryBtn onClick={() => setAdding(!adding)}>
            <IconPlus size={14} /> Ajouter une cliente
          </PrimaryBtn>
        }
      />
      <div className="grid flex-1 grid-cols-12 gap-4 overflow-hidden px-7 py-5">
        <Card className="col-span-5 flex flex-col overflow-hidden p-4">
          <SearchBar placeholder="Rechercher une cliente..." value={q} onChange={setQ} />
          {adding && (
            <form
              className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-aya-bg p-3"
              onSubmit={(e) => {
                e.preventDefault();
                setAdding(false);
              }}
            >
              <Field label="Nom">
                <Input placeholder="Prénom Nom" />
              </Field>
              <Field label="Téléphone">
                <Input placeholder="+221 …" />
              </Field>
              <div className="col-span-2 flex gap-2">
                <button type="button" onClick={() => setAdding(false)} className="flex-1 rounded-lg bg-white py-2 text-xs font-semibold text-aya-text">
                  Annuler
                </button>
                <button type="submit" className="flex-1 rounded-lg bg-aya-pink py-2 text-xs font-semibold text-white">
                  Enregistrer
                </button>
              </div>
            </form>
          )}
          <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
            {list.map((cl) => (
              <button
                key={cl.id}
                onClick={() => setSel(cl.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                style={{ background: sel === cl.id ? C.cream : C.bg }}
              >
                <Avatar initials={cl.avatar} />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[13px] font-semibold text-aya-ink">{cl.name}</div>
                  <div className="text-[11px] text-aya-text">
                    {cl.neighborhood} · {cl.visits} visites
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-semibold text-aya-purple">{fmt(cl.total)}</div>
                  <div className="text-[10px] text-aya-text">{cl.last}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="col-span-7 overflow-y-auto">
          <Card>
            <div className="flex items-start gap-4">
              <Avatar initials={client.avatar} size={64} />
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-aya-ink">{client.name}</h2>
                <p className="text-sm text-aya-text">
                  {client.neighborhood} · Cliente depuis {client.since}
                </p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>
                    <b className="text-aya-ink">{fmt(client.total)}</b>
                    <span className="ml-1 text-aya-text">dépensés</span>
                  </span>
                  <span>
                    <b className="text-aya-ink">{client.visits}</b>
                    <span className="ml-1 text-aya-text">visites</span>
                  </span>
                </div>
              </div>
              <button onClick={onMessage} className="inline-flex items-center gap-1.5 rounded-lg bg-aya-purple px-3 py-2 text-xs font-semibold text-aya-cream">
                <IconMail size={14} /> Message
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-aya-bg p-3">
                <div className="text-[11px] text-aya-text">Téléphone</div>
                <div className="font-medium text-aya-ink">{client.phone}</div>
              </div>
              <div className="rounded-xl bg-aya-bg p-3">
                <div className="text-[11px] text-aya-text">E-mail</div>
                <div className="font-medium text-aya-ink">{client.email}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 font-display text-xs font-semibold text-aya-ink">Notes internes</div>
              <p className="rounded-xl bg-[#FDF1E5] p-3 text-sm leading-relaxed text-aya-ink">{client.notes}</p>
            </div>
            <div className="mt-5">
              <div className="mb-2 font-display text-sm font-bold text-aya-ink">Historique des rendez-vous</div>
              <div className="space-y-2">
                {history.length === 0 && <p className="text-xs text-aya-text">Aucun rendez-vous enregistré.</p>}
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-xl bg-aya-bg px-3 py-2.5">
                    <div>
                      <div className="text-[13px] font-semibold text-aya-ink">{h.service}</div>
                      <div className="text-[11px] text-aya-text">
                        {h.date} · {h.time} · {h.staff}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-aya-purple">{fmt(h.price)}</span>
                      <StatusBadge status={h.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
