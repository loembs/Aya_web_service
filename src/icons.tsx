import type { ReactElement, ReactNode } from "react";

type P = { size?: number; className?: string };

function Svg({ size = 18, className, children }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconGrid(p: P) {
  return (
    <Svg {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}
export function IconCalendar(p: P) {
  return (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </Svg>
  );
}
export function IconClock(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5l3 1.5" />
    </Svg>
  );
}
export function IconUsers(p: P) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14.2c2 .4 3.6 1.8 4.2 4.3" />
    </Svg>
  );
}
export function IconUser(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1-3.6 3.4-5.5 7-5.5s6 1.9 7 5.5" />
    </Svg>
  );
}
export function IconSpark(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 3l1.4 5.2L18.5 9 14 12.4 15.2 18 12 14.8 8.8 18 10 12.4 5.5 9l5.1-.8L12 3z" />
    </Svg>
  );
}
export function IconTeam(p: P) {
  return (
    <Svg {...p}>
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="16" cy="8" r="2.6" />
      <path d="M3.5 19c.5-2.8 2.4-4.4 4.5-4.4s4 1.6 4.5 4.4" />
      <path d="M11.5 19c.5-2.8 2.4-4.4 4.5-4.4s4 1.6 4.5 4.4" />
    </Svg>
  );
}
export function IconCard(p: P) {
  return (
    <Svg {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19" />
      <path d="M7 15h4" />
    </Svg>
  );
}
export function IconMail(p: P) {
  return (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </Svg>
  );
}
export function IconMegaphone(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 10v4c2.5 0 4.5 1 7 2.5V7.5C8.5 9 6.5 10 4 10z" />
      <path d="M11 7.5L19 5v14l-8-2.5" />
      <path d="M4 14c0 2 .8 3.5 2.2 4.2" />
    </Svg>
  );
}
export function IconChart(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15v-4M12 15V8M16 15v-7" />
    </Svg>
  );
}
export function IconSettings(p: P) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" />
    </Svg>
  );
}
export function IconPhone(p: P) {
  return (
    <Svg {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10 18.5h4" />
    </Svg>
  );
}
export function IconBell(p: P) {
  return (
    <Svg {...p}>
      <path d="M6 16h12l-1.2-2.2a7 7 0 0 1-.8-3.3V9a5 5 0 0 0-10 0v1.5c0 1.1-.3 2.3-.8 3.3L6 16z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Svg>
  );
}
export function IconPlus(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}
export function IconSearch(p: P) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </Svg>
  );
}
export function IconShare(p: P) {
  return (
    <Svg {...p}>
      <circle cx="18" cy="5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="19" r="2.4" />
      <path d="M8.2 11l7.6-5M8.2 13l7.6 5" />
    </Svg>
  );
}
export function IconCopy(p: P) {
  return (
    <Svg {...p}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16V5.5A1.5 1.5 0 0 1 6.5 4H16" />
    </Svg>
  );
}
export function IconChevron(p: P) {
  return (
    <Svg {...p}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}
export function IconCheck(p: P) {
  return (
    <Svg {...p}>
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </Svg>
  );
}
export function IconFilter(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Svg>
  );
}
export function IconMore(p: P) {
  return (
    <Svg {...p}>
      <circle cx="6" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="18" cy="12" r="1.3" fill="currentColor" />
    </Svg>
  );
}
export function IconSend(p: P) {
  return (
    <Svg {...p}>
      <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
    </Svg>
  );
}
export function IconMap(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11z" />
      <circle cx="12" cy="10" r="2" />
    </Svg>
  );
}
export function IconStar(p: P) {
  return (
    <Svg {...p}>
      <path d="M12 3.5l2.4 5.1 5.6.6-4.2 3.8 1.2 5.5L12 15.8 7 18.5l1.2-5.5L4 9.2l5.6-.6L12 3.5z" />
    </Svg>
  );
}
export function IconLink(p: P) {
  return (
    <Svg {...p}>
      <path d="M10 13a5 5 0 0 0 7.5.1l1.4-1.4a5 5 0 0 0-7.1-7.1L10.5 6" />
      <path d="M14 11a5 5 0 0 0-7.5-.1L5.1 12.3a5 5 0 0 0 7.1 7.1L13.5 18" />
    </Svg>
  );
}
export function IconLogout(p: P) {
  return (
    <Svg {...p}>
      <path d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4H19v16h-7.5A1.5 1.5 0 0 1 10 18.5V17" />
      <path d="M4 12h10M11 9l3 3-3 3" />
    </Svg>
  );
}
export function IconCrown(p: P) {
  return (
    <Svg {...p}>
      <path d="M3 16l2.5-9 4.5 4 2-6 2 6 4.5-4 2.5 9H3z" />
      <path d="M5 19h14" />
    </Svg>
  );
}
export function IconEye(p: P) {
  return (
    <Svg {...p}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </Svg>
  );
}
export function IconInstagram(p: P) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </Svg>
  );
}
export function IconWhatsapp(p: P) {
  return (
    <Svg {...p}>
      <path d="M19.5 12.2A7.5 7.5 0 0 1 8 18.6L4.5 19.5l1-3.4A7.5 7.5 0 1 1 19.5 12.2z" />
      <path d="M9.2 9.6c.2-.5.4-.5.7-.5h.6c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.1 0 .3.1.5.4.6 1 1.2 1.6 1.6.2.1.4.2.5.1l.5-.4c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.6c0 .3 0 .5-.5.7A4.4 4.4 0 0 1 9.2 9.6z" />
    </Svg>
  );
}

export const NAV_ICONS: Record<string, (p: P) => ReactElement> = {
  dashboard: IconGrid,
  agenda: IconCalendar,
  rdv: IconClock,
  clientes: IconUsers,
  presta: IconSpark,
  equipe: IconTeam,
  fiche: IconPhone,
  paiements: IconCard,
  messages: IconMail,
  marketing: IconMegaphone,
  stats: IconChart,
  settings: IconSettings,
};
