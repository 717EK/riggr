import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Logo, Avatar } from '../components/Bits.jsx';

export function SettingsScreen({ me, deptById, ops, pref, setPrefs }) {
  const [about, setAbout] = useState(false);
  const d = me.deptId ? deptById(me.deptId) : null;
  return (
    <>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Settings</h2></div>
      <div className="card" style={{ textAlign: 'center', padding: 22, marginBottom: 16, position: 'relative', cursor: 'pointer' }} onClick={() => ops.setModal({ t: 'profile' })}>
        <button className="ico-btn sq" style={{ position: 'absolute', top: 14, right: 14 }}><Pencil size={15} /></button>
        <Avatar user={me} className="lg" style={{ margin: '0 auto 12px', background: d ? d.color : 'var(--hero)' }} />
        <div className="disp" style={{ fontSize: 20, fontWeight: 700 }}>{me.name}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 2 }}>{me.role === 'admin' ? 'Administrator' : d?.name} · @{me.username}{me.isUniversal ? ' · owner' : ''}</div>
      </div>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Appearance</h2></div>
      <div className="row-between"><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>{pref.mode === 'dark' ? <Moon size={19} /> : <Sun size={19} />}<div style={{ fontWeight: 700 }}>{pref.mode === 'dark' ? 'Dark' : 'Light'} mode</div></div><div className={`toggle ${pref.mode === 'dark' ? 'on' : ''}`} onClick={() => setPrefs({ ...pref, mode: pref.mode === 'dark' ? 'light' : 'dark' })} /></div>
      <div className="card" style={{ marginBottom: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}><Palette size={19} /><div style={{ fontWeight: 700 }}>Accent colour</div></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{ACCENTS.map((a) => <div key={a.id} onClick={() => setPrefs({ ...pref, accent: a.id })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}><div style={{ width: 40, height: 40, borderRadius: 13, background: a.c, boxShadow: pref.accent === a.id ? `0 0 0 3px var(--app), 0 0 0 5px ${a.c}` : 'inset 0 0 0 1px var(--line2)' }} /><span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>{a.name}</span></div>)}</div>
      </div>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Account</h2></div>
      <button className="btn ghost block" style={{ marginBottom: 10, justifyContent: 'flex-start', gap: 11 }} onClick={() => ops.setModal({ t: 'pin' })}><KeyRound size={17} />Change PIN</button>
      <button className="btn ghost block" style={{ marginBottom: 10, justifyContent: 'space-between', gap: 11 }} onClick={() => setAbout(!about)}><span style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Activity size={17} />About & changelog</span><span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700 }}>v{APP_VERSION}</span></button>
      {about && <div className="card" style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}><Logo size={22} /><div className="disp" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '.04em' }}>{APP_NAME}</div></div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Job control for Giant Truss · {APP_CODENAME} · v{APP_VERSION}</div>
        {CHANGELOG.map((c) => <div key={c.v} style={{ marginBottom: 12 }}><div style={{ fontWeight: 700, fontSize: 13 }}>v{c.v} · {c.name}</div><ul style={{ margin: '5px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{c.items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>)}
      </div>}
      <button className="btn ghost block" style={{ justifyContent: 'flex-start', gap: 11, color: '#dc2626' }} onClick={ops.logout}><LogOut size={17} />Log out</button>
    </>
  );
}
