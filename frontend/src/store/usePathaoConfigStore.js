import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

let inFlight = null;
let inFlightToken = null;
let cachedToken = null;

const usePathaoConfigStore = create((set, get) => ({
  storeId: null,
  loaded: false,
  loading: false,
  error: null,

  fetchConfig: async (token) => {
    if (!token) return null;

    const { loaded, storeId } = get();
    if (loaded && cachedToken === token) return storeId;

    if (inFlight && inFlightToken === token) return inFlight;

    inFlightToken = token;
    set({ loading: true, error: null });

    const request = axios
      .get(`${apiUrl}/pathao-config`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const nextStoreId = res.data?.data?.storeId ?? null;
        cachedToken = token;
        set({
          storeId: nextStoreId,
          loaded: true,
          loading: false,
          error: null,
        });
        return nextStoreId;
      })
      .catch((err) => {
        set({
          storeId: null,
          loaded: false,
          loading: false,
          error:
            err.response?.status === 403
              ? 'permission'
              : 'Unable to load Pathao configuration.',
        });
        return null;
      })
      .finally(() => {
        if (inFlight === request) {
          inFlight = null;
          inFlightToken = null;
        }
      });

    inFlight = request;
    return request;
  },

  reset: () => {
    cachedToken = null;
    inFlight = null;
    inFlightToken = null;
    set({ storeId: null, loaded: false, loading: false, error: null });
  },
}));

export default usePathaoConfigStore;
