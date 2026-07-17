import { AUTH_CONFIG } from '@/config/authConfig';

const STORAGE_KEY = 'auth-master-data';
const EVENT_NAME = 'master-data-change';

const initialData = () => ({
  segments: AUTH_CONFIG.registrationMasters.segments.map((name) => ({ id: crypto.randomUUID(), name, active: true })),
  channels: AUTH_CONFIG.registrationMasters.channels.map((name) => ({ id: crypto.randomUUID(), name, active: true })),
  brands: AUTH_CONFIG.registrationMasters.brands.map((name) => ({ id: crypto.randomUUID(), name, active: true })),
});

const read = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  const data = initialData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
};

const write = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_NAME));
  return data;
};

export const masterDataService = {
  eventName: EVENT_NAME,
  getAll: read,
  create(type, name) {
    const data = read();
    data[type].push({ id: crypto.randomUUID(), name: name.trim(), active: true });
    return write(data);
  },
  update(type, id, changes) {
    const data = read();
    data[type] = data[type].map((item) => item.id === id ? { ...item, ...changes } : item);
    return write(data);
  },
};
