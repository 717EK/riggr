import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { STATUS } from '../data/constants.js';
import { initials } from '../lib/helpers.js';

export const LOGO_BARS = [10, 18, 13, 24, 16, 21];
export function Logo({ size = 26 }) {
  return <div className="logobars" style={{ height: size }}>{LOGO_BARS.map((h, i) => <i key={i} style={{ height: `${(h / 24) * size}px` }} />)}</div>;
}
export const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

export function Avatar({ user, size, className = '', style = {}, onClick }) {
  const cls = `avt ${className}`;
  const st = size ? { width: size, height: size, ...style } : style;
  if (user && user.avatar) return <div className={cls} style={st} onClick={onClick}><img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>;
  return <div className={cls} style={st} onClick={onClick}>{initials(user ? user.name : '?')}</div>;
}

export function Ring({ pct }) { const r = 36, c = 2 * Math.PI * r, off = c - (pct / 100) * c; return <div className="ring"><svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}><circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="8" /><circle cx="42" cy="42" r={r} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .6s' }} /></svg><div className="pct" style={{ color: 'var(--hero-text)' }}>{pct}%</div></div>; }
export function Spill({ cls = '', icon: I, v, k, onClick }) { return <div className={`spill ${cls}`} onClick={onClick}><I size={20} className="ic2" style={{ color: 'var(--muted)' }} /><div><div className="v">{v}</div><div className="k">{k}</div></div></div>; }
export function Attn({ c, icon: I, t, s, onClick }) { return <div className="attn" onClick={onClick}><div className="a-ic" style={{ background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c }}><I size={18} /></div><div style={{ flex: 1 }}><div className="a-t">{t}</div><div className="a-s">{s}</div></div><CR size={17} color="var(--faint)" /></div>; }
export function MiniJob({ job: j, deptById, projById, onClick }) { const d = deptById(j.deptId), st = STATUS[j.status], pr = j.projectId ? projById(j.projectId) : null; return <div className="jc" onClick={onClick} style={{ cursor: 'pointer', marginBottom: 9, padding: 14 }}><div className="r1"><span className="dept-dot" style={{ background: d.color }} /><span className="jno">{j.jobNo}</span><span style={{ flex: 1 }} /><span className="chip" style={{ '--cc': st.c }}>{st.label}</span></div><div className="ttl" style={{ fontSize: 15.5 }}>{j.customer} · <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{j.product}</span></div><div className="sub">{d.name}{pr ? ` · ${pr.name}` : ''}{j.qty ? ` · Qty ${j.qty}` : ''}</div></div>; }

export function Empty({ icon: I, text }) { return <div className="empty"><div className="e-ic"><I size={24} /></div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{text}</div></div>; }

export function Row({ k, v, last }) { return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--line)' }}><span style={{ color: 'var(--muted)', fontSize: 13 }}>{k}</span><span style={{ fontWeight: 600, fontSize: 13.5 }}>{v}</span></div>; }
