import { useState } from "react";
import { CONVERSATIONS, THREAD } from "../data";
import { C } from "../theme";
import { PageHeader, Card, Avatar, SearchBar } from "../components";
import { IconSend, IconBell } from "../icons";

export default function Messages() {
  const [id, setId] = useState("m1");
  const [text, setText] = useState("");
  const conv = CONVERSATIONS.find((c) => c.id === id)!;
  const msgs = THREAD[id] || [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Messages" subtitle="Conversations clientes & relances automatiques" />
      <div className="grid flex-1 grid-cols-12 gap-4 overflow-hidden px-7 py-5">
        <Card className="col-span-4 flex flex-col overflow-hidden p-3">
          <SearchBar placeholder="Rechercher une conversation..." />
          <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
            {CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setId(c.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                style={{ background: id === c.id ? C.cream : "transparent" }}
              >
                <Avatar initials={c.avatar} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[13px] font-semibold text-aya-ink">{c.name}</span>
                    <span className="text-[10px] text-aya-text">{c.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {c.auto && <span className="text-[9px] font-semibold text-aya-pink">AUTO</span>}
                    <span className="truncate text-[11px] text-aya-text">{c.preview}</span>
                  </div>
                </div>
                {c.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-aya-pink px-1 text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card className="col-span-5 flex flex-col overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-[#f0ebf8] px-4 py-3">
            <Avatar initials={conv.avatar} />
            <div>
              <div className="font-display text-sm font-semibold text-aya-ink">{conv.name}</div>
              <div className="text-[11px] text-aya-text">{conv.auto ? "Relance automatique" : "Conversation directe"}</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed"
                  style={{
                    background: m.from === "me" ? C.purple : C.bg,
                    color: m.from === "me" ? C.cream : C.ink,
                    borderBottomRightRadius: m.from === "me" ? 6 : 16,
                    borderBottomLeftRadius: m.from === "me" ? 16 : 6,
                  }}
                >
                  {m.text}
                  <div className="mt-1 text-[10px] opacity-60">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-[#f0ebf8] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              setText("");
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 rounded-xl bg-aya-bg px-3 py-2.5 text-sm outline-none"
            />
            <button type="submit" className="rounded-xl bg-aya-pink px-3 text-white">
              <IconSend size={16} />
            </button>
          </form>
        </Card>

        <Card className="col-span-3">
          <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-aya-ink">
            <IconBell size={16} /> Relances auto
          </div>
          {[
            { t: "Rappel J-1", s: "SMS + WhatsApp 18h avant", on: true },
            { t: "Confirmation", s: "Si pas de réponse sous 4h", on: true },
            { t: "Clientes inactives", s: "Après 30 jours sans RDV", on: true },
            { t: "Anniversaire", s: "Offre -10% le jour J", on: false },
          ].map((r) => (
            <div key={r.t} className="mb-3 rounded-xl bg-aya-bg p-3">
              <div className="flex items-center justify-between">
                <div className="font-display text-xs font-semibold text-aya-ink">{r.t}</div>
                <div
                  className="h-5 w-9 rounded-full p-0.5"
                  style={{ background: r.on ? C.pink : "#d4cce0" }}
                >
                  <div className="h-4 w-4 rounded-full bg-white" style={{ marginLeft: r.on ? 14 : 0 }} />
                </div>
              </div>
              <div className="mt-1 text-[11px] text-aya-text">{r.s}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
