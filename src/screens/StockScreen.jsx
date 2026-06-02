import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Empty } from '../components/Bits.jsx';

export function StockScreen({ state, deptById, ops }) {
  const [cat, setCat] = useState('rental');
  const [tab, setTab] = useState('items');
  const items = state.inventory.items.filter((i) => i.category === cat);
  const moves = state.inventory.movements.slice(0, 40);
  const itemName = (id) => state.inventory.items.find((i) => i.id === id)?.name || 'Item';
  return (
    <>
      <div className="sec-h" style={{ marginTop: 6 }}><h2>Inventory</h2><span className="link" onClick={() => ops.setModal({ t: 'item' })}><Plus size={15} /> Add item</span></div>
      <div className="pill-tabs"><div className={`ptab ${tab === 'items' ? 'on' : ''}`} onClick={() => setTab('items')}>Stock</div><div className={`ptab ${tab === 'moves' ? 'on' : ''}`} onClick={() => setTab('moves')}>Movements</div></div>
      {tab === 'items' ? <>
        <div className="pill-tabs">{Object.entries(CATS).map(([k, v]) => <div key={k} className={`ptab ${cat === k ? 'on' : ''}`} onClick={() => setCat(k)}>{v}</div>)}</div>
        {items.length === 0 ? <Empty icon={Boxes} text={`No ${CATS[cat].toLowerCase()} yet`} /> : items.map((i) => {
          const low = i.minLevel > 0 && i.qty <= i.minLevel; const d = i.deptId ? deptById(i.deptId) : null;
          return (
            <div key={i.id} className="inv">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}><div className="nm">{i.name}</div><div className="qb"><span className="q">{i.qty}</span><span className="u">{i.unit}</span>{low && <span className="low" style={{ marginLeft: 6 }}>Low</span>}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>{d && <span className="chip" style={{ '--cc': d.color }}><span className="dept-dot" style={{ background: d.color }} />{d.name}</span>}{cat === 'rental' && <span className="tag">{i.rentedOut || 0} on rent · {i.qty - (i.rentedOut || 0)} available</span>}</div>
                </div>
                <button className="ico-btn sq" onClick={() => ops.setModal({ t: 'item', item: i })}><Pencil size={15} /></button>
              </div>
              <div className="acts">{cat === 'rental' ? <>
                <button className="btn ok sm" onClick={() => ops.setModal({ t: 'move', item: i, kind: 'out', rental: true })}><ArrowUpRight size={15} />Rent out</button>
                <button className="btn info sm" onClick={() => ops.setModal({ t: 'move', item: i, kind: 'in', rental: true })}><ArrowDownRight size={15} />Return</button>
              </> : <>
                <button className="btn ok sm" onClick={() => ops.setModal({ t: 'move', item: i, kind: 'in' })}><ArrowDownRight size={15} />Stock in</button>
                <button className="btn danger sm" onClick={() => ops.setModal({ t: 'move', item: i, kind: 'out' })}><ArrowUpRight size={15} />Stock out</button>
              </>}</div>
            </div>
          );
        })}
      </> : (moves.length === 0 ? <Empty icon={Layers} text="No movements yet" /> : moves.map((m) => (
        <div key={m.id} className="trow"><div className="n-ic" style={{ background: m.kind === 'in' ? 'color-mix(in srgb,#5fa83a 14%,transparent)' : 'color-mix(in srgb,#ef4444 12%,transparent)', color: m.kind === 'in' ? '#3f7d22' : '#dc2626' }}>{m.kind === 'in' ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}</div>
          <div style={{ flex: 1 }}><div className="nm" style={{ fontSize: 14 }}>{itemName(m.itemId)}</div><div className="un">{m.rental ? (m.kind === 'out' ? 'Dispatched' : 'Returned') : (m.kind === 'in' ? 'Stock in' : 'Stock out')}{m.party ? ` · ${m.party}` : ''}</div></div>
          <div style={{ textAlign: 'right' }}><div className="disp" style={{ fontWeight: 700, color: m.kind === 'in' && !m.rental ? '#3f7d22' : 'var(--text)' }}>{m.kind === 'in' && !m.rental ? '+' : m.kind === 'out' && !m.rental ? '−' : ''}{m.qty}</div><div className="un">{fmtD(m.ts)}</div></div>
        </div>
      )))}
    </>
  );
}
