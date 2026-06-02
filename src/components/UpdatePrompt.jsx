import React, { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RotateCcw, X, Check } from 'lucide-react';

export function UpdatePrompt() {
  const [dismissed, setDismissed] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // check for a new version every 30 min while the app is open
      if (r) setInterval(() => r.update(), 30 * 60 * 1000);
    },
  });

  if (needRefresh && !dismissed) {
    return (
      <div className="upd-banner">
        <div className="upd-ic"><RotateCcw size={17} /></div>
        <div className="upd-txt"><div className="upd-t">Update available</div><div className="upd-s">A new version of RIGGR is ready.</div></div>
        <button className="btn primary sm" onClick={() => updateServiceWorker(true)}><Check size={15} />Reload</button>
        <button className="upd-x" onClick={() => { setNeedRefresh(false); setDismissed(true); }} aria-label="Dismiss"><X size={16} /></button>
      </div>
    );
  }
  if (offlineReady && !dismissed) {
    return (
      <div className="upd-banner ready">
        <div className="upd-ic"><Check size={17} /></div>
        <div className="upd-txt"><div className="upd-t">Ready to work offline</div></div>
        <button className="upd-x" onClick={() => setOfflineReady(false)} aria-label="Dismiss"><X size={16} /></button>
      </div>
    );
  }
  return null;
}
