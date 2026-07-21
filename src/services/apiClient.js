import { ENDPOINTS } from '@/services/endpoints';

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const REFRESH_TOKEN_KEY = 'refreshToken';
const CORRELATION_ID_KEY = 'correlationId';
let accessToken = null;
let refreshPromise = null;

const uniqueId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const buildUrl = (path) => (/^https?:\/\//.test(path) ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

const correlationId = () => {
  let id = sessionStorage.getItem(CORRELATION_ID_KEY);
  if (!id) {
    id = uniqueId();
    sessionStorage.setItem(CORRELATION_ID_KEY, id);
  }
  return id;
};

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const tokenStorage = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => sessionStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens(tokens = {}) {
    accessToken = tokens.access_token || null;
    if (tokens.refresh_token) sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  },
  clear() {
    accessToken = null;
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('accessToken');
  },
};

const parseResponse = async (response, responseType) => {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (response.ok && (responseType === 'blob' || contentType.includes('spreadsheetml'))) return response.blob();
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  return text || null;
};

const validationMessage = (item) => {
  if (typeof item === 'string') return item;
  const field = Array.isArray(item?.loc) ? item.loc.at(-1) : null;
  const message = item?.msg || item?.message || 'Invalid value';
  return field && field !== 'body' ? `${field}: ${message}` : message;
};

const errorDetail = (data, fallback) => {
  const detail = data?.detail ?? data?.message;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(validationMessage).join(' · ');
  if (detail && typeof detail === 'object') return validationMessage(detail);
  return fallback;
};

const toApiError = (response, data) => {
  const fallback = response.status >= 500
    ? 'Something went wrong on our end. Please try again in a few minutes.'
    : `Request failed with status ${response.status}.`;
  const detail = errorDetail(data, fallback);
  return new ApiError(data?.error_code ? `${detail} (${data.error_code})` : detail, response.status, data);
};

const execute = async (path, options) => {
  const { body, auth, responseType, headers: suppliedHeaders, returnResponse, skipRefresh: _skipRefresh, ...fetchOptions } = options;
  const headers = new Headers(suppliedHeaders);
  headers.set('Accept', headers.get('Accept') || 'application/json');
  headers.set('X-Request-ID', headers.get('X-Request-ID') || uniqueId());
  headers.set('X-Correlation-ID', headers.get('X-Correlation-ID') || correlationId());
  if (!(body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (auth && tokenStorage.getAccessToken()) headers.set('Authorization', `Bearer ${tokenStorage.getAccessToken()}`);

  let response;
  try {
    response = await fetch(buildUrl(path), {
      ...fetchOptions,
      credentials: 'include',
      headers,
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError('Unable to reach the API. Check the API URL and network connection.', 0, error);
  }

  const data = await parseResponse(response, responseType);
  if (!response.ok) throw toApiError(response, data);
  return returnResponse ? { data, response } : data;
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refreshToken = tokenStorage.getRefreshToken();
    refreshPromise = execute(ENDPOINTS.auth.refreshToken, {
      method: 'POST',
      auth: false,
      body: refreshToken ? { refresh_token: refreshToken } : undefined,
      responseType: 'json',
    })
      .then((tokens) => {
        tokenStorage.setTokens(tokens);
        return tokens;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

export async function apiRequest(path, options = {}) {
  const requestOptions = { auth: true, responseType: 'json', ...options };
  try {
    return await execute(path, requestOptions);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !requestOptions.auth || requestOptions.skipRefresh || !tokenStorage.getRefreshToken()) throw error;
    try {
      await refreshAccessToken();
      return await execute(path, { ...requestOptions, skipRefresh: true });
    } catch (refreshError) {
      tokenStorage.clear();
      window.dispatchEvent(new CustomEvent('auth-session-expired'));
      throw refreshError;
    }
  }
}
