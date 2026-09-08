import { useEffect, useState } from "react";
import { listBookings } from "./bookings";
import type { AppointmentListResponseDTO } from "./dto";
import { useAuth } from "../auth/AuthContext";

export function useBookings() {
  const { institutId } = useAuth();
  const [rows, setRows] = useState<AppointmentListResponseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!institutId) {
      setRows([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    listBookings(institutId)
      .then((data) => {
        if (!cancelled) {
          setRows(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Impossible de charger les rendez-vous.");
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [institutId]);

  return { rows, error, loading, institutId };
}
