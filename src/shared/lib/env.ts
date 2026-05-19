export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl().length > 0;
}

export function getMasterEmail(): string {
  return (import.meta.env.VITE_MASTER_EMAIL ?? '').trim().toLowerCase();
}

export function getMasterPassword(): string {
  return import.meta.env.VITE_MASTER_PASSWORD ?? '';
}

export function isMasterConfigured(): boolean {
  return getMasterEmail().length > 0 && getMasterPassword().length > 0;
}
