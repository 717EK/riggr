import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Logo } from '../components/Bits.jsx';

export function Login({ state, commit, onLogin, deptById }) {
  const [mode, setMode] = useState('login');
  const [pin, setPin] = useState(''); const [err, setErr] = useState('');
  const submit = useCallback((code) => { const u = state.users.find((x) => x.pin === code && x.hasAccess); if (u && u.active) { onLogin(u); } else if (u && !u.active) { setErr('Account is inactive — contact admin'); setPin(''); } else { setErr('Invalid PIN'); setPin(''); } }, [state.users, onLogin]);
  useEffect(() => { if (pin.length === 4) submit(pin); }, [pin, submit]);
  if (mode === 'request') return <RequestAccess departments={state.departments} onBack={() => setMode('login')} onSubmit={(d) => { commit({ ...state, pendingUsers: [...state.pendingUsers, { id: uid('p'), requestedAt: nowISO(), ...d }] }); setMode('sent'); }} />;
  if (mode === 'sent') return <div className="login"><div className="lmark" style={{ background: '#5fa83a', color: '#fff' }}><Check size={28} /></div><h1 style={{ fontSize: 26 }}>Request sent</h1><p className="tag" style={{ maxWidth: 280 }}>Aashish will review your request and set up your login. Check back shortly.</p><div className="tlink" onClick={() => setMode('login')}>Back to login</div></div>;
  return (
    <div className="login">
      <div className="lmark"><Logo size={30} /></div>
      <h1>{APP_NAME}</h1>
      <div className="tag">Job control for Giant Truss</div>
      <div className="pins">{[0, 1, 2, 3].map((i) => <div key={i} className={`pd ${i < pin.length ? 'f' : ''}`} />)}</div>
      <div className="kp">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <button key={d} className="k" onClick={() => { setErr(''); pin.length < 4 && setPin(pin + d); }}>{d}</button>)}
        <button className="k fn" onClick={() => setPin('')}><Delete size={19} /></button>
        <button className="k" onClick={() => { setErr(''); pin.length < 4 && setPin(pin + '0'); }}>0</button>
        <button className="k fn" onClick={() => submit(pin)}><CornerDownLeft size={19} /></button>
      </div>
      <div className="lerr">{err}</div>
      <div className="tlink" onClick={() => setMode('request')}>Request access</div>
      <div className="lhint"><b>Demo logins</b><br />Aashish (owner) <code>1234</code> · Ravi/Rigging <code>1111</code> · Suresh/Fabrication <code>3333</code> · Manoj/Powder <code>4444</code><br />New hire (forced PIN reset) Karan/Rental <code>9999</code></div>
    </div>
  );
}

export function RequestAccess({ departments, onBack, onSubmit }) {
  const [name, setName] = useState(''); const [deptId, setDeptId] = useState(departments[0]?.id); const [message, setMessage] = useState('');
  return (
    <div className="scroll" style={{ padding: '30px 26px' }}>
      <div className="lmark" style={{ margin: '0 0 18px' }}><UserPlus size={26} /></div>
      <h1 style={{ fontSize: 24 }}>Request access</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4, marginBottom: 24 }}>Fill this in — an admin reviews and approves.</p>
      <div className="field"><label>Full name *</label><input className="in" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
      <div className="field"><label>Department</label><select className="sel" value={deptId} onChange={(e) => setDeptId(e.target.value)}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      <div className="field"><label>Message (optional)</label><input className="in" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Role / who referred you" /></div>
      <button className="btn primary block" disabled={!name.trim()} onClick={() => onSubmit({ name: name.trim(), deptId, message: message.trim() })}>Send request</button>
      <button className="btn ghost block" style={{ marginTop: 10 }} onClick={onBack}>Cancel</button>
    </div>
  );
}

export function ForceReset({ me, users, onDone }) {
  const [n1, setN1] = useState(''); const [n2, setN2] = useState(''); const [err, setErr] = useState('');
  const taken = users.filter((u) => u.id !== me.id).map((u) => u.pin);
  const submit = () => {
    if (!/^\d{4}$/.test(n1)) return setErr('PIN must be 4 digits');
    if (n1 === me.pin) return setErr('Choose a PIN different from the temporary one');
    if (n1 !== n2) return setErr('PINs don’t match');
    if (taken.includes(n1)) return setErr('That PIN is in use, pick another');
    onDone(n1);
  };
  return (
    <div className="login">
      <div className="lmark" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}><KeyRound size={26} /></div>
      <h1 style={{ fontSize: 23 }}>Set your PIN</h1>
      <p style={{ maxWidth: 290 }}>Welcome, {me.name.split(' ')[0]}. For security, create your own 4-digit PIN before continuing.</p>
      <div style={{ width: '100%', maxWidth: 320, textAlign: 'left' }}>
        <div className="field"><label>New PIN</label><input className="in" type="password" inputMode="numeric" maxLength={4} value={n1} onChange={(e) => { setErr(''); setN1(e.target.value.replace(/\D/g, '')); }} placeholder="••••" /></div>
        <div className="field"><label>Confirm PIN</label><input className="in" type="password" inputMode="numeric" maxLength={4} value={n2} onChange={(e) => { setErr(''); setN2(e.target.value.replace(/\D/g, '')); }} placeholder="••••" /></div>
        {err && <div className="lerr" style={{ marginTop: 0, marginBottom: 12 }}>{err}</div>}
        <button className="btn primary block" onClick={submit}>Set PIN & continue</button>
      </div>
    </div>
  );
}
