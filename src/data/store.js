import { STATE_KEY, PREFS_KEY } from './constants.js';
import { seed } from './seed.js';

export const store = {
  async load() {
    if (typeof window !== 'undefined' && window.storage) {
      try { const r = await window.storage.get(STATE_KEY, true); if (r && r.value) return migrate(JSON.parse(r.value)); } catch (_) {}
      const s = seed(); try { await window.storage.set(STATE_KEY, JSON.stringify(s), true); } catch (_) {} return s;
    }
    if (!store._mem) store._mem = seed(); return store._mem;
  },
  async save(s) {
    if (typeof window !== 'undefined' && window.storage) { try { await window.storage.set(STATE_KEY, JSON.stringify(s), true); return; } catch (_) {} }
    store._mem = s;
  },
};
export const migrate = (s) => ({ projects: [], requests: [], ...s });

export const prefs = {
  async load() {
    if (typeof window !== 'undefined' && window.storage) { try { const r = await window.storage.get(PREFS_KEY, false); if (r && r.value) return JSON.parse(r.value); } catch (_) {} }
    return prefs._mem || { mode: 'light', accent: 'lime' };
  },
  async save(p) { prefs._mem = p; if (typeof window !== 'undefined' && window.storage) { try { await window.storage.set(PREFS_KEY, JSON.stringify(p), false); } catch (_) {} } },
};
