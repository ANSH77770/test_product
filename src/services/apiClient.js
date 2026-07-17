const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const buildUrl = (path) => {
  if (/^https?:\/\//.test(path)) return path;
  return `${configuredBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseResponse = async (response, responseType) => {
  if (response.status === 204) return null;
  if (responseType === 'blob') return response.blob();
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  return text || null;
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const tokenStorage = {
  get: () => sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken'),
  set(token, remember = false) {
    this.clear();
    (remember ? localStorage : sessionStorage).setItem('accessToken', token);
  },
  clear() {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('accessToken');
  },
};

export async function apiRequest(path, options = {}) {
  const { body, auth = true, responseType = 'json', headers: suppliedHeaders, ...fetchOptions } = options;
  const headers = new Headers(suppliedHeaders);
  const token = auth ? tokenStorage.get() : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (body !== undefined && !(body instanceof FormData)) headers.set('Content-Type', 'application/json');

  let response;
  try {
    response = await fetch(buildUrl(path), {
      ...fetchOptions,
      headers,
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError('Unable to reach the API. Check the API URL and network connection.', 0, error);
  }

  const data = await parseResponse(response, responseType);
  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, data);
  }
  return data;
}
