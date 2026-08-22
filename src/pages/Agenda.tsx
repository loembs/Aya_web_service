import { useState } from "react";
import { HOURS, WEEK, CALENDAR_EVENTS, TEAM } from "../data";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, Card } from "../components";
import { IconPlus } from "../icons";

export default function Agenda({ onNewRdv }: { onNewRdv: () => void }) {
  const [view, setView] = useState<"Jour" | "Semaine" | "Mois">("Semaine");
  const [staffFilter, setStaffFilter] = useState("Toutes");

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Agenda"
        subtitle="19 – 25 mai 2025 · Andal Beauty Studio"
        action={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-aya-bg p-0.5">
              {(["Jour", "Semaine", "Mois"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="rounded-md px-3 py-1.5 font-display text-[12px] font-semibold"
                  style={{ background: view === v ? C.pink : "transparent", color: view === v ? "#fff" : C.text }}
                >
                  {v}
                </button>
              ))}
            </div>
            <PrimaryBtn onClick={onNewRdv}>
              <IconPlus size={14} /> Nouveau RDV
            </PrimaryBtn>
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-7 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-aya-text">Praticiennes :</span>
          {["Toutes", ...TEAM.map((t) => t.short)].map((s) => (
            <button
              key={s}
              onClick={() => setStaffFilter(s)}
              className="rounded-full px-3 py-1 font-display text-[11px] font-semibold"
              style={{
                background: staffFilter === s ? C.purple : "#fff",
                color: staffFilter === s ? C.cream : C.text,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {view === "Jour" && <DayView staffFilter={staffFilter} />}
        {view === "Semaine" && <WeekView staffFilter={staffFilter} />}
        {view === "Mois" && <MonthView />}
      </div>
    </div>
  );
}

function WeekView({ staffFilter }: { staffFilter: string }) {
  return (
    <Card className="overflow-x-auto p-4">
      <div className="min-w-[900px]">
        <div className="grid" style={{ gridTemplateColumns: "56px repeat(7,1fr)" }}>
          <div />
          {WEEK.map((d, i) => (
            <div key={d} className="pb-2 text-center">
              <div className="text-[11px] font-semibold" style={{ color: i === 2 ? C.pink : C.text }}>
                {d.split(" ")[0]}
              </div>
              <div
                className="mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold"
                style={{ background: i === 2 ? C.pink : "transparent", color: i === 2 ? "#fff" : C.ink }}
              >
                {d.split(" ")[1]}
              </div>
            </div>
          ))}
        </div>
        {HOURS.map((hour) => (
          <div key={hour} className="grid border-t border-[#f0ebf8]" style={{ gridTemplateColumns: "56px repeat(7,1fr)", minHeight: 72 }}>
            <div className="pt-2 pr-2 text-right text-[11px] text-[#b0a8c2]">{hour}</div>
            {WEEK.map((day) => {
              const events = (CALENDAR_EVENTS[`${day}:${hour}`] || []).filter(
                (e) => staffFilter === "Toutes" || e.staff === staffFilter,
              );
              return (
                <div key={day} className="border-l border-[#f6f2fb] p-1">
                  {events.map((ev) => (
                    <div
                      key={ev.name + ev.service}
                      className="mb-1 cursor-pointer rounded-lg px-2 py-1.5 text-[11px] leading-snug"
                      style={{ background: ev.color }}
                    >
                      <div className="font-semibold text-aya-ink">{ev.name}</div>
                      <div className="text-aya-text">{ev.service}</div>
                      <div className="mt-0.5 text-[10px] text-aya-text">{ev.staff}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DayView({ staffFilter }: { staffFilter: string }) {
  const cols = staffFilter === "Toutes" ? TEAM : TEAM.filter((t) => t.short === staffFilter);
  return (
    <Card className="overflow-x-auto p-4">
      <div className="mb-3 font-display text-sm font-bold text-aya-ink">Mercredi 21 mai 2025</div>
      <div className="min-w-[720px]">
        <div className="grid" style={{ gridTemplateColumns: `56px repeat(${cols.length},1fr)` }}>
          <div />
          {cols.map((t) => (
            <div key={t.id} className="flex items-center gap-2 px-2 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: t.color }}>
                {t.avatar}
              </div>
              <div>
                <div className="text-xs font-semibold text-aya-ink">{t.short}</div>
                <div className="text-[10px] text-aya-text">{t.role.split("·")[0]}</div>
              </div>
            </div>
          ))}
        </div>
        {HOURS.map((hour) => (
          <div key={hour} className="grid border-t border-[#f0ebf8]" style={{ gridTemplateColumns: `56px repeat(${cols.length},1fr)`, minHeight: 64 }}>
            <div className="pt-2 pr-2 text-right text-[11px] text-[#b0a8c2]">{hour}</div>
            {cols.map((t) => {
              const key = `Mer 21:${hour}`;
              const events = (CALENDAR_EVENTS[key] || []).filter((e) => e.staff === t.short);
              return (
                <div key={t.id} className="border-l border-[#f6f2fb] p-1">
                  {events.map((ev) => (
                    <div key={ev.name} className="rounded-lg px-2 py-1.5 text-[11px]" style={{ background: ev.color }}>
                      <div className="font-semibold">{ev.name}</div>
                      <div className="text-aya-text">{ev.service}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}

function MonthView() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const dots: Record<number, string[]> = {
    19: ["#F9C6D8", "#D6C9F0"],
    20: ["#C9DFF0"],
    21: ["#F9C6D8", "#C9DFF0", "#F5C6E0", "#D6C9F0"],
    22: ["#F9DFC6"],
    23: ["#F9C6D8", "#C9F0DC"],
    24: ["#C9DFF0", "#F9DFC6"],
  };
  return (
    <Card>
      <div className="mb-4 font-display text-sm font-bold text-aya-ink">Mai 2025</div>
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="pb-2 text-center text-[11px] font-semibold text-aya-text">
            {d}
          </div>
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={"e" + i} />
        ))}
        {days.map((d) => (
          <div
            key={d}
            className="min-h-[88px] rounded-xl border border-[#f0ebf8] p-2"
            style={{ background: d === 21 ? "#FDF1E5" : "#fff", borderColor: d === 21 ? C.pink : "#f0ebf8" }}
          >
            <div className="mb-1 text-xs font-semibold" style={{ color: d === 21 ? C.pink : C.ink }}>
              {d}
            </div>
            <div className="flex flex-wrap gap-1">
              {(dots[d] || []).map((c, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            {dots[d] && <div className="mt-1 text-[10px] text-aya-text">{dots[d].length} RDV</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}
