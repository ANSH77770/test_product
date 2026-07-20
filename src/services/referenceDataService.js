import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';

const CACHE_KEY = 'referenceDataV1';
let cachedData = null;
let loadingPromise = null;

const readCache = () => {
  if (cachedData) return cachedData;
  try {
    cachedData = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
  }
  return cachedData;
};

const loadAll = async () => {
  const [segments, channels, brands, roles] = await Promise.all([
    apiRequest(ENDPOINTS.references.segments, { auth: false }),
    apiRequest(ENDPOINTS.references.channels, { auth: false }),
    apiRequest(ENDPOINTS.references.brands, { auth: false }),
    apiRequest(ENDPOINTS.references.roles, { auth: false }),
  ]);
  cachedData = {
    segments: segments.items || [],
    channels: channels.items || [],
    brands: brands.items || [],
    roles: roles.items || [],
  };
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
  return cachedData;
};

export const referenceDataService = {
  getAll() {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
    if (!loadingPromise) loadingPromise = loadAll().finally(() => { loadingPromise = null; });
    return loadingPromise;
  },
  clearCache() {
    cachedData = null;
    sessionStorage.removeItem(CACHE_KEY);
  },
};
