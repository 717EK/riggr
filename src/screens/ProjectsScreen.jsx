import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Ring, Empty } from '../components/Bits.jsx';
import { JobCard } from '../components/JobCard.jsx';

export function ProjectsScreen({ state, deptById, projById, ops }) {
  const [open, setOpen] = useState(null);
  if (open) { const pr = state.projects.find((p) => p.id === open); if (pr) return <ProjectDetail project={pr} state={state} deptById={deptById} ops={ops} onBack={() => setOpen(null)} />; }
  const fills = ['f-white', 'f-accent', 'f-olive'];
  return (
    <>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Projects</h2><span className="link" onClick={() => ops.setModal({ t: 'project' })}><Plus size={15} /> New</span></div>
      <div className="col-2">
      {state.projects.length === 0 ? <Empty icon={Folder} text="No projects yet — create one to group jobs" /> : state.projects.map((p, i) => {
        const js = state.jobs.filter((j) => j.projectId === p.id); const active = js.filter((j) => !['completed', 'terminated'].includes(j.status)).length;
        const denom = js.length - js.filter((j) => j.status === 'terminated').length; const pc = denom ? Math.round(js.filter((j) => j.status === 'completed').length / denom * 100) : 0;
        return (
          <div key={p.id} className={`pjcard ${fills[i % 3]}`} onClick={() => setOpen(p.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}><div className="cl">{p.client}{p.isRental ? ' · Rental' : ''}</div><div className="nm">{p.name}</div></div>
              <div className="big">{js.length}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, fontSize: 12.5, fontWeight: 600, opacity: .8, flexWrap: 'wrap' }}>
              <span>{active} active</span><span>·</span><span>{pc}% done</span>{p.location && <><span>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><MapPin size={12} />{p.location}</span></>}
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}

export function ProjectDetail({ project: p, state, deptById, ops, onBack }) {
  const js = state.jobs.filter((j) => j.projectId === p.id);
  const head = state.users.find((u) => u.id === p.headId);
  const cc = (s) => js.filter((j) => j.status === s).length;
  const denom = js.length - cc('terminated');
  const pct = denom ? Math.round(cc('completed') / denom * 100) : 0;
  const rentMoves = state.inventory.movements.filter((m) => m.projectId === p.id && m.rental);
  const rentMap = {};
  rentMoves.forEach((m) => { if (!rentMap[m.itemId]) rentMap[m.itemId] = { out: 0, ret: 0 }; if (m.kind === 'out') rentMap[m.itemId].out += m.qty; else rentMap[m.itemId].ret += m.qty; });
  const itemName = (id) => state.inventory.items.find((i) => i.id === id)?.name || 'Item';
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, marginBottom: 14 }}>
        <button className="ico-btn sq" onClick={onBack}><ChevronLeft size={18} /></button>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>{p.client}</div><h2 style={{ fontSize: 19 }}>{p.name}</h2></div>
        <button className="ico-btn sq" onClick={() => ops.setModal({ t: 'project', project: p })}><Pencil size={16} /></button>
      </div>
      <div className="hero" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Ring pct={pct} />
          <div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>{js.length} jobs · {p.isRental ? 'Rental project' : 'Production'}</div>
            <div className="heromet"><div className="m"><div className="mv">{cc('running')}</div><div className="mk">Running</div></div><div className="m"><div className="mv">{cc('awaiting')}</div><div className="mk">Approve</div></div><div className="m"><div className="mv" style={{ color: 'var(--accent)' }}>{cc('completed')}</div><div className="mk">Done</div></div></div>
          </div>
        </div>
      </div>
      <div className="row-between"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><HardHat size={18} color="var(--muted)" /><div><div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Project head / site manager</div><div style={{ fontWeight: 700 }}>{head ? head.name : 'Unassigned'}</div></div></div></div>
      {p.location && <div className="row-between"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={18} color="var(--muted)" /><div><div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Site</div><div style={{ fontWeight: 700 }}>{p.location}</div></div></div></div>}
      {p.isRental && <>
        <div className="sec-h"><h2>Gear on site</h2><span className="link" onClick={() => ops.setModal({ t: 'dispatch', project: p })}><Truck size={15} /> Dispatch</span></div>
        {Object.keys(rentMap).length === 0 ? <Empty icon={Package} text="Nothing dispatched yet" /> : Object.entries(rentMap).map(([id, r]) => { const onsite = r.out - r.ret; return (
          <div key={id} className="inv">
            <div className="nm">{itemName(id)}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}><span>Out {r.out}</span><span>Returned {r.ret}</span><span style={{ color: onsite > 0 ? 'var(--text)' : 'var(--muted)', fontWeight: 700 }}>On site {onsite}</span></div>
            {onsite > 0 && <div className="acts"><button className="btn info sm" onClick={() => ops.setModal({ t: 'return', project: p, itemId: id, max: onsite })}><ArrowDownRight size={15} />Return</button></div>}
          </div>
        ); })}
      </>}
      <div className="sec-h"><h2>Jobs · {js.length}</h2><span className="link" onClick={() => ops.setModal({ t: 'job', preProject: p.id })}><Plus size={15} /> Add</span></div>
      {js.length === 0 ? <Empty icon={ClipboardList} text="No jobs in this project yet" /> : js.map((j) => <JobCard key={j.id} job={j} deptById={deptById} projById={() => null} mode="admin" ops={ops} />)}
      <button className="btn ghost block" style={{ marginTop: 16, color: '#dc2626' }} onClick={() => { ops.deleteProject(p.id); onBack(); }}><Trash2 size={16} />Delete project</button>
    </>
  );
}
