interface ImportMetaEnv {
  readonly VITE_APPLICATION_NAME: string;
  readonly VITE_CLIENT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}