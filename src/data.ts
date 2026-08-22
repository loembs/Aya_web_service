export type Status = "confirmed" | "pending" | "cancelled" | "completed";

export const NAV_GROUPS = [
  {
    label: "Quotidien",
    items: [
      { id: "dashboard", label: "Tableau de bord" },
      { id: "agenda", label: "Agenda" },
      { id: "rdv", label: "Rendez-vous" },
    ],
  },
  {
    label: "Salon",
    items: [
      { id: "clientes", label: "Clientes" },
      { id: "presta", label: "Prestations" },
      { id: "equipe", label: "Équipe" },
      { id: "fiche", label: "Ma fiche" },
    ],
  },
  {
    label: "Activité",
    items: [
      { id: "paiements", label: "Paiements" },
      { id: "messages", label: "Messages" },
      { id: "marketing", label: "Marketing" },
      { id: "stats", label: "Statistiques" },
    ],
  },
];

export const NAV = NAV_GROUPS.flatMap((g) => g.items);

export const AVATAR_COLORS: Record<string, string> = {
  FN: "#F9C6D8",
  AD: "#C9DFF0",
  MS: "#C9F0DC",
  AB: "#D6C9F0",
  CD: "#F9DFC6",
  AF: "#F5C6E0",
  KN: "#C6E4F9",
  IS: "#E0D4C6",
  MO: "#E64F92",
  AN: "#D6C9F0",
  KF: "#F9C6D8",
};

export const APPOINTMENTS = [
  { id: "r1", date: "21 mai 2025", time: "10:00", end: "11:30", name: "Fatou Ndoye", service: "Maquillage Soft Glam", staff: "Mourzane O.", status: "confirmed" as Status, price: 25000, avatar: "FN", phone: "+221 77 123 45 67" },
  { id: "r2", date: "21 mai 2025", time: "11:30", end: "12:15", name: "Awa Diop", service: "Brushing + Soin", staff: "Awa Ndiaye", status: "confirmed" as Status, price: 18000, avatar: "AD", phone: "+221 76 234 56 78" },
  { id: "r3", date: "21 mai 2025", time: "14:00", end: "16:00", name: "Mariama Sarr", service: "Pose perruque", staff: "Awa Ndiaye", status: "pending" as Status, price: 35000, avatar: "MS", phone: "+221 78 345 67 89" },
  { id: "r4", date: "21 mai 2025", time: "16:30", end: "18:00", name: "Adama Ba", service: "Onglerie · Pose Gel", staff: "Khady Fall", status: "confirmed" as Status, price: 15000, avatar: "AB", phone: "+221 77 456 78 90" },
  { id: "r5", date: "22 mai 2025", time: "09:00", end: "10:00", name: "Coumba Diallo", service: "Soin du visage", staff: "Mourzane O.", status: "confirmed" as Status, price: 20000, avatar: "CD", phone: "+221 70 567 89 01" },
  { id: "r6", date: "22 mai 2025", time: "14:00", end: "16:30", name: "Aminata Fall", service: "Tresses collées", staff: "Awa Ndiaye", status: "pending" as Status, price: 25000, avatar: "AF", phone: "+221 77 678 90 12" },
  { id: "r7", date: "23 mai 2025", time: "11:00", end: "12:00", name: "Khadija Ndiaye", service: "Maquillage Soft Glam", staff: "Mourzane O.", status: "confirmed" as Status, price: 25000, avatar: "KN", phone: "+221 76 789 01 23" },
  { id: "r8", date: "20 mai 2025", time: "16:00", end: "16:45", name: "Ibrahima Sow", service: "Taille + Barbe", staff: "Ibrahima Sow", status: "cancelled" as Status, price: 8000, avatar: "IS", phone: "+221 77 890 12 34" },
  { id: "r9", date: "19 mai 2025", time: "10:00", end: "11:30", name: "Fatou Ndoye", service: "Maquillage Soft Glam", staff: "Mourzane O.", status: "completed" as Status, price: 25000, avatar: "FN", phone: "+221 77 123 45 67" },
  { id: "r10", date: "24 mai 2025", time: "13:00", end: "15:30", name: "Aminata Fall", service: "Tresses collées", staff: "Awa Ndiaye", status: "confirmed" as Status, price: 25000, avatar: "AF", phone: "+221 77 678 90 12" },
];

export const TODO_ITEMS = [
  { id: "t1", icon: "calendar", title: "2 rendez-vous à confirmer", sub: "Mariama Sarr · Aminata Fall", page: "rdv" },
  { id: "t2", icon: "mail", title: "3 clientes à relancer", sub: "Inactives depuis plus de 30 jours", page: "messages" },
  { id: "t3", icon: "card", title: "1 paiement en attente", sub: "Montant : 35 000 FCFA", page: "paiements" },
  { id: "t4", icon: "mega", title: "1 campagne marketing", sub: "Offre Ramadan à publier", page: "marketing" },
];

export const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
export const WEEK = ["Lun 19", "Mar 20", "Mer 21", "Jeu 22", "Ven 23", "Sam 24", "Dim 25"];

export const CALENDAR_EVENTS: Record<string, { name: string; service: string; color: string; staff: string }[]> = {
  "Lun 19:10:00": [{ name: "Fatou Ndoye", service: "Maquillage Soft Glam", color: "#F9C6D8", staff: "Mourzane O." }],
  "Lun 19:15:00": [{ name: "Adama Ba", service: "Onglerie · Pose Gel", color: "#D6C9F0", staff: "Khady Fall" }],
  "Mar 20:11:00": [{ name: "Awa Diop", service: "Brushing + Soin", color: "#C9DFF0", staff: "Awa Ndiaye" }],
  "Mer 21:09:00": [{ name: "Coumba Diallo", service: "Soin du visage", color: "#C9F0DC", staff: "Mourzane O." }],
  "Mer 21:10:00": [{ name: "Fatou Ndoye", service: "Maquillage Soft Glam", color: "#F9C6D8", staff: "Mourzane O." }],
  "Mer 21:11:30": [{ name: "Awa Diop", service: "Brushing + Soin", color: "#C9DFF0", staff: "Awa Ndiaye" }],
  "Mer 21:14:00": [{ name: "Mariama Sarr", service: "Pose perruque", color: "#F5C6E0", staff: "Awa Ndiaye" }],
  "Mer 21:16:30": [{ name: "Adama Ba", service: "Onglerie · Pose Gel", color: "#D6C9F0", staff: "Khady Fall" }],
  "Jeu 22:14:00": [{ name: "Aminata Fall", service: "Tresses collées", color: "#F9DFC6", staff: "Awa Ndiaye" }],
  "Ven 23:11:00": [{ name: "Khadija Ndiaye", service: "Maquillage Soft Glam", color: "#F9C6D8", staff: "Mourzane O." }],
  "Ven 23:16:00": [{ name: "Coumba Diallo", service: "Soin du visage", color: "#C9F0DC", staff: "Mourzane O." }],
  "Sam 24:11:00": [{ name: "Awa Diop", service: "Brushing + Soin", color: "#C9DFF0", staff: "Awa Ndiaye" }],
  "Sam 24:13:00": [{ name: "Aminata Fall", service: "Tresses", color: "#F9DFC6", staff: "Awa Ndiaye" }],
};

export const REVENUE_DATA = [
  { day: "1", v: 500000 },
  { day: "5", v: 820000 },
  { day: "8", v: 650000 },
  { day: "12", v: 1100000 },
  { day: "15", v: 950000 },
  { day: "18", v: 1300000 },
  { day: "21", v: 1100000 },
  { day: "25", v: 1600000 },
  { day: "28", v: 1400000 },
  { day: "31", v: 1850000 },
];

export const PIE_DATA = [
  { name: "Maquillage", value: 40, color: "#E64F92" },
  { name: "Coiffure", value: 30, color: "#9B6DCA" },
  { name: "Soins", value: 15, color: "#5BC0BE" },
  { name: "Onglerie", value: 10, color: "#F5A623" },
  { name: "Autres", value: 5, color: "#B0A8C2" },
];

