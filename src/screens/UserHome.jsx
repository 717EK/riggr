import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Empty } from '../components/Bits.jsx';
import { JobCard } from '../components/JobCard.jsx';
import { Visualizer } from '../components/Visualizer.jsx';

export function UserHome({ jobs, me, deptById, projById, ops }) {
  const [show, setShow] = useState('active');
  const [mode, setMode] = useState('day');
  const [selKey, setSelKey] = useState(currentKey('day'));
  const active = jobs.filter((j) => ['pending', 'running', 'hold', 'awaiting'].includes(j.status));
  const history = jobs.filter((j) => ['completed', 'terminated'].includes(j.status));
  const list = show === 'active' ? active : history;
  return (
    <>
      <div style={{ marginTop: 4, marginBottom: 6 }}><Visualizer jobs={jobs} mode={mode} setMode={setMode} selKey={selKey} setSelKey={setSelKey} /></div>
      <div className="hero" style={{ marginBottom: 16 }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Your work today</div><div className="heromet" style={{ marginTop: 10 }}><div className="m"><div className="mv">{active.filter((j) => j.status === 'running').length}</div><div className="mk">Running</div></div><div className="m"><div className="mv">{active.filter((j) => j.status === 'pending').length}</div><div className="mk">To start</div></div><div className="m"><div className="mv" style={{ color: 'var(--accent)' }}>{jobs.filter((j) => j.status === 'completed' && j.date === dk(new Date())).length}</div><div className="mk">Done today</div></div></div></div>
      <div className="sec-h"><h2>Your jobs</h2><span className="link" onClick={ops.exportXlsx}><Download size={15} /> Export</span></div>
      <div className="pill-tabs"><div className={`ptab ${show === 'active' ? 'on' : ''}`} onClick={() => setShow('active')}>Active{active.length > 0 && <span className="tb">{active.length}</span>}</div><div className={`ptab ${show === 'history' ? 'on' : ''}`} onClick={() => setShow('history')}>History</div></div>
      {list.length === 0 ? <Empty icon={CheckCircle2} text={show === 'active' ? 'All clear — no active jobs' : 'Nothing in history yet'} /> : list.map((j) => <JobCard key={j.id} job={j} deptById={deptById} projById={projById} mode="user" me={me} ops={ops} />)}
    </>
  );
}
