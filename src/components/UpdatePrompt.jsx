import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, X, Check } from '../lib/icons.js';

// Uses the framework-agnostic virtual module inside an effect with try/catch,
// so a service-worker/registration failure can never blank the app.
export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const updateFn = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('virtual:pwa-register');
        if (cancelled) return;
        const updateSW = mod.registerSW({
          immediate: true,
          onNeedRefresh() { if (!cancelled) setNeedRefresh(true); },
          onRegisteredSW(swUrl, r) { if (r) setInterval(() => { try { r.update(); } catch (_) {} }, 30 * 60 * 1000); },
        });
        updateFn.current = updateSW;
      } catch (e) {
        // PWA not available (e.g. some dev contexts) — ignore silently
        console.warn('PWA register skipped:', e && e.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!needRefresh || dismissed) return null;
  return (
    <div className="upd-banner">
      <div className="upd-ic"><RotateCcw size={17} /></div>
      <div className="upd-txt"><div className="upd-t">Update available</div><div className="upd-s">A new version of RIGGR is ready.</div></div>
      <button className="btn primary sm" onClick={() => { try { updateFn.current && updateFn.current(true); } catch (_) { window.location.reload(); } }}><Check size={15} />Reload</button>
      <button className="upd-x" onClick={() => setDismissed(true)} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}
