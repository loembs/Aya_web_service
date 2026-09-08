import { useEffect, useMemo, useState } from "react";
import { HOURS } from "../data";
import { C } from "../theme";
import { PageHeader, PrimaryBtn, Card, Empty } from "../components";
import { IconPlus } from "../icons";
import { useAuth } from "../auth/AuthContext";
import { listPlanningSlots } from "../api/planning";
import { formatTime, isoDate } from "../api/format";
import type { PlanningSlotResponseDTO } from "../api/dto";

function mondayOf(date: Date): Date {
  const copy = new Date(date);
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function slotsFor(slots: PlanningSlotResponseDTO[], day: Date, hour: string) {
  return slots.filter((slot) => {
    const start = new Date(slot.starts_at);
    return (
      start.toDateString() === day.toDateString() &&
      `${String(start.getHours()).padStart(2, "0")}:00` === hour
    );
  });
}

function slotsForDay(slots: PlanningSlotResponseDTO[], day: Date) {
  return slots.filter((slot) => new Date(slot.starts_at).toDateString() === day.toDateString());
}

export default function Agenda({ onNewRdv }: { onNewRdv: () => void }) {
  const { institutId, institutName } = useAuth();
  const [view, setView] = useState<"Jour" | "Semaine" | "Mois">("Semaine");
  const [slots, setSlots] = useState<PlanningSlotResponseDTO[]>([]);
  const weekStart = useMemo(() => mondayOf(new Date()), []);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekLabel = `${weekDays[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;

  useEffect(() => {
    if (!institutId) return;
    let cancelled = false;
    listPlanningSlots(institutId, isoDate(weekDays[0]), isoDate(weekDays[6]))
      .then((data) => {
        if (!cancelled) setSlots(data.filter((s) => s.booking_id));
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      });
    return () => {
      cancelled = true;
    };
  }, [institutId, weekDays]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Agenda"
        subtitle={`${weekLabel}${institutName ? ` · ${institutName}` : ""}`}
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
        {view === "Jour" && (
          <DayView
            slots={slots}
            day={weekDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]}
          />
        )}
        {view === "Semaine" && <WeekView weekDays={weekDays} slots={slots} />}
        {view === "Mois" && <MonthView slots={slots} />}
      </div>
    </div>
  );
}

function WeekView({ weekDays, slots }: { weekDays: Date[]; slots: PlanningSlotResponseDTO[] }) {
  const today = new Date().toDateString();
  return (
    <Card className="overflow-x-auto p-4">
      {slots.length === 0 && (
        <Empty title="Aucun rendez-vous cette semaine" sub="Les créneaux réservés de l'API s'affichent ici." />
      )}
      <div className="min-w-[900px]">
        <div className="grid" style={{ gridTemplateColumns: "56px repeat(7,1fr)" }}>
          <div />
          {weekDays.map((d) => {
            const isToday = d.toDateString() === today;
            return (
              <div key={d.toISOString()} className="pb-2 text-center">
                <div className="text-[11px] font-semibold" style={{ color: isToday ? C.pink : C.text }}>
                  {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div
                  className="mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ background: isToday ? C.pink : "transparent", color: isToday ? "#fff" : C.ink }}
                >
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        {HOURS.map((hour) => (
          <div key={hour} className="grid border-t border-[#f0ebf8]" style={{ gridTemplateColumns: "56px repeat(7,1fr)", minHeight: 72 }}>
            <div className="pt-2 pr-2 text-right text-[11px] text-[#b0a8c2]">{hour}</div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="border-l border-[#f6f2fb] p-1">
                {slotsFor(slots, day, hour).map((slot) => (
                  <div
                    key={slot.booking_id ?? slot.starts_at}
                    className="mb-1 rounded-lg px-2 py-1.5 text-[11px] leading-snug"
                    style={{ background: "#F9C6D8" }}
                  >
                    <div className="font-semibold text-aya-ink">{formatTime(slot.starts_at)}</div>
                    <div className="text-aya-text">{slot.status ?? "RDV"}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DayView({ slots, day }: { slots: PlanningSlotResponseDTO[]; day: Date }) {
  const items = slotsForDay(slots, day);
  return (
    <Card className="overflow-x-auto p-4">
      <div className="mb-3 font-display text-sm font-bold text-aya-ink">
        {day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      {items.length === 0 ? (
        <Empty title="Aucun rendez-vous" sub="Rien de réservé pour cette journée." />
      ) : (
        <div className="space-y-2">
          {items.map((slot) => (
            <div key={slot.booking_id ?? slot.starts_at} className="rounded-xl bg-aya-bg px-3 py-2 text-sm">
              {formatTime(slot.starts_at)} – {formatTime(slot.ends_at)} · {slot.status}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function MonthView({ slots }: { slots: PlanningSlotResponseDTO[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const counts: Record<number, number> = {};
  for (const slot of slots) {
    const d = new Date(slot.starts_at);
    if (d.getMonth() === month && d.getFullYear() === year) {
      counts[d.getDate()] = (counts[d.getDate()] ?? 0) + 1;
    }
  }
  return (
    <Card>
      <div className="mb-4 font-display text-sm font-bold text-aya-ink">
        {now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="pb-2 text-center text-[11px] font-semibold text-aya-text">
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={"e" + i} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <div
            key={d}
            className="min-h-[88px] rounded-xl border border-[#f0ebf8] p-2"
            style={{
              background: d === now.getDate() ? "#FDF1E5" : "#fff",
              borderColor: d === now.getDate() ? C.pink : "#f0ebf8",
            }}
          >
            <div className="mb-1 text-xs font-semibold" style={{ color: d === now.getDate() ? C.pink : C.ink }}>
              {d}
            </div>
            {counts[d] ? <div className="mt-1 text-[10px] text-aya-text">{counts[d]} RDV</div> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
