import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';

export function Visualizer({ jobs, mode, setMode, selKey, setSelKey }) {
  const scroller = useRef(null);
  const raf = useRef(0);
  const lockUntil = useRef(0);
  const buckets = useMemo(() => buildBuckets(jobs, mode), [jobs, mode]);
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const selIndex = buckets.findIndex((b) => b.key === selKey);
  const sel = buckets[selIndex] || buckets.find((b) => b.isNow) || buckets[0];

  const centerOn = (key, smooth) => {
    const sc = scroller.current; if (!sc) return;
    const el = sc.querySelector(`[data-key="${(window.CSS && window.CSS.escape) ? window.CSS.escape(key) : key}"]`);
    if (!el) return;
    const target = Math.max(0, el.offsetLeft + el.offsetWidth / 2 - sc.clientWidth / 2);
    lockUntil.current = Date.now() + (smooth ? 700 : 140); // ignore scroll handler while we move
    sc.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  };
  // Tap: set selection, then center AFTER the re-render paints (double rAF so the
  // newly-selected bar's width change is reflected in offsetLeft before we measure).
  const pick = (key) => {
    setSelKey(key);
    lockUntil.current = Date.now() + 800; // pre-lock so the scroll handler doesn't fight us
    requestAnimationFrame(() => requestAnimationFrame(() => {
      centerOn(key, true);
      // re-center once more after the smooth scroll settles, in case widths shifted
      setTimeout(() => centerOn(key, true), 120);
    }));
  };

  useEffect(() => { const id = setTimeout(() => centerOn(selKey, false), 60); return () => clearTimeout(id); /* eslint-disable-next-line */ }, [mode]);
  useEffect(() => { const id = setTimeout(() => centerOn(selKey, false), 80); return () => clearTimeout(id); /* eslint-disable-next-line */ }, []);

  const onScroll = () => {
    if (Date.now() < lockUntil.current) return; // a programmatic center is in progress
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const sc = scroller.current; if (!sc) return;
      const mid = sc.scrollLeft + sc.clientWidth / 2;
      let best = null, bd = Infinity;
      sc.querySelectorAll('[data-key]').forEach((el) => { const cx = el.offsetLeft + el.offsetWidth / 2; const d = Math.abs(cx - mid); if (d < bd) { bd = d; best = el.dataset.key; } });
      if (best && best !== selKey) setSelKey(best);
    });
  };

  return (
    <div className="viz">
      <div className="viz-top">
        <div className="viz-sel"><div className="lab">{sel ? sel.label : '—'}</div><div className="cnt">{sel ? `${sel.count} ${sel.count === 1 ? 'job' : 'jobs'}` : ''}</div></div>
        <div className="seg-modes">{['day', 'week', 'month'].map((m) => <button key={m} className={mode === m ? 'on' : ''} onClick={() => { setMode(m); setSelKey(currentKey(m)); }}>{m[0].toUpperCase() + m.slice(1)}</button>)}</div>
      </div>
      <div className="viz-plot">
        <div className="viz-mid" />
        <div className="bars" ref={scroller} onScroll={onScroll}>
          {buckets.map((b, i) => {
            const h = 7 + (b.count / maxCount) * 74;
            const isSel = b.key === selKey;
            const played = selIndex >= 0 && i <= selIndex;
            return (
              <div key={b.key} className="barwrap" data-key={b.key} onClick={() => pick(b.key)}>
                <div className="bar-col">
                  <div className={`bar-n ${b.count > 0 ? 'show' : ''}`} style={{ bottom: h + 5 }}>{b.count > 0 ? b.count : ''}</div>
                  <div className={`bar ${played ? 'on' : ''} ${isSel ? 'sel' : ''}`} style={{ height: h }} />
                </div>
                <div className={`bar-x ${isSel ? 'sel' : ''}`}>{b.top && <div>{b.top}</div>}<div>{b.mid}</div><div style={{ opacity: .7 }}>{b.bot}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

