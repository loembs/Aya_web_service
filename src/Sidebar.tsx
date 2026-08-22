import { NAV_GROUPS } from "./data";
import { NAV_ICONS, IconCrown, IconSettings } from "./icons";
import { C } from "./theme";

const LOGO_URL =
  "https://res.cloudinary.com/dprbhsvxl/image/upload/v1787358731/WhatsApp_Image_2026-08-18_at_13.19.55_v4tlpn.jpg";

export default function Sidebar({
  active,
  setActive,
  onPremium,
  collapsed,
}: {
  active: string;
  setActive: (id: string) => void;
  onPremium: () => void;
  collapsed?: boolean;
}) {
  return (
    <aside
      className="flex h-screen shrink-0 flex-col font-display"
      style={{ width: collapsed ? 76 : 236, background: C.purple }}
    >
      <button
        onClick={() => setActive("dashboard")}
        aria-label="AYA Pro — tableau de bord"
        className={`border-b border-white/10 text-left ${collapsed ? "px-2 py-2.5" : "px-3.5 py-2.5"}`}
      >
        {collapsed ? (
          <img src={LOGO_URL} alt="AYA" className="mx-auto h-9 w-9 rounded-lg object-cover" />
        ) : (
          <div>
            <img src={LOGO_URL} alt="AYA" className="h-11 w-[148px] rounded-lg object-cover object-center" />
            <div className="mt-1 pl-0.5 text-[10px] font-semibold tracking-[0.28em] text-aya-cream/70">PRO</div>
          </div>
        )}
      </button>
      

      {!collapsed && (
        <div className="mx-3 mt-3 flex items-center gap-2.5 rounded-xl bg-white/10 px-2.5 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aya-pink text-[11px] font-bold text-white">
            AB
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-semibold text-aya-cream">Andal Beauty Studio</div>
            <div className="text-[11px] text-aya-cream/50">Almadies, Dakar</div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Navigation principale">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <div className="mb-1 px-2.5 pt-1 text-[10px] font-semibold tracking-[0.16em] text-aya-cream/35 uppercase">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = active === item.id;
              const Icon = NAV_ICONS[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  title={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-xl py-2 text-left transition ${isActive ? "" : "hover:bg-white/5"}`}
                  style={{
                    paddingLeft: collapsed ? 0 : 12,
                    paddingRight: 10,
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "rgba(253,241,229,0.12)" : "transparent",
                    color: isActive ? C.cream : "rgba(253,241,229,0.58)",
                  }}
                >
                  <span style={{ color: isActive ? C.pink : "inherit" }}>{Icon && <Icon size={17} />}</span>
                  {!collapsed && (
                    <span className="text-[13px]" style={{ fontWeight: isActive ? 600 : 500, color: isActive ? C.cream : "rgba(253,241,229,0.68)" }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={`border-t border-white/10 ${collapsed ? "p-2" : "p-3"}`}>
        {!collapsed && (
          <button
            onClick={onPremium}
            className="mb-3 w-full rounded-xl bg-gradient-to-br from-[#E64F92] to-[#c43a78] p-3 text-left transition hover:brightness-110"
          >
            <div className="mb-0.5 flex items-center gap-1.5 text-[12px] font-semibold text-white">
              <IconCrown size={14} /> Passer en Premium
            </div>
            <div className="text-[11px] leading-snug text-white/80">Plus d'outils pour développer votre salon.</div>
          </button>
        )}
        <button
          onClick={() => setActive("settings")}
          className="flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-white/5"
          style={{ background: active === "settings" ? "rgba(253,241,229,0.10)" : "transparent" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-aya-pink text-[11px] font-bold text-white">
            MO
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-aya-cream">Mourzane O.</div>
              <div className="text-[11px] text-aya-cream/45">Propriétaire</div>
            </div>
          )}
          {!collapsed && (
            <span className="text-aya-cream/40">
              <IconSettings size={14} />
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}