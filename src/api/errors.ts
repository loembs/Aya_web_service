import type { ApiErrorBody } from "./dto";

/** Messages affichés à l'écran uniquement — jamais le corps brut ni les tokens. */
export function publicApiMessage(status: number, body: unknown): string {
  const detail = extractDetail(body);
  if (detail && detail.length <= 180 && !looksSensitive(detail)) {
    return detail;
  }
  if (status === 401) return "Identifiants ou session invalides.";
  if (status === 403) return "Accès refusé.";
  if (status === 404) return "Profil ou ressource introuvable.";
  if (status === 409) return "Conflit : l'action n'est pas possible.";
  if (status === 429) return "Trop de tentatives. Réessayez dans un instant.";
  if (status >= 500) return "Service indisponible. Réessayez plus tard.";
  return "La requête a échoué.";
}

function extractDetail(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const detail = (body as ApiErrorBody).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return detail[0].msg;
  return null;
}

function looksSensitive(text: string): boolean {
  return /token|bearer|password|secret|jwt|apikey|authorization/i.test(text);
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
