/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origine publique de l'API FastAPI. Jamais de secret. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
