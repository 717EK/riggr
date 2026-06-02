import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from './lib/icons.js';
import { APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG, PRIORITIES, STATUS, CATS, ACCENTS } from './data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from './lib/helpers.js';
import { store, prefs, migrate } from './data/store.js';
import { seed } from './data/seed.js';
import { exportXlsx } from './data/exportXlsx.js';
import { themeVars } from './lib/theme.js';
import { CSS } from './styles.js';
import { Logo, greet, Ring, Spill, Attn, MiniJob, Empty, Row } from './components/Bits.jsx';
import { Visualizer } from './components/Visualizer.jsx';
import { CalendarModal } from './components/CalendarModal.jsx';
import { NotifPanel } from './components/NotifPanel.jsx';
import { JobCard } from './components/JobCard.jsx';
import { AdminHome } from './screens/AdminHome.jsx';
import { JobsScreen } from './screens/JobsScreen.jsx';
import { ProjectsScreen } from './screens/ProjectsScreen.jsx';
import { StockScreen } from './screens/StockScreen.jsx';
import { TeamScreen } from './screens/TeamScreen.jsx';
import { UserHome } from './screens/UserHome.jsx';
import { SettingsScreen } from './screens/SettingsScreen.jsx';
import { Modals } from './forms/Modals.jsx';
import { Login, RequestAccess, ForceReset } from './auth/Login.jsx';