export const SOURCE_DATA = [
  { name: "Marketplace AYA", value: 38, color: "#3C2164", hint: "Via l'app cliente" },
  { name: "Instagram", value: 24, color: "#E64F92", hint: "Lien en bio" },
  { name: "WhatsApp", value: 22, color: "#25D366", hint: "Lien partagé" },
  { name: "TikTok", value: 8, color: "#1A1030", hint: "Profil pro" },
  { name: "Direct / Walk-in", value: 8, color: "#F5A623", hint: "Sur place" },
];

export const CLIENTS = [
  { id: "c1", name: "Fatou Ndoye", last: "21 mai 2025", total: 130000, visits: 8, avatar: "FN", phone: "+221 77 123 45 67", email: "fatou.ndoye@gmail.com", notes: "Préfère le soft glam. Allergie au latex. Cliente VIP — toujours à l'heure.", since: "janv. 2024", neighborhood: "Almadies" },
  { id: "c2", name: "Awa Diop", last: "18 mai 2025", total: 95000, visits: 6, avatar: "AD", phone: "+221 76 234 56 78", email: "awa.diop@yahoo.fr", notes: "Cheveux sensibilisés, éviter les défrisages forts.", since: "mars 2024", neighborhood: "Mermoz" },
  { id: "c3", name: "Mariama Sarr", last: "15 mai 2025", total: 80000, visits: 4, avatar: "MS", phone: "+221 78 345 67 89", email: "mariama.s@orange.sn", notes: "Aime les poses perruques 4x4. Paiement souvent en Wave.", since: "sept. 2024", neighborhood: "Sacré-Cœur" },
  { id: "c4", name: "Adama Ba", last: "10 mai 2025", total: 60000, visits: 5, avatar: "AB", phone: "+221 77 456 78 90", email: "adama.ba@gmail.com", notes: "Ongles courts, préfère le nude et le french.", since: "juin 2024", neighborhood: "Point E" },
  { id: "c5", name: "Coumba Diallo", last: "08 mai 2025", total: 75000, visits: 5, avatar: "CD", phone: "+221 70 567 89 01", email: "coumba.d@gmail.com", notes: "Peau mixte, sensibilités autour des ailes du nez.", since: "févr. 2024", neighborhood: "Ngor" },
  { id: "c6", name: "Aminata Fall", last: "24 mai 2025", total: 110000, visits: 7, avatar: "AF", phone: "+221 77 678 90 12", email: "aminata.fall@gmail.com", notes: "Tresses collées toutes les 6 semaines. Fidèle.", since: "nov. 2023", neighborhood: "Ouakam" },
  { id: "c7", name: "Khadija Ndiaye", last: "23 mai 2025", total: 45000, visits: 2, avatar: "KN", phone: "+221 76 789 01 23", email: "k.ndiaye@gmail.com", notes: "Nouvelle cliente, venue via Instagram.", since: "mai 2025", neighborhood: "Plateau" },
];

