import { useEffect, useState } from "react";

const TEST_EMAIL = "staff@aya.test";
const TEST_SECRET = "JBSWY3DPEHPK3PXP";
const STEP = 30;

function base32Decode(secret: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = secret.toUpperCase().replace(/=+$/, "");
  let bits = "";
  for (const char of cleaned) {
    const value = alphabet.indexOf(char);
    if (value < 0) continue;
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function totpNow(secret: string): Promise<string> {
  const keyData = base32Decode(secret);
  const raw = new ArrayBuffer(keyData.byteLength);
  new Uint8Array(raw).set(keyData);
  const counter = Math.floor(Date.now() / 1000 / STEP);
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setUint32(4, counter);
  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(binary % 1_000_000).padStart(6, "0");
}

export function isTestStaffEmail(email: string): boolean {
  return email.trim().toLowerCase() === TEST_EMAIL;
}

/** @deprecated préférer isTestStaffEmail — conservé pour les appels existants */
export function isDevTestStaff(email: string): boolean {
  return isTestStaffEmail(email);
}

export function DevTestTotpHint({ onFill }: { onFill?: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(STEP);

  useEffect(() => {
    let alive = true;
    async function tick() {
      const next = await totpNow(TEST_SECRET);
      const remaining = STEP - (Math.floor(Date.now() / 1000) % STEP);
      if (!alive) return;
      setCode(next);
      setLeft(remaining);
      onFill?.(next);
    }
    void tick();
    const id = window.setInterval(() => void tick(), 1000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [onFill]);

  const digits = (code || "000000").split("");

  return (
    <div className="rounded-2xl border border-[#eee8f4] bg-aya-bg px-4 py-3.5">
      <p className="font-display text-[11px] font-semibold tracking-wide text-aya-text">
        Compte test · code 2FA
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {digits.map((digit, index) => (
            <span
              key={`${index}-${digit}`}
              className="flex h-10 w-8 items-center justify-center rounded-lg bg-white font-display text-lg font-bold text-aya-ink shadow-[0_1px_2px_rgba(60,33,100,0.06)]"
            >
              {code ? digit : "·"}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-aya-pink">{left}s</span>
      </div>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-aya-pink transition-[width] duration-1000 ease-linear" style={{ width: `${(left / STEP) * 100}%` }} />
      </div>
    </div>
  );
}
