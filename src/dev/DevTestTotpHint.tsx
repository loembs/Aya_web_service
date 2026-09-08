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

export function isDevTestStaff(email: string): boolean {
  return import.meta.env.DEV && email.trim().toLowerCase() === TEST_EMAIL;
}

export function DevTestTotpHint({ onFill }: { onFill: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(STEP);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let alive = true;
    async function tick() {
      const next = await totpNow(TEST_SECRET);
      const remaining = STEP - (Math.floor(Date.now() / 1000) % STEP);
      if (alive) {
        setCode(next);
        setLeft(remaining);
        onFill(next);
      }
    }
    void tick();
    const id = window.setInterval(() => void tick(), 1000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [onFill]);

  if (!import.meta.env.DEV) return null;

  return (
    <p className="text-xs text-aya-text">
      Compte test : le code est saisi tout seul ({left}s){" "}
      <span className="font-mono font-semibold text-aya-ink">{code}</span>
    </p>
  );
}
