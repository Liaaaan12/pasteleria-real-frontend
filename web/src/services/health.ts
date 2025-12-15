import api from './api';
import type { AxiosError } from 'axios';

export type EndpointCheckResult = {
  path: string;
  ok: boolean;
  status?: number;
  cause?: 'missing-base-url' | 'network' | 'cors' | 'timeout' | 'unauthorized' | 'not-found' | 'server-error' | 'unknown';
  message?: string;
};

function getBaseUrl(): string | undefined {
  return import.meta.env.VITE_API_URL as string | undefined;
}

export async function checkEndpoint(path: string): Promise<EndpointCheckResult> {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    return { path, ok: false, cause: 'missing-base-url', message: 'VITE_API_URL no configurado' };
  }

  try {
    const res = await api.get(path, { skipAuthRedirect: true });
    return { path, ok: true, status: res.status };
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status as number | undefined;
    const code = axiosErr.code as string | undefined;
    const msg = axiosErr.message as string | undefined;

    if (code === 'ECONNABORTED') {
      return { path, ok: false, cause: 'timeout', message: msg };
    }
    if (status === 401) {
      return { path, ok: false, status, cause: 'unauthorized', message: 'La API requiere autenticación para este endpoint' };
    }
    if (status === 404) {
      return { path, ok: false, status, cause: 'not-found', message: 'Endpoint no encontrado' };
    }
    if (status && status >= 500) {
      return { path, ok: false, status, cause: 'server-error', message: 'Error del servidor' };
    }

    // Network/CORS: no response object
    if (!status) {
      // Heurística: algunos navegadores reportan ERR_NETWORK para CORS
      const cause: EndpointCheckResult['cause'] = code === 'ERR_NETWORK' ? 'cors' : 'network';
      return { path, ok: false, cause, message: msg };
    }

    return { path, ok: false, status, cause: 'unknown', message: msg };
  }
}

export async function runApiStartupChecks(): Promise<void> {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.warn('[API] VITE_API_URL no configurado. Define web/.env.local con tu URL externa.');
    return;
  }

  const targets = ['/productos', '/regiones-comunas'];
  for (const path of targets) {
    try {
      const result = await checkEndpoint(path);
      if (result.ok) {
        console.info(`[API OK] ${path} (status ${result.status})`);
      } else {
        console.warn(`[API WARN] ${path} -> ${result.cause}${result.status ? ` (status ${result.status})` : ''}${result.message ? `: ${result.message}` : ''}`);
      }
    } catch {
      console.warn(`[API WARN] ${path} -> error inesperado`);
    }
  }
}
