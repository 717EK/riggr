import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { Empty } from '../components/Bits.jsx';
import { JobCard } from '../components/JobCard.jsx';

export function JobsScreen({ state, deptById, projById, approvals, ops }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const tabs = [{ id: 'all', label: 'All' }, { id: 'awaiting', label: 'Approvals', n: approvals.length }, { id: 'running', label: 'Running' }, { id: 'pending', label: 'Pending' }, { id: 'hold', label: 'On Hold' }, { id: 'completed', label: 'Done' }];
  let list = state.jobs;
  if (filter !== 'all') list = list.filter((j) => j.status === filter);
  if (q) list = list.filter((j) => `${j.jobNo} ${j.customer} ${j.product}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Jobs</h2><span className="link" onClick={ops.exportXlsx}><Download size={15} /> Export</span></div>
      <div style={{ position: 'relative', marginBottom: 12 }}><Search size={17} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--faint)' }} /><input className="in" style={{ paddingLeft: 40 }} placeholder="Search job, customer, product…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="pill-tabs">{tabs.map((t) => <div key={t.id} className={`ptab ${filter === t.id ? 'on' : ''}`} onClick={() => setFilter(t.id)}>{t.label}{t.n > 0 && <span className="tb">{t.n}</span>}</div>)}</div>
      <div className="col-2">
        {list.length === 0 ? <Empty icon={ClipboardList} text="No jobs here" /> : list.map((j) => <JobCard key={j.id} job={j} deptById={deptById} projById={projById} mode="admin" ops={ops} />)}
      </div>
    </>
  );
}
