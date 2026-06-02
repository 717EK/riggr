import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Empty } from '../components/Bits.jsx';

export function TeamScreen({ state, deptById, ops, me }) {
  const [tab, setTab] = useState('people');
  const employees = state.users.filter((u) => u.role !== 'admin');
  const reqs = state.requests || [];
  const totalReq = reqs.length + state.pendingUsers.length;
  return (
    <>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Team</h2>{tab === 'people' && <span className="link" onClick={() => ops.setModal({ t: 'employee' })}><UserPlus size={15} /> Add</span>}{tab === 'depts' && <span className="link" onClick={() => ops.setModal({ t: 'dept' })}><Plus size={15} /> Add</span>}</div>
      <div className="pill-tabs">
        <div className={`ptab ${tab === 'people' ? 'on' : ''}`} onClick={() => setTab('people')}>People</div>
        <div className={`ptab ${tab === 'requests' ? 'on' : ''}`} onClick={() => setTab('requests')}>Requests{totalReq > 0 && <span className="tb">{totalReq}</span>}</div>
        <div className={`ptab ${tab === 'depts' ? 'on' : ''}`} onClick={() => setTab('depts')}>Departments</div>
      </div>

      {tab === 'people' && (employees.length === 0 ? <Empty icon={Users} text="No team members yet" /> : employees.map((u) => { const d = deptById(u.deptId); return (
        <div key={u.id} className="trow"><div className="avt sm" style={{ background: d.color, color: '#fff' }}>{initials(u.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div className="nm">{u.name}</div><div className="un">{d.name}{u.hasAccess ? ` · @${u.username}` : ''}</div></div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>{!u.hasAccess && <span className="tag">No app</span>}{u.mustReset && <span className="tag accent">PIN pending</span>}{!u.active && <span className="tag off">Inactive</span>}<button className="ico-btn sq" onClick={() => ops.setModal({ t: 'employee', emp: u })}><Pencil size={15} /></button></div>
        </div>
      ); }))}

      {tab === 'requests' && (totalReq === 0 ? <Empty icon={Inbox} text="No pending requests" /> : <>
        {reqs.map((r) => (
          <div key={r.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><div className="n-ic" style={{ background: 'color-mix(in srgb,#caa531 16%,transparent)', color: '#a07f12' }}>{r.kind === 'job' ? <ClipboardList size={17} /> : <Folder size={17} />}</div><div style={{ flex: 1 }}><div className="nm" style={{ fontSize: 15 }}>{r.kind === 'job' ? (r.payload.product || 'Job request') : (r.payload.name || 'Project request')}</div><div className="un">{r.byName} · {r.kind} · {fmtD(r.ts)}</div></div></div>
            {r.note && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, fontStyle: 'italic' }}>“{r.note}”</div>}
            <div className="acts"><button className="btn primary sm" onClick={() => ops.setModal({ t: r.kind === 'job' ? 'reviewJobReq' : 'reviewProjReq', req: r })}><Check size={15} />Review</button><button className="btn danger sm" onClick={() => ops.declineGenRequest(r.id)}><X size={15} />Decline</button></div>
          </div>
        ))}
        {state.pendingUsers.map((p) => { const d = deptById(p.deptId); return (
          <div key={p.id} className="card" style={{ marginBottom: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><div className="avt sm" style={{ background: d.color, color: '#fff' }}>{initials(p.name)}</div><div style={{ flex: 1 }}><div className="nm" style={{ fontSize: 15 }}>{p.name}</div><div className="un">Access · {d.name} · {fmtD(p.requestedAt)}</div></div></div>
            {p.message && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, fontStyle: 'italic' }}>“{p.message}”</div>}
            <div className="acts"><button className="btn primary sm" onClick={() => ops.setModal({ t: 'approveReq', req: p })}><Check size={15} />Approve access</button><button className="btn danger sm" onClick={() => ops.declineRequest(p.id)}><X size={15} />Decline</button></div>
          </div>
        ); })}
      </>)}

      {tab === 'depts' && state.departments.map((d) => { const inUse = state.users.some((u) => u.deptId === d.id) || state.jobs.some((j) => j.deptId === d.id); return (
        <div key={d.id} className="trow"><span className="dept-dot" style={{ background: d.color, width: 14, height: 14 }} /><div style={{ flex: 1 }}><div className="nm" style={{ fontSize: 15 }}>{d.name}</div><div className="un">{state.users.filter((u) => u.deptId === d.id).length} members · {state.jobs.filter((j) => j.deptId === d.id).length} jobs</div></div>
          <button className="ico-btn sq" onClick={() => ops.setModal({ t: 'dept', dept: d })}><Pencil size={15} /></button><button className="ico-btn sq" style={{ opacity: inUse ? 0.4 : 1 }} disabled={inUse} onClick={() => !inUse && ops.deleteDept(d.id)}><Trash2 size={15} /></button>
        </div>
      ); })}
    </>
  );
}