export default function App() {
  const [state, setState] = useState(null);
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState('home');
  const [panel, setPanel] = useState(false);
  const [modal, setModal] = useState(null);
  const [pref, setPref] = useState({ mode: 'light', accent: 'lime' });
  const ref = useRef(null); ref.current = state;

  useEffect(() => { const el = document.createElement('style'); el.textContent = CSS; document.head.appendChild(el); return () => { try { document.head.removeChild(el); } catch (_) {} }; }, []);
  useEffect(() => { let a = true; store.load().then((s) => a && setState(s)); prefs.load().then((p) => a && setPref(p)); const iv = setInterval(() => store.load().then((s) => a && setState(s)), 6000); return () => { a = false; clearInterval(iv); }; }, []);

  const commit = useCallback((next) => { setState(next); store.save(next); }, []);
  const setPrefs = useCallback((p) => { setPref(p); prefs.save(p); }, []);
  const vars = useMemo(() => themeVars(pref.mode, pref.accent), [pref]);

  if (!state) return <div className="gt" style={themeVars('light', 'lime')}><div className="shell"><div className="login"><span style={{ color: 'var(--muted)' }}>Loading…</span></div></div></div>;

  const deptById = (id) => state.departments.find((d) => d.id === id) || { name: '—', color: '#9a9b8f' };
  const projById = (id) => state.projects.find((p) => p.id === id) || null;

  /* ── auth gates ── */
  if (!session) return <div className="gt" style={vars}><div className="shell"><Login state={state} commit={commit} onLogin={setSession} /></div></div>;
  const me = state.users.find((u) => u.id === session.id) || session;
  if (me.mustReset) return <div className="gt" style={vars}><div className="shell"><ForceReset me={me} users={state.users} onDone={(pin) => commit({ ...ref.current, users: ref.current.users.map((u) => u.id === me.id ? { ...u, pin, mustReset: false } : u) })} /></div></div>;
  const isAdmin = me.role === 'admin';

  /* ── derived ── */
  const visibleJobs = isAdmin ? state.jobs : state.jobs.filter((j) => j.deptId === me.deptId && (j.assigneeId === null || j.assigneeId === me.id));
  const myNotifs = state.notifications.filter((n) => n.toUser === me.id || (n.toDept && n.toDept === me.deptId));
  const unread = myNotifs.filter((n) => !n.read).length;
  const approvals = state.jobs.filter((j) => j.status === 'awaiting');
  const lowStock = state.inventory.items.filter((i) => i.minLevel > 0 && i.qty <= i.minLevel);
  const reqCount = (state.requests || []).length + state.pendingUsers.length;

  /* ════ ops ════ */
  const patch = (id, p, h) => ({ ...ref.current, jobs: ref.current.jobs.map((j) => j.id === id ? { ...j, ...p, history: h ? [...(j.history || []), { ...h, ts: nowISO(), by: me.name }] : j.history } : j) });
  const notify = (next, n) => ({ ...next, notifications: [{ id: uid('n'), read: false, ts: nowISO(), ...n }, ...next.notifications] });
  const makeJob = (st, d) => { const n = st.meta.nextJobNo; const job = { id: uid('job'), jobNo: `J-${n}`, ...d, operator: d.assigneeId ? (st.users.find((u) => u.id === d.assigneeId)?.name || '') : '', status: 'pending', startTime: '', endTime: '', createdBy: me.id, createdAt: nowISO(), history: [{ ts: nowISO(), by: me.name, action: 'created' }] }; return { st: { ...st, jobs: [job, ...st.jobs], meta: { nextJobNo: n + 1 } }, job }; };
  const ops = {
    setModal, setScreen,
    startJob: (j) => commit(patch(j.id, { status: 'running', startTime: j.startTime || nowISO(), operator: j.operator || me.name }, { action: 'started' })),
    holdJob: (j) => commit(patch(j.id, { status: 'hold' }, { action: 'put on hold' })),
    resumeJob: (j) => commit(patch(j.id, { status: 'running' }, { action: 'resumed' })),
    markComplete: (j) => commit(notify(patch(j.id, { status: 'awaiting', endTime: nowISO(), operator: j.operator || me.name }, { action: 'marked complete' }), { toUser: 'u_aashish', type: 'approval', jobId: j.id, jobNo: j.jobNo, by: me.name })),
    approve: (j) => { let n = patch(j.id, { status: 'completed' }, { action: 'approved' }); n = { ...n, notifications: n.notifications.map((x) => x.jobId === j.id && x.type === 'approval' ? { ...x, read: true } : x) }; commit(notify(n, { ...(j.assigneeId ? { toUser: j.assigneeId } : { toDept: j.deptId }), type: 'approved', jobId: j.id, jobNo: j.jobNo, by: me.name })); },
    reactivate: (j) => { let n = patch(j.id, { status: 'running', endTime: '' }, { action: 'reactivated' }); n = { ...n, notifications: n.notifications.map((x) => x.jobId === j.id && x.type === 'approval' ? { ...x, read: true } : x) }; commit(notify(n, { ...(j.assigneeId ? { toUser: j.assigneeId } : { toDept: j.deptId }), type: 'reactivated', jobId: j.id, jobNo: j.jobNo, by: me.name })); },
    terminate: (j) => commit(notify(patch(j.id, { status: 'terminated' }, { action: 'terminated' }), { ...(j.assigneeId ? { toUser: j.assigneeId } : { toDept: j.deptId }), type: 'terminated', jobId: j.id, jobNo: j.jobNo, by: me.name })),
    askJobUpdate: (j, comment) => { const tgt = j.assigneeId ? { toUser: j.assigneeId } : { toDept: j.deptId }; commit(notify(patch(j.id, {}, { action: comment ? `requested update: "${comment}"` : 'requested a status update' }), { ...tgt, type: 'updateReq', jobId: j.id, jobNo: j.jobNo, by: me.name, note: comment || '' })); setModal(null); },
    askProjectUpdate: (pr, comment) => { const head = pr.headId; const tgt = head ? { toUser: head } : { toDept: null }; commit(notify({ ...ref.current }, { ...tgt, type: 'updateReq', projectId: pr.id, projectName: pr.name, by: me.name, note: comment || '' })); setModal(null); },
    createJob: (d) => { const { st, job } = makeJob(ref.current, d); commit(notify(st, { ...(d.assigneeId ? { toUser: d.assigneeId } : { toDept: d.deptId }), type: 'assigned', jobId: job.id, jobNo: job.jobNo, by: me.name })); setModal(null); },
    editJob: (id, p) => { commit(patch(id, p, { action: 'edited' })); setModal(null); },
    // request-to-generate (crew → admin)
    submitRequest: (kind, payload, note) => { commit(notify({ ...ref.current, requests: [{ id: uid('rq'), kind, byId: me.id, byName: me.name, ts: nowISO(), note: note || '', payload }, ...(ref.current.requests || [])] }, { toUser: 'u_aashish', type: 'request', by: me.name })); setModal(null); },
    approveJobRequest: (req, payload) => { const { st, job } = makeJob({ ...ref.current, requests: ref.current.requests.filter((r) => r.id !== req.id) }, payload); commit(notify(notify(st, { ...(payload.assigneeId ? { toUser: payload.assigneeId } : { toDept: payload.deptId }), type: 'assigned', jobId: job.id, jobNo: job.jobNo, by: me.name }), { toUser: req.byId, type: 'reqApproved', by: me.name, jobNo: job.jobNo })); setModal(null); },
    approveProjectRequest: (req, payload) => { commit(notify({ ...ref.current, projects: [...ref.current.projects, { id: uid('pr'), status: 'active', createdAt: nowISO(), ...payload }], requests: ref.current.requests.filter((r) => r.id !== req.id) }, { toUser: req.byId, type: 'reqApproved', by: me.name })); setModal(null); },
    declineGenRequest: (id) => commit({ ...ref.current, requests: ref.current.requests.filter((r) => r.id !== id) }),
    // employees
    addEmployee: (d) => { commit({ ...ref.current, users: [...ref.current.users, { id: uid('u'), ...d, role: 'user', active: true, createdAt: nowISO() }] }); setModal(null); },
    editEmployee: (id, p) => { commit({ ...ref.current, users: ref.current.users.map((u) => u.id === id ? { ...u, ...p } : u) }); setModal(null); },
    toggleActive: (id) => commit({ ...ref.current, users: ref.current.users.map((u) => (u.id === id && !u.isUniversal) ? { ...u, active: !u.active } : u) }),
    approveRequest: (req, d) => { commit({ ...ref.current, users: [...ref.current.users, { id: uid('u'), name: req.name, deptId: req.deptId, role: 'user', hasAccess: true, active: true, mustReset: true, createdAt: nowISO(), ...d }], pendingUsers: ref.current.pendingUsers.filter((p) => p.id !== req.id) }); setModal(null); },
    declineRequest: (id) => commit({ ...ref.current, pendingUsers: ref.current.pendingUsers.filter((p) => p.id !== id) }),
    // departments
    addDept: (name, color) => commit({ ...ref.current, departments: [...ref.current.departments, { id: uid('d'), name, color }] }),
    updateDept: (id, p) => commit({ ...ref.current, departments: ref.current.departments.map((d) => d.id === id ? { ...d, ...p } : d) }),
    deleteDept: (id) => commit({ ...ref.current, departments: ref.current.departments.filter((d) => d.id !== id) }),
    // projects
    addProject: (d) => { commit({ ...ref.current, projects: [...ref.current.projects, { id: uid('pr'), status: 'active', createdAt: nowISO(), ...d }] }); setModal(null); },
    updateProject: (id, p) => { commit({ ...ref.current, projects: ref.current.projects.map((x) => x.id === id ? { ...x, ...p } : x) }); setModal(null); },
    deleteProject: (id) => commit({ ...ref.current, projects: ref.current.projects.filter((x) => x.id !== id), jobs: ref.current.jobs.map((j) => j.projectId === id ? { ...j, projectId: null } : j) }),
    // inventory
    addItem: (d) => { commit({ ...ref.current, inventory: { ...ref.current.inventory, items: [...ref.current.inventory.items, { id: uid('it'), rentedOut: 0, ...d }] } }); setModal(null); },
    editItem: (id, p) => { commit({ ...ref.current, inventory: { ...ref.current.inventory, items: ref.current.inventory.items.map((i) => i.id === id ? { ...i, ...p } : i) } }); setModal(null); },
    recordMovement: (item, kind, qty, party, note, rental, projectId) => {
      const items = ref.current.inventory.items.map((i) => i.id !== item.id ? i : (rental ? { ...i, rentedOut: Math.max(0, (i.rentedOut || 0) + (kind === 'out' ? qty : -qty)) } : { ...i, qty: Math.max(0, i.qty + (kind === 'in' ? qty : -qty)) }));
      const mv = { id: uid('mv'), itemId: item.id, kind, qty, party, note, ts: nowISO(), by: me.name, rental: !!rental, projectId: projectId || null };
      commit({ ...ref.current, inventory: { items, movements: [mv, ...ref.current.inventory.movements] } }); setModal(null);
    },
    changePin: (pin) => commit({ ...ref.current, users: ref.current.users.map((u) => u.id === me.id ? { ...u, pin } : u) }),
    markRead: () => commit({ ...ref.current, notifications: ref.current.notifications.map((n) => (n.toUser === me.id || n.toDept === me.deptId) ? { ...n, read: true } : n) }),
    logout: () => { setSession(null); setScreen('home'); setModal(null); },
    pref, setPrefs,
    exportXlsx: () => exportXlsx(state, me, isAdmin, visibleJobs, deptById, projById),
  };

  const navAdmin = [{ id: 'home', icon: Home, label: 'Home' }, { id: 'jobs', icon: ClipboardList, label: 'Jobs', dot: approvals.length > 0 }, { id: 'projects', icon: Folder, label: 'Projects' }, { id: 'stock', icon: Boxes, label: 'Stock', dot: lowStock.length > 0 }, { id: 'team', icon: Users, label: 'Team', dot: reqCount > 0 }];
  const navUser = [{ id: 'home', icon: Home, label: 'Home' }, { id: 'settings', icon: Settings, label: 'Settings' }];
  const nav = isAdmin ? navAdmin : navUser;
  const screenTitle = (s, admin) => ({ home: admin ? 'Dashboard' : 'Home', jobs: 'Jobs', projects: 'Projects', stock: 'Inventory', team: 'Team', settings: 'Settings' }[s] || 'RIGGR');

  return (
    <div className="gt" style={vars}>
      <div className="shell">

        {/* DESKTOP SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-brand"><Logo size={26} /><span className="sb-word">{APP_NAME}</span></div>
          <button className="sb-new" onClick={() => setModal({ t: isAdmin ? 'job' : 'requestPick' })}><Plus size={20} /><span>{isAdmin ? 'New job' : 'New request'}</span></button>
          <nav className="sb-nav">
            {nav.map((n) => (
              <button key={n.id} className={`sb-item ${screen === n.id ? 'on' : ''}`} onClick={() => setScreen(n.id)}>
                <n.icon size={20} /><span>{n.label}</span>{n.dot && <span className="sb-dot" />}
              </button>
            ))}
          </nav>
          <div className="sb-foot">
            <button className={`sb-item ${screen === 'settings' ? 'on' : ''}`} onClick={() => setScreen('settings')}><Settings size={20} /><span>Settings</span></button>
            <button className="sb-user" onClick={() => setScreen('settings')}>
              <div className="avt sm" style={{ background: isAdmin ? 'var(--hero)' : deptById(me.deptId).color }}>{initials(me.name)}</div>
              <div className="sb-user-meta"><div className="sb-user-name">{me.name}</div><div className="sb-user-role">{isAdmin ? 'Owner' : deptById(me.deptId).name}</div></div>
              <button className="ico-btn sq" onClick={(e) => { e.stopPropagation(); ops.logout(); }}><LogOut size={15} /></button>
            </button>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <div className="main">
          {/* MOBILE / TABLET HEADER */}
          <div className="hdr">
            <div className="avt" onClick={() => setScreen('settings')} style={{ cursor: 'pointer' }}>{initials(me.name)}</div>
            <div className="hi">
              <div className="hello">{greet()}{isAdmin ? '' : `, ${me.name.split(' ')[0]}`}</div>
              <div className="name">{isAdmin ? me.name : deptById(me.deptId).name}</div>
            </div>
            <button className="ico-btn" onClick={() => setPanel(true)}><Bell size={19} />{unread > 0 && <span className="ndot">{unread}</span>}</button>
            <button className="ico-btn" onClick={() => setScreen('settings')}><Settings size={19} /></button>
          </div>

          {/* DESKTOP TOPBAR */}
          <div className="topbar">
            <div className="tb-title">{screenTitle(screen, isAdmin)}</div>
            <div style={{ flex: 1 }} />
            <button className="ico-btn" onClick={() => setPanel(true)}><Bell size={19} />{unread > 0 && <span className="ndot">{unread}</span>}</button>
          </div>

          <div className="scroll">
            <div className="content">
              {isAdmin && screen === 'home' && <AdminHome state={state} deptById={deptById} projById={projById} approvals={approvals} lowStock={lowStock} ops={ops} />}
              {isAdmin && screen === 'jobs' && <JobsScreen state={state} deptById={deptById} projById={projById} approvals={approvals} ops={ops} />}
              {isAdmin && screen === 'projects' && <ProjectsScreen state={state} deptById={deptById} projById={projById} ops={ops} />}
              {isAdmin && screen === 'stock' && <StockScreen state={state} deptById={deptById} ops={ops} />}
              {isAdmin && screen === 'team' && <TeamScreen state={state} deptById={deptById} ops={ops} me={me} />}
              {screen === 'settings' && <SettingsScreen me={me} deptById={deptById} ops={ops} pref={pref} setPrefs={setPrefs} />}
              {!isAdmin && screen === 'home' && <UserHome jobs={visibleJobs} me={me} deptById={deptById} projById={projById} ops={ops} />}
              <div className="foot">{APP_NAME} v{APP_VERSION} · {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}<br />Preview data stays in this browser · production syncs to Google Sheets</div>
            </div>
          </div>

          {/* MOBILE / TABLET BOTTOM NAV with centered + */}
          <div className="bnav">
            {nav.slice(0, Math.ceil(nav.length / 2)).map((n) => (
              <button key={n.id} className={`bn ${screen === n.id ? 'on' : ''}`} onClick={() => setScreen(n.id)}>
                {n.dot && <span className="bdot" />}<n.icon size={21} />{n.label}
              </button>
            ))}
            <button className="bn-fab" onClick={() => setModal({ t: isAdmin ? 'job' : 'requestPick' })} aria-label="Create new"><Plus size={26} /></button>
            {nav.slice(Math.ceil(nav.length / 2)).map((n) => (
              <button key={n.id} className={`bn ${screen === n.id ? 'on' : ''}`} onClick={() => setScreen(n.id)}>
                {n.dot && <span className="bdot" />}<n.icon size={21} />{n.label}
              </button>
            ))}
          </div>
        </div>

        {panel && <NotifPanel notifs={myNotifs} onClose={() => setPanel(false)} onRead={ops.markRead} />}
        {modal && <Modals modal={modal} state={state} deptById={deptById} projById={projById} me={me} isAdmin={isAdmin} ops={ops} />}
      </div>
    </div>
  );
}
