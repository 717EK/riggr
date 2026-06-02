import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';

export function JobCard({ job: j, deptById, projById, mode, me, ops }) {
  const d = deptById(j.deptId), st = STATUS[j.status], pr = j.projectId && projById ? projById(j.projectId) : null;
  return (
    <div className="jc">
      <div className="r1"><span className="dept-dot" style={{ background: d.color }} /><span className="jno">{j.jobNo}</span><span className={`prio ${j.priority}`}>{j.priority}</span><span style={{ flex: 1 }} /><span className="chip" style={{ '--cc': st.c }}>{st.label}</span></div>
      <div className="ttl">{j.customer || 'Untitled'}</div>
      <div className="sub">{j.product} · {d.name}{j.process ? ` · ${j.process}` : ''}{j.qty ? ` · Qty ${j.qty}` : ''}</div>
      {pr && <div><span className="pjtag" style={{ '--cc': pr.color }}><Folder size={11} />{pr.name}</span></div>}
      <div className="meta">
        <div className="it"><span className="lab">Assigned</span><span className="val">{j.assigneeId ? <span className="assignee"><span className="avt sm" style={{ width: 20, height: 20, borderRadius: 6, fontSize: 8, background: d.color }}>{initials(j.operator || '?')}</span>{(j.operator || '').split(' ')[0] || 'User'}</span> : <span className="assignee"><Users size={13} /> All {d.name}</span>}</span></div>
        <div className="it"><span className="lab">Start</span><span className="val">{fmtT(j.startTime)}</span></div>
        <div className="it"><span className="lab">End</span><span className="val">{fmtT(j.endTime)}</span></div>
        <div className="it"><span className="lab">Date</span><span className="val">{fmtD(j.date)}</span></div>
      </div>
      {mode === 'user' && <div className="acts">
        {j.status === 'pending' && <button className="btn go" onClick={() => ops.startJob(j)}><Play size={15} />Start</button>}
        {j.status === 'running' && <><button className="btn ok" onClick={() => ops.markComplete(j)}><Flag size={15} />Mark complete</button><button className="btn ghost" onClick={() => ops.holdJob(j)}><Pause size={15} />Hold</button></>}
        {j.status === 'hold' && <button className="btn go" onClick={() => ops.resumeJob(j)}><Play size={15} />Resume</button>}
        {j.status === 'awaiting' && <span className="assignee" style={{ color: '#3b82f6' }}><Clock size={14} />Waiting for approval</span>}
        {j.status === 'completed' && <span className="assignee" style={{ color: '#3f7d22' }}><CheckCircle2 size={14} />Approved</span>}
        {j.status === 'terminated' && <span className="assignee" style={{ color: '#dc2626' }}><XCircle size={14} />Terminated</span>}
      </div>}
      {mode === 'admin' && <div className="acts">
        {j.status === 'awaiting' && <><button className="btn ok" onClick={() => ops.approve(j)}><CheckCircle2 size={15} />Approve</button><button className="btn info" onClick={() => ops.reactivate(j)}><RotateCcw size={15} />Reactivate</button></>}
        {j.status === 'completed' && <button className="btn ghost sm" onClick={() => ops.reactivate(j)}><RotateCcw size={14} />Reopen</button>}
        {j.status !== 'terminated' && <button className="btn ghost sm" onClick={() => ops.setModal({ t: 'job', job: j })}><Pencil size={14} />Edit</button>}
        {!['completed', 'terminated'].includes(j.status) && <button className="btn danger sm" onClick={() => ops.terminate(j)}><XCircle size={14} />Terminate</button>}
      </div>}
    </div>
  );
}

