import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';

export function CalendarModal({ jobs, sel, onPick, onClose }) {
  const [m, setM] = useState(() => { const d = parseDK(sel); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const first = new Date(m.getFullYear(), m.getMonth(), 1);
  const startPad = (first.getDay() + 6) % 7;
  const dim = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...[...Array(dim)].map((_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1))];
  while (cells.length % 7) cells.push(null);
  const cnt = (d) => jobs.filter((j) => j.date === dk(d)).length;
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grip" />
        <div className="sh-h"><h3>{MO[m.getMonth()]} {m.getFullYear()}</h3>
          <div style={{ display: 'flex', gap: 6 }}><button className="ico-btn sq" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}><ChevronLeft size={17} /></button><button className="ico-btn sq" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}><ChevronRight size={17} /></button></div>
        </div>
        <div className="cal-grid" style={{ marginBottom: 6 }}>{WD.map((w) => <div key={w} className="cal-wd">{w}</div>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => { if (!d) return <div key={i} className="cal-d out" />; const k = dk(d); const n = cnt(d); const isT = k === dk(new Date()); return (
            <div key={i} className={`cal-d ${sel === k ? 'on' : ''} ${isT ? 'today' : ''}`} onClick={() => onPick(k)}>{d.getDate()}{n > 0 && <span className="cd">{n}</span>}</div>); })}
        </div>
        <button className="btn ghost block" style={{ marginTop: 18 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

