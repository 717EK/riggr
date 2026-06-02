import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Ring, Spill, Attn, MiniJob, Empty } from '../components/Bits.jsx';
import { Visualizer } from '../components/Visualizer.jsx';
import { CalendarModal } from '../components/CalendarModal.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const reqCountLocal = (state) => (state.requests || []).length + state.pendingUsers.length;

export function AdminHome({ state, deptById, projById, approvals, lowStock, ops }) {
  const [mode, setMode] = useState('day');
  const [selKey, setSelKey] = useState(currentKey('day'));
  const [projFilter, setProjFilter] = useState('all');
  const [calOpen, setCalOpen] = useState(false);

  const scoped = projFilter === 'all' ? state.jobs : state.jobs.filter((j) => j.projectId === projFilter);
  const buckets = useMemo(() => buildBuckets(scoped, mode), [scoped, mode]);
  const selBucket = buckets.find((b) => b.key === selKey) || buckets.find((b) => b.isNow);
  const bucketJobs = scoped.filter((j) => jobInBucket(j, selBucket));

  const counts = useMemo(() => { const c = (s) => scoped.filter((j) => j.status === s).length; return { total: scoped.length, ...Object.fromEntries(Object.keys(STATUS).map((k) => [k, c(k)])) }; }, [scoped]);
  const totalActive = counts.total - counts.terminated;
  const pct = totalActive ? Math.round((counts.completed / totalActive) * 100) : 0;
  const statusData = Object.keys(STATUS).filter((k) => counts[k] > 0).map((k) => ({ name: STATUS[k].label, value: counts[k], c: STATUS[k].c }));
  const deptLoad = state.departments.map((d) => ({ ...d, n: scoped.filter((j) => j.deptId === d.id && !['completed', 'terminated'].includes(j.status)).length }));
  const maxLoad = Math.max(1, ...deptLoad.map((d) => d.n));
  const trend = [...Array(7)].map((_, i) => { const d = addDays(new Date(), i - 6); return { v: scoped.filter((j) => j.status === 'completed' && j.date === dk(d)).length }; });

  const pref = ops.pref || {};
  const [editing, setEditing] = useState(false);
  const dragIx = useRef(null);

  const DEFAULT_ORDER = ['volume', 'selected', 'overview', 'stats', 'attention', 'team', 'insights', 'trend'];
  const order = (() => {
    const saved = Array.isArray(pref.dashOrder) ? pref.dashOrder.filter((k) => DEFAULT_ORDER.includes(k)) : [];
    return [...saved, ...DEFAULT_ORDER.filter((k) => !saved.includes(k))];
  })();
  const saveOrder = (next) => ops.setPrefs({ ...pref, dashOrder: next });
  const move = (key, dir) => { const i = order.indexOf(key); const j = i + dir; if (j < 0 || j >= order.length) return; const n = [...order]; [n[i], n[j]] = [n[j], n[i]]; saveOrder(n); };
  const onDrop = (key) => { const from = dragIx.current; const to = order.indexOf(key); if (from == null || from === to) return; const n = [...order]; const [m] = n.splice(from, 1); n.splice(to, 0, m); saveOrder(n); dragIx.current = null; };

  const hasAttention = approvals.length > 0 || lowStock.length > 0 || state.pendingUsers.length > 0 || (state.requests || []).length > 0;

  const sections = {
    volume: { wide: true, node: (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
          <h2 style={{ fontSize: 17 }}>Job volume</h2>
          <button className="ico-btn sq" onClick={() => setCalOpen(true)}><Cal size={16} /></button>
        </div>
        <Visualizer jobs={scoped} mode={mode} setMode={setMode} selKey={selKey} setSelKey={setSelKey} />
      </>
    ) },
    selected: { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>{selBucket ? selBucket.label : 'Selected'}</h2><span className="link" onClick={() => ops.setScreen('jobs')}>All jobs <CR size={14} /></span></div>
        {bucketJobs.length === 0 ? <Empty icon={Cal} text="No jobs in this period" /> : bucketJobs.slice(0, 6).map((j) => <MiniJob key={j.id} job={j} deptById={deptById} projById={projById} onClick={() => ops.setModal({ t: 'jobview', job: j })} />)}
      </>
    ) },
    overview: { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>Overview</h2></div>
        <div className="hero" style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring pct={pct} />
            <div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Completion rate</div>
              <div className="heromet"><div className="m"><div className="mv">{counts.running}</div><div className="mk">Running</div></div><div className="m"><div className="mv">{counts.pending}</div><div className="mk">Pending</div></div><div className="m"><div className="mv" style={{ color: 'var(--accent)' }}>{counts.completed}</div><div className="mk">Done</div></div></div>
            </div>
          </div>
        </div>
      </>
    ) },
    stats: { node: (
      <div className="pillrow">
        <Spill cls="accent" icon={ShieldCheck} v={approvals.length} k="Awaiting approval" onClick={() => ops.setScreen('jobs')} />
        <Spill icon={Pause} v={counts.hold} k="On hold" onClick={() => ops.setScreen('jobs')} />
        <Spill cls="olive" icon={AlertTriangle} v={lowStock.length} k="Low stock" onClick={() => ops.setScreen('stock')} />
        <Spill icon={UserPlus} v={state.pendingUsers.length} k="Access requests" onClick={() => ops.setScreen('team')} />
      </div>
    ) },
    attention: hasAttention ? { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>Needs attention</h2></div>
        {approvals.map((j) => <Attn key={j.id} c="#3b82f6" icon={Flag} t={`${j.jobNo} ready for approval`} s={`${j.operator || 'Operator'} · ${deptById(j.deptId).name}`} onClick={() => ops.setScreen('jobs')} />)}
        {(state.requests || []).map((r) => <Attn key={r.id} c="#caa531" icon={Inbox} t={`${r.byName} requested ${r.kind === 'job' ? 'a job' : 'a project'}`} s={r.payload?.customer || r.payload?.name || r.note || ''} onClick={() => ops.setScreen('team')} />)}
        {state.pendingUsers.map((p) => <Attn key={p.id} c="#5fa83a" icon={UserPlus} t={`${p.name} requested access`} s={deptById(p.deptId).name} onClick={() => ops.setScreen('team')} />)}
        {lowStock.map((i) => <Attn key={i.id} c="#ef4444" icon={Boxes} t={`${i.name} running low`} s={`${i.qty} ${i.unit} left · min ${i.minLevel}`} onClick={() => ops.setScreen('stock')} />)}
      </>
    ) } : null,
    team: { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>Team</h2><span className="link" onClick={() => ops.setScreen('team')}>Manage <CR size={14} /></span></div>
        <div className="card team-card" onClick={() => ops.setScreen('team')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {state.users.filter((u) => u.role !== 'admin').slice(0, 4).map((u, i) => <div key={u.id} className="avt sm" style={{ background: deptById(u.deptId).color, color: '#fff', marginLeft: i ? -10 : 0, border: '2px solid var(--card)', width: 32, height: 32, borderRadius: 10 }}>{initials(u.name)}</div>)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16 }}>{state.users.filter((u) => u.role !== 'admin').length} members</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{state.departments.length} departments{reqCountLocal(state) > 0 ? ` · ${reqCountLocal(state)} pending` : ''}</div>
            </div>
            <CR size={18} color="var(--faint)" />
          </div>
        </div>
      </>
    ) },
    insights: statusData.length > 0 ? { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>Status mix</h2></div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ height: 168 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">{statusData.map((e, i) => <Cell key={i} fill={e.c} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.15)', fontFamily: 'Hanken Grotesk', fontSize: 13 }} /></PieChart></ResponsiveContainer></div>
          <div className="legend">{statusData.map((e) => <span key={e.name} className="lg"><span className="sw" style={{ background: e.c }} />{e.name} · {e.value}</span>)}</div>
        </div>
      </>
    ) } : null,
    trend: { node: (
      <>
        <div className="sec-h" style={{ marginTop: 0 }}><h2>Department load</h2></div>
        <div className="card" style={{ marginBottom: 14 }}><div className="lds">{deptLoad.map((d) => <div key={d.id} className="ld"><div className="nm"><span className="dept-dot" style={{ background: d.color }} />{d.name}</div><div className="track"><div className="fill" style={{ width: `${(d.n / maxLoad) * 100}%`, background: d.color }} /></div><div className="ct">{d.n}</div></div>)}</div></div>
        <div className="sec-h"><h2>Completed · last 7 days</h2></div>
        <div className="card"><div style={{ height: 110 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs><Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.15)', fontSize: 13 }} /><Area type="monotone" dataKey="v" stroke="var(--accent)" strokeWidth={2.5} fill="url(#g)" /></AreaChart></ResponsiveContainer></div></div>
      </>
    ) },
  };

  const visible = order.filter((k) => sections[k]);

  return (
    <>
      <div className="pill-tabs" style={{ marginTop: 4, marginBottom: 12 }}>
        <div className={`ptab ${projFilter === 'all' ? 'on' : ''}`} onClick={() => setProjFilter('all')}>All projects</div>
        {state.projects.map((p) => <div key={p.id} className={`ptab ${projFilter === p.id ? 'on' : ''}`} onClick={() => setProjFilter(p.id)}><span className="dept-dot" style={{ background: p.color }} />{p.name}</div>)}
      </div>

      <div className="dash-bar">
        <h2 style={{ fontSize: 15, color: 'var(--muted)' }}>{editing ? 'Drag or use arrows to reorder' : ''}</h2>
        <button className={`btn ghost sm ${editing ? '' : ''}`} onClick={() => setEditing(!editing)} style={editing ? { background: 'var(--hero)', color: 'var(--hero-text)' } : {}}>{editing ? <><Check size={14} />Done</> : <><Layers size={14} />Edit layout</>}</button>
      </div>

      <div className={`dash-flow ${editing ? 'editing' : ''}`}>
        {visible.map((key, i) => (
          <div
            key={key}
            className={`dash-sec ${sections[key].wide ? 'wide' : ''}`}
            draggable={editing}
            onDragStart={() => { dragIx.current = i; }}
            onDragOver={(e) => { if (editing) e.preventDefault(); }}
            onDrop={() => onDrop(key)}
          >
            {editing && (
              <div className="dash-handle">
                <span className="dh-grip"><Layers size={13} /> {key}</span>
                <span style={{ flex: 1 }} />
                <button className="ico-btn sq" onClick={() => move(key, -1)} disabled={i === 0}><ChevronLeft size={15} style={{ transform: 'rotate(90deg)' }} /></button>
                <button className="ico-btn sq" onClick={() => move(key, 1)} disabled={i === visible.length - 1}><ChevronRight size={15} style={{ transform: 'rotate(90deg)' }} /></button>
              </div>
            )}
            {sections[key].node}
          </div>
        ))}
      </div>

      {calOpen && <CalendarModal jobs={scoped} sel={mode === 'day' ? selKey : currentKey('day')} onPick={(k) => { setMode('day'); setSelKey(k); setCalOpen(false); }} onClose={() => setCalOpen(false)} />}
    </>
  );
}