export const PRESTATIONS = [
  { id: "p1", name: "Maquillage Soft Glam", cat: "Maquillage", duration: "1h30", price: 25000, available: true, img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop", desc: "Maquillage naturel lumineux, idéal événements & shooting." },
  { id: "p2", name: "Maquillage soirée", cat: "Maquillage", duration: "2h00", price: 40000, available: true, img: "https://images.unsplash.com/photo-1522335789203-aabd1fc37bad?w=200&h=200&fit=crop", desc: "Look glamour, smoky ou cut crease selon envie." },
  { id: "p3", name: "Pose perruque", cat: "Coiffure", duration: "2h00", price: 35000, available: true, img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop", desc: "Pose lace, collage et coiffage inclus." },
  { id: "p4", name: "Brushing + Soin", cat: "Coiffure", duration: "45min", price: 15000, available: true, img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop", desc: "Lavage, soin hydratant et brushing." },
  { id: "p5", name: "Tresses collées", cat: "Coiffure", duration: "2h30", price: 25000, available: true, img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&h=200&fit=crop", desc: "Tresses collées, cornrows ou knotless." },
  { id: "p6", name: "Soin du visage", cat: "Soins", duration: "1h00", price: 20000, available: true, img: "https://images.unsplash.com/photo-1570172619604-71fd7473157e?w=200&h=200&fit=crop", desc: "Nettoyage, extraction douce et masque adapté." },
  { id: "p7", name: "Onglerie · Pose Gel", cat: "Onglerie", duration: "1h30", price: 15000, available: true, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop", desc: "Pose gel, french ou couleur au choix." },
  { id: "p8", name: "Nail art signature", cat: "Onglerie", duration: "2h00", price: 22000, available: false, img: "https://images.unsplash.com/photo-1519014816548-c5aa74d162d4?w=200&h=200&fit=crop", desc: "Création sur-mesure, strass et motifs." },
  { id: "p9", name: "Taille + Barbe", cat: "Autres", duration: "45min", price: 8000, available: true, img: "https://images.unsplash.com/photo-1503951914875-834188fe47fc?w=200&h=200&fit=crop", desc: "Coupe homme, taille de barbe et finitions." },
];

export const TEAM = [
  { id: "e1", name: "Mourzane Ouédraogo", short: "Mourzane O.", role: "Propriétaire · Maquilleuse", avatar: "MO", color: "#E64F92", services: ["Maquillage Soft Glam", "Maquillage soirée", "Soin du visage"], hours: "Mar – Sam · 09h–18h", rating: 4.9, rdv: 42 },
  { id: "e2", name: "Awa Ndiaye", short: "Awa Ndiaye", role: "Coiffeuse", avatar: "AN", color: "#9B6DCA", services: ["Pose perruque", "Brushing + Soin", "Tresses collées"], hours: "Lun – Sam · 09h–19h", rating: 4.8, rdv: 38 },
  { id: "e3", name: "Khady Fall", short: "Khady Fall", role: "Nail artist", avatar: "KF", color: "#F5A623", services: ["Onglerie · Pose Gel", "Nail art signature"], hours: "Mer – Dim · 10h–18h", rating: 4.9, rdv: 31 },
  { id: "e4", name: "Ibrahima Sow", short: "Ibrahima Sow", role: "Barbier", avatar: "IS", color: "#5BC0BE", services: ["Taille + Barbe"], hours: "Lun – Sam · 10h–20h", rating: 4.7, rdv: 27 },
];

export const PAYMENTS = [
  { id: "pay1", client: "Fatou Ndoye", avatar: "FN", service: "Maquillage Soft Glam", amount: 25000, method: "Wave", status: "paid" as const, date: "21 mai 2025", type: "Solde" },
  { id: "pay2", client: "Awa Diop", avatar: "AD", service: "Brushing + Soin", amount: 18000, method: "Orange Money", status: "paid" as const, date: "21 mai 2025", type: "Solde" },
  { id: "pay3", client: "Mariama Sarr", avatar: "MS", service: "Pose perruque", amount: 15000, method: "Wave", status: "pending" as const, date: "21 mai 2025", type: "Acompte 40%" },
  { id: "pay4", client: "Adama Ba", avatar: "AB", service: "Onglerie · Pose Gel", amount: 15000, method: "Espèces", status: "paid" as const, date: "21 mai 2025", type: "Solde" },
  { id: "pay5", client: "Aminata Fall", avatar: "AF", service: "Tresses collées", amount: 10000, method: "En ligne", status: "pending" as const, date: "22 mai 2025", type: "Acompte" },
  { id: "pay6", client: "Coumba Diallo", avatar: "CD", service: "Soin du visage", amount: 20000, method: "Carte", status: "paid" as const, date: "08 mai 2025", type: "Solde" },
  { id: "pay7", client: "Khadija Ndiaye", avatar: "KN", service: "Maquillage Soft Glam", amount: 25000, method: "Wave", status: "paid" as const, date: "23 mai 2025", type: "Solde" },
];

export const CONVERSATIONS = [
  { id: "m1", name: "Fatou Ndoye", avatar: "FN", preview: "Merci beaucoup, à demain 10h !", time: "09:12", unread: 0, auto: false },
  { id: "m2", name: "Mariama Sarr", avatar: "MS", preview: "Je confirme pour 14h, Wave envoyé.", time: "08:44", unread: 2, auto: false },
  { id: "m3", name: "Aminata Fall", avatar: "AF", preview: "Est-ce que je peux décaler samedi ?", time: "Hier", unread: 1, auto: false },
  { id: "m4", name: "Awa Diop", avatar: "AD", preview: "Rappel automatique envoyé", time: "Hier", unread: 0, auto: true },
  { id: "m5", name: "Coumba Diallo", avatar: "CD", preview: "Relance cliente inactive", time: "18 mai", unread: 0, auto: true },
];

export const THREAD: Record<string, { from: "me" | "them"; text: string; time: string }[]> = {
  m1: [
    { from: "me", text: "Bonjour Fatou, petit rappel pour votre Soft Glam demain à 10h chez Andal Beauty Studio.", time: "08:30" },
    { from: "them", text: "Oui c'est noté ! J'apporte ma robe ivoire.", time: "08:41" },
    { from: "me", text: "Parfait, on adaptera le maquillage. À demain 10h.", time: "08:50" },
    { from: "them", text: "Merci beaucoup, à demain 10h !", time: "09:12" },
  ],
  m2: [
    { from: "me", text: "Mariama, pouvez-vous confirmer votre pose perruque aujourd'hui à 14h ?", time: "08:10" },
    { from: "them", text: "Je confirme pour 14h, Wave envoyé.", time: "08:44" },
  ],
  m3: [
    { from: "them", text: "Est-ce que je peux décaler samedi ?", time: "Hier 19:22" },
  ],
  m4: [
    { from: "me", text: "Rappel : brushing demain 11h30 avec Awa. Répondez OUI pour confirmer.", time: "Hier 18:00" },
  ],
  m5: [
    { from: "me", text: "Coumba, cela fait 2 semaines… On vous réserve un soin visage -15% cette semaine ?", time: "18 mai" },
  ],
};

export const CAMPAIGNS = [
  { id: "k1", title: "Soft Glam de mai", channel: "Instagram + AYA", status: "active" as const, reach: 1240, bookings: 18, revenue: 450000, period: "1–31 mai" },
  { id: "k2", title: "Tresses -20% en semaine", channel: "WhatsApp", status: "scheduled" as const, reach: 0, bookings: 0, revenue: 0, period: "26–30 mai" },
  { id: "k3", title: "Relance clientes inactives", channel: "SMS auto", status: "ended" as const, reach: 86, bookings: 11, revenue: 210000, period: "1–15 mai" },
  { id: "k4", title: "Offre duo amies", channel: "TikTok", status: "draft" as const, reach: 0, bookings: 0, revenue: 0, period: "Juin" },
];

export const PLANS = [
  {
    id: "starter",
    name: "AYA Starter",
    price: "0",
    period: "Gratuit",
    tagline: "Pour démarrer",
    features: ["Agenda 1 praticienne", "Jusqu'à 30 RDV / mois", "Fiche publique basique", "Paiements sur place", "Support e-mail"],
  },
  {
    id: "pro",
    name: "AYA Pro",
    price: "15 000",
    period: "/ mois",
    tagline: "Le plus choisi",
    current: true,
    features: ["Agenda multi-praticiennes", "RDV illimités", "Fiche + QR code", "Acomptes Wave / OM", "Messages & relances auto", "Statistiques sources", "Marketing de base"],
  },
  {
    id: "business",
    name: "AYA Business",
    price: "35 000",
    period: "/ mois",
    tagline: "Pour les instituts",
    features: ["Tout Pro inclus", "Plusieurs établissements", "Rôles & permissions", "Campagnes avancées", "Export comptable", "Support prioritaire", "Formation équipe"],
  },
];

export function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}
