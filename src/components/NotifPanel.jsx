import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Empty } from './Bits.jsx';

export function NotifPanel({ notifs, onClose, onRead }) {
  const map = {
    approval: { I: AlertTriangle, c: '#3b82f6', t: (n) => <><b>{n.by}</b> marked <b>{n.jobNo}</b> complete — needs approval</> },
    approved: { I: CheckCircle2, c: '#5fa83a', t: (n) => <><b>{n.jobNo}</b> approved by <b>{n.by}</b></> },
    reactivated: { I: RotateCcw, c: '#f4a52a', t: (n) => <><b>{n.jobNo}</b> reactivated — back on the floor</> },
    terminated: { I: XCircle, c: '#ef4444', t: (n) => <><b>{n.jobNo}</b> terminated by <b>{n.by}</b></> },
    assigned: { I: Plus, c: '#5fa83a', t: (n) => <>New job <b>{n.jobNo}</b> assigned to you</> },
    request: { I: Inbox, c: '#caa531', t: (n) => <><b>{n.by}</b> sent a request to approve</> },
    reqApproved: { I: Check, c: '#5fa83a', t: (n) => <>Your request was approved{n.jobNo ? <> — <b>{n.jobNo}</b></> : ''}</> },
    updateReq: { I: Bell, c: '#3b82f6', t: (n) => <><b>{n.by}</b> asked for an update on <b>{n.jobNo || n.projectName}</b>{n.note ? <>: “{n.note}”</> : <> — status please</>}</> },
  };
  return (
    <div className="pscrim" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="sh-h"><h3>Notifications</h3><button className="ico-btn" style={{ width: 34, height: 34 }} onClick={onClose}><X size={17} /></button></div>
        {notifs.length > 0 && <button className="btn ghost sm block" style={{ marginBottom: 12 }} onClick={onRead}>Mark all read</button>}
        {notifs.length === 0 ? <Empty icon={Bell} text="No notifications" /> : notifs.map((n) => { const m = map[n.type] || map.assigned; const I = m.I; return (
          <div key={n.id} className={`notif ${n.read ? '' : 'un'}`}><div className="n-ic" style={{ background: `color-mix(in srgb, ${m.c} 14%, transparent)`, color: m.c }}><I size={17} /></div><div style={{ flex: 1 }}><div className="nt">{m.t(n)}</div><div className="nm">{fmtD(n.ts)} · {fmtT(n.ts)}</div></div></div>); })}
      </div>
    </div>
  );
}

