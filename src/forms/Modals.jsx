import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Home, ClipboardList, Boxes, Users, Bell, Plus, Cal, ChevronLeft, ChevronRight, Search, LogOut, CheckCircle2, RotateCcw, XCircle, Play, Pause, Flag, Clock, Download, Pencil, Trash2, X, ArrowUpRight, ArrowDownRight, AlertTriangle, UserPlus, Check, KeyRound, ShieldCheck, Layers, CornerDownLeft, Delete, Folder, Settings, Sun, Moon, Palette, MapPin, HardHat, Truck, Activity, Package, Inbox, CR } from '../lib/icons.js';
import { PRIORITIES, STATUS, CATS, ACCENTS, APP_NAME, APP_VERSION, APP_CODENAME, CHANGELOG } from '../data/constants.js';
import { uid, nowISO, dk, parseDK, addDays, startOfWeek, fmtT, fmtD, WD, MO, MOABBR, initials, buildBuckets, currentKey, jobInBucket, genUsername, genPin } from '../lib/helpers.js';
import { Row } from '../components/Bits.jsx';

export function Modals({ modal, state, deptById, projById, me, isAdmin, ops }) {
  const close = () => ops.setModal(null);
  const { departments, users, projects } = state;
  return (
    <div className="scrim" onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grip" />
        {modal.t === 'job' && <JobForm job={modal.job} preProject={modal.preProject} departments={departments} users={users} projects={projects} onClose={close} onSave={(d) => modal.job ? ops.editJob(modal.job.id, d) : ops.createJob(d)} />}
        {modal.t === 'jobview' && <JobView job={modal.job} deptById={deptById} projById={projById} isAdmin={isAdmin} ops={ops} onClose={close} />}
        {modal.t === 'askUpdate' && <AskUpdateForm job={modal.job} project={modal.project} deptById={deptById} state={state} onClose={close} onSend={(comment) => modal.project ? ops.askProjectUpdate(modal.project, comment) : ops.askJobUpdate(modal.job, comment)} />}
        {modal.t === 'project' && <ProjectForm project={modal.project} users={users} onClose={close} onSave={(d) => modal.project ? ops.updateProject(modal.project.id, d) : ops.addProject(d)} />}
        {modal.t === 'employee' && <EmployeeForm emp={modal.emp} departments={departments} users={users} onClose={close} onSave={(d) => modal.emp ? ops.editEmployee(modal.emp.id, d) : ops.addEmployee(d)} onToggle={() => ops.toggleActive(modal.emp.id)} />}
        {modal.t === 'approveReq' && <ApproveReqForm req={modal.req} users={users} deptById={deptById} onClose={close} onApprove={(d) => ops.approveRequest(modal.req, d)} />}
        {modal.t === 'dept' && <DeptForm dept={modal.dept} onClose={close} onSave={(d) => modal.dept ? ops.updateDept(modal.dept.id, d) : ops.addDept(d.name, d.color)} />}
        {modal.t === 'item' && <ItemForm item={modal.item} departments={departments} onClose={close} onSave={(d) => modal.item ? ops.editItem(modal.item.id, d) : ops.addItem(d)} />}
        {modal.t === 'move' && <MoveForm item={modal.item} kind={modal.kind} rental={modal.rental} projects={projects} onClose={close} onSave={(qty, party, note, projectId) => ops.recordMovement(modal.item, modal.kind, qty, party, note, modal.rental, projectId)} />}
        {modal.t === 'dispatch' && <DispatchForm project={modal.project} items={state.inventory.items} onClose={close} onSave={(item, qty, note) => ops.recordMovement(item, 'out', qty, modal.project.name, note, true, modal.project.id)} />}
        {modal.t === 'return' && <ReturnForm project={modal.project} item={state.inventory.items.find((i) => i.id === modal.itemId)} max={modal.max} onClose={close} onSave={(qty) => ops.recordMovement(state.inventory.items.find((i) => i.id === modal.itemId), 'in', qty, modal.project.name, 'Returned from site', true, modal.project.id)} />}
        {modal.t === 'pin' && <PinForm me={me} users={users} onClose={close} onSave={(p) => { ops.changePin(p); close(); }} />}
        {modal.t === 'requestPick' && <RequestPicker onPick={(k) => ops.setModal({ t: k === 'job' ? 'requestJob' : 'requestProject' })} onClose={close} />}
        {modal.t === 'requestJob' && <JobForm requestMode departments={departments} users={users} projects={projects} myDept={me.deptId} onClose={close} onSave={(d, note) => ops.submitRequest('job', d, note)} />}
        {modal.t === 'requestProject' && <ProjectForm requestMode users={users} onClose={close} onSave={(d, note) => ops.submitRequest('project', d, note)} />}
        {modal.t === 'reviewJobReq' && <JobForm job={modal.req.payload} reviewReq={modal.req} departments={departments} users={users} projects={projects} onClose={close} onSave={(d) => ops.approveJobRequest(modal.req, d)} />}
        {modal.t === 'reviewProjReq' && <ProjectForm project={modal.req.payload} reviewReq={modal.req} users={users} onClose={close} onSave={(d) => ops.approveProjectRequest(modal.req, d)} />}
      </div>
    </div>
  );
}

export function JobForm({ job, preProject, departments, users, projects, requestMode, reviewReq, myDept, onClose, onSave }) {
  const [f, setF] = useState({ customer: job?.customer || '', product: job?.product || '', material: job?.material || '', process: job?.process || '', qty: job?.qty || '', priority: job?.priority || 'Medium', deptId: job?.deptId || myDept || departments[0]?.id, projectId: job?.projectId || preProject || '', assigneeId: job?.assigneeId || '', date: job?.date || dk(new Date()), remarks: job?.remarks || '' });
  const [note, setNote] = useState(reviewReq?.note || '');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const deptUsers = users.filter((u) => u.deptId === f.deptId && u.role !== 'admin');
  const title = requestMode ? 'Request a job' : reviewReq ? 'Review & approve job' : job ? 'Edit job' : 'New job';
  const save = () => { const payload = { ...f, qty: Number(f.qty) || 0, projectId: f.projectId || null, assigneeId: f.assigneeId || null }; requestMode ? onSave(payload, note) : onSave(payload); };
  return (
    <>
      <div className="sh-h"><h3>{title}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      {reviewReq && <div style={{ background: 'color-mix(in srgb,#caa531 13%,transparent)', borderRadius: 12, padding: '10px 12px', marginBottom: 14, fontSize: 12.5, color: 'var(--text)' }}>Requested by <b>{reviewReq.byName}</b>{reviewReq.note ? ` · “${reviewReq.note}”` : ''}. Edit anything below, then approve.</div>}
      <div className="field"><label>Customer / client</label><input className="in" value={f.customer} onChange={(e) => set('customer', e.target.value)} placeholder="e.g. Sunburn Festivals" /></div>
      <div className="field"><label>What's being made</label><input className="in" value={f.product} onChange={(e) => set('product', e.target.value)} placeholder="e.g. Roof Truss Grid" /></div>
      <div className="field"><label>Project</label><select className="sel" value={f.projectId} onChange={(e) => set('projectId', e.target.value)}><option value="">— None —</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="f2"><div className="field"><label>Department</label><select className="sel" value={f.deptId} onChange={(e) => { set('deptId', e.target.value); set('assigneeId', ''); }}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        <div className="field"><label>Quantity</label><input className="in" type="number" value={f.qty} onChange={(e) => set('qty', e.target.value)} placeholder="0" /></div></div>
      <div className="f2"><div className="field"><label>Material</label><input className="in" value={f.material} onChange={(e) => set('material', e.target.value)} placeholder="e.g. F34 truss" /></div>
        <div className="field"><label>Process</label><input className="in" value={f.process} onChange={(e) => set('process', e.target.value)} placeholder="e.g. Ground rig" /></div></div>
      {!requestMode && <div className="field"><label>Assign to</label><select className="sel" value={f.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}><option value="">Whole {deptById2(departments, f.deptId)} (shared)</option>{deptUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>}
      <div className="field"><label>Priority</label><div className="seg">{PRIORITIES.map((p) => <div key={p} className={`o ${f.priority === p ? 'on' : ''}`} onClick={() => set('priority', p)}>{p}</div>)}</div></div>
      <div className="field"><label>Date</label><input className="in" type="date" value={f.date} onChange={(e) => set('date', e.target.value)} /></div>
      {requestMode && <div className="field"><label>Note for admin (optional)</label><textarea className="in" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why this is needed…" /></div>}
      <button className="btn primary block" disabled={!f.product && !f.customer} onClick={save}>{requestMode ? 'Send request' : reviewReq ? 'Approve & create' : job ? 'Save changes' : 'Create job'}</button>
    </>
  );
}
export function deptById2(departments, id) { return (departments.find((d) => d.id === id) || {}).name || 'department'; }

export function JobView({ job: j, deptById, projById, isAdmin, ops, onClose }) {
  const d = deptById(j.deptId), st = STATUS[j.status], pr = j.projectId ? projById(j.projectId) : null;
  return (
    <>
      <div className="sh-h"><h3>{j.jobNo}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}><span className="chip" style={{ '--cc': st.c }}>{st.label}</span><span className="chip" style={{ '--cc': d.color }}><span className="dept-dot" style={{ background: d.color }} />{d.name}</span><span className={`prio ${j.priority}`}>{j.priority}</span>{pr && <span className="pjtag" style={{ '--cc': pr.color }}><Folder size={11} />{pr.name}</span>}</div>
      <div className="card" style={{ marginBottom: 12 }}>
        <Row k="Customer" v={j.customer || '—'} /><Row k="Product" v={j.product || '—'} /><Row k="Material" v={j.material || '—'} /><Row k="Process" v={j.process || '—'} /><Row k="Quantity" v={j.qty || '—'} /><Row k="Assigned" v={j.assigneeId ? (j.operator || 'User') : `All ${d.name}`} /><Row k="Start" v={fmtT(j.startTime)} /><Row k="End" v={fmtT(j.endTime)} /><Row k="Date" v={fmtD(j.date)} last />
      </div>
      {j.remarks && <div className="card" style={{ marginBottom: 12 }}><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--faint)', fontWeight: 700, marginBottom: 4 }}>Remarks</div><div style={{ fontSize: 13.5 }}>{j.remarks}</div></div>}
      {(j.history || []).length > 0 && <div className="card" style={{ marginBottom: isAdmin ? 14 : 0 }}><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--faint)', fontWeight: 700, marginBottom: 8 }}>Activity</div>{j.history.slice().reverse().map((h, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: i < j.history.length - 1 ? '1px solid var(--line)' : 'none' }}><span style={{ fontWeight: 600 }}>{h.by} · {h.action}</span><span style={{ color: 'var(--muted)' }}>{fmtT(h.ts)}</span></div>)}</div>}
      {isAdmin && ops && <div className="acts">
        {j.status === 'awaiting' && <><button className="btn ok" onClick={() => { ops.approve(j); onClose(); }}><CheckCircle2 size={15} />Approve</button><button className="btn info" onClick={() => { ops.reactivate(j); onClose(); }}><RotateCcw size={15} />Reactivate</button></>}
        {j.status === 'completed' && <button className="btn info sm" onClick={() => { ops.reactivate(j); onClose(); }}><RotateCcw size={14} />Reopen</button>}
        {!['completed', 'terminated'].includes(j.status) && <button className="btn info sm" onClick={() => ops.setModal({ t: 'askUpdate', job: j })}><Bell size={14} />Ask update</button>}
        {j.status !== 'terminated' && <button className="btn ghost sm" onClick={() => ops.setModal({ t: 'job', job: j })}><Pencil size={14} />Edit</button>}
        {!['completed', 'terminated'].includes(j.status) && <button className="btn danger sm" onClick={() => { ops.terminate(j); onClose(); }}><XCircle size={14} />Terminate</button>}
      </div>}
    </>
  );
}

export function AskUpdateForm({ job, project, deptById, state, onClose, onSend }) {
  const [comment, setComment] = useState('');
  let recipient;
  if (project) recipient = project.headId ? (state.users.find((u) => u.id === project.headId)?.name || 'project head') + ' (project head)' : 'no project head set';
  else recipient = job.assigneeId ? (job.operator || state.users.find((u) => u.id === job.assigneeId)?.name || 'assignee') : `everyone in ${deptById(job.deptId).name}`;
  return (
    <>
      <div className="sh-h"><h3>Ask for update</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="card" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 11 }}>
        <div className="n-ic" style={{ width: 40, height: 40, background: 'color-mix(in srgb,#3b82f6 14%,transparent)', color: '#2563eb' }}><Bell size={18} /></div>
        <div style={{ flex: 1 }}><div className="nm" style={{ fontSize: 14.5, fontWeight: 700 }}>{project ? project.name : `${job.jobNo} · ${job.product || job.customer}`}</div><div className="un">Request goes to <b>{recipient}</b></div></div>
      </div>
      <div className="field"><label>What do you want to know? (optional)</label><textarea className="in" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave blank for a simple status update, or ask something specific — e.g. “How many trusses are rigged so far?”" /></div>
      <button className="btn primary block" onClick={() => onSend(comment.trim())}><Bell size={16} />{comment.trim() ? 'Send request' : 'Request status update'}</button>
    </>
  );
}

export function ProjectForm({ project, users, requestMode, reviewReq, onClose, onSave }) {
  const COLORS = ['#f4a52a', '#a855f7', '#4f7cff', '#22b07d', '#ef4444', '#06b6d4', '#caa531'];
  const [f, setF] = useState({ name: project?.name || '', client: project?.client || '', location: project?.location || '', headId: project?.headId || '', isRental: project?.isRental || false, color: project?.color || COLORS[0] });
  const [note, setNote] = useState(reviewReq?.note || '');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const heads = users.filter((u) => u.active !== false);
  const title = requestMode ? 'Request a project' : reviewReq ? 'Review & approve project' : project && !reviewReq ? 'Edit project' : 'New project';
  const save = () => { const payload = { ...f, headId: f.headId || null }; requestMode ? onSave(payload, note) : onSave(payload); };
  return (
    <>
      <div className="sh-h"><h3>{title}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      {reviewReq && <div style={{ background: 'color-mix(in srgb,#caa531 13%,transparent)', borderRadius: 12, padding: '10px 12px', marginBottom: 14, fontSize: 12.5 }}>Requested by <b>{reviewReq.byName}</b>. Edit anything, then approve.</div>}
      <div className="field"><label>Project name</label><input className="in" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sunburn — Main Stage" /></div>
      <div className="field"><label>Client</label><input className="in" value={f.client} onChange={(e) => set('client', e.target.value)} placeholder="e.g. Sunburn Festivals" /></div>
      <div className="field"><label>Site location</label><input className="in" value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Vagator Grounds, Goa" /></div>
      <div className="field"><label>Project head / site manager</label><select className="sel" value={f.headId} onChange={(e) => set('headId', e.target.value)}><option value="">— Unassigned —</option>{heads.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
      <div className="row-between" style={{ marginBottom: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Truck size={18} color="var(--muted)" /><div><div style={{ fontWeight: 700 }}>Rental project</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Track gear dispatched to site</div></div></div><div className={`toggle ${f.isRental ? 'on' : ''}`} onClick={() => set('isRental', !f.isRental)} /></div>
      <div className="field"><label>Colour</label><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{COLORS.map((c) => <div key={c} onClick={() => set('color', c)} style={{ width: 34, height: 34, borderRadius: 11, background: c, cursor: 'pointer', boxShadow: f.color === c ? '0 0 0 3px var(--app),0 0 0 5px ' + c : 'none' }} />)}</div></div>
      {requestMode && <div className="field"><label>Note for admin (optional)</label><textarea className="in" rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></div>}
      <button className="btn primary block" disabled={!f.name} onClick={save}>{requestMode ? 'Send request' : reviewReq ? 'Approve & create' : project ? 'Save changes' : 'Create project'}</button>
    </>
  );
}

export function EmployeeForm({ emp, departments, users, onClose, onSave, onToggle }) {
  const [name, setName] = useState(emp?.name || '');
  const [deptId, setDeptId] = useState(emp?.deptId || departments[0]?.id);
  const [hasAccess, setHasAccess] = useState(emp ? emp.hasAccess : true);
  const deptName = (departments.find((d) => d.id === deptId) || {}).name;
  const [username, setUsername] = useState(emp?.username || '');
  const [tempPin, setTempPin] = useState(emp ? null : genPin(users));
  useEffect(() => { if (!emp && hasAccess) setUsername(genUsername(name || 'user', deptName, users)); }, [name, deptId, hasAccess, emp]);
  const save = () => { const base = { name: name.trim(), deptId, hasAccess }; if (!emp && hasAccess) onSave({ ...base, username, pin: tempPin, mustReset: true }); else if (!emp) onSave({ ...base, username: '', pin: '', mustReset: false }); else onSave({ ...base, username: hasAccess ? (emp.username || genUsername(name, deptName, users)) : emp.username }); };
  return (
    <>
      <div className="sh-h"><h3>{emp ? 'Edit member' : 'Add team member'}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      {emp?.isUniversal && <div style={{ background: 'color-mix(in srgb,#5fa83a 13%,transparent)', borderRadius: 12, padding: '10px 12px', marginBottom: 14, fontSize: 12.5, display: 'flex', gap: 8, alignItems: 'center' }}><ShieldCheck size={16} color="#3f7d22" />Owner account — always active, can't be deactivated.</div>}
      <div className="field"><label>Full name</label><input className="in" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ravi Kumar" /></div>
      <div className="field"><label>Department</label><select className="sel" value={deptId} onChange={(e) => setDeptId(e.target.value)} disabled={emp?.isUniversal}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      {!emp?.isUniversal && <div className="row-between" style={{ marginBottom: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><KeyRound size={18} color="var(--muted)" /><div><div style={{ fontWeight: 700 }}>App access</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Can log in with a PIN</div></div></div><div className={`toggle ${hasAccess ? 'on' : ''}`} onClick={() => setHasAccess(!hasAccess)} /></div>}
      {hasAccess && !emp && <div className="card" style={{ marginBottom: 14, background: 'var(--card2)' }}>
        <div className="field" style={{ marginBottom: 10 }}><label>Username (auto, editable)</label><input className="in" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))} /></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Temporary PIN</div><div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.1em' }}>{tempPin}</div></div><button className="btn ghost sm" onClick={() => setTempPin(genPin(users))}><RotateCcw size={14} />New</button></div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>Share this PIN — they'll set their own on first login.</div>
      </div>}
      {hasAccess && emp && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>Username: <b>@{emp.username}</b>{emp.mustReset ? ' · PIN reset pending' : ''}</div>}
      <button className="btn primary block" disabled={!name.trim()} onClick={save}>{emp ? 'Save changes' : 'Add member'}</button>
      {emp && !emp.isUniversal && <button className="btn ghost block" style={{ marginTop: 10, color: emp.active ? '#dc2626' : '#3f7d22' }} onClick={onToggle}>{emp.active ? 'Deactivate access' : 'Reactivate access'}</button>}
    </>
  );
}

export function ApproveReqForm({ req, users, deptById, onClose, onApprove }) {
  const d = deptById(req.deptId);
  const [username, setUsername] = useState(() => genUsername(req.name, d.name, users));
  const [tempPin] = useState(() => genPin(users));
  return (
    <>
      <div className="sh-h"><h3>Approve access</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="card" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}><div className="avt" style={{ background: d.color, color: '#fff' }}>{initials(req.name)}</div><div><div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>{req.name}</div><div style={{ color: 'var(--muted)', fontSize: 13 }}>{d.name}</div></div></div>
      <div className="field"><label>Username</label><input className="in" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))} /></div>
      <div className="card" style={{ marginBottom: 14, background: 'var(--card2)' }}><div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Temporary PIN</div><div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.1em' }}>{tempPin}</div><div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>They'll set their own PIN on first login.</div></div>
      <button className="btn primary block" onClick={() => onApprove({ username, pin: tempPin })}>Approve & create login</button>
    </>
  );
}

export function DeptForm({ dept, onClose, onSave }) {
  const COLORS = ['#4f7cff', '#f4a52a', '#ef4444', '#22b07d', '#a855f7', '#06b6d4', '#caa531', '#ec4899'];
  const [name, setName] = useState(dept?.name || '');
  const [color, setColor] = useState(dept?.color || COLORS[0]);
  return (
    <>
      <div className="sh-h"><h3>{dept ? 'Edit department' : 'New department'}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="field"><label>Name</label><input className="in" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rigging" /></div>
      <div className="field"><label>Colour</label><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{COLORS.map((c) => <div key={c} onClick={() => setColor(c)} style={{ width: 34, height: 34, borderRadius: 11, background: c, cursor: 'pointer', boxShadow: color === c ? '0 0 0 3px var(--app),0 0 0 5px ' + c : 'none' }} />)}</div></div>
      <button className="btn primary block" disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), color })}>{dept ? 'Save' : 'Create'}</button>
    </>
  );
}

export function ItemForm({ item, departments, onClose, onSave }) {
  const [f, setF] = useState({ name: item?.name || '', category: item?.category || 'rental', unit: item?.unit || 'units', qty: item?.qty ?? '', minLevel: item?.minLevel ?? 0, deptId: item?.deptId || '' });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <>
      <div className="sh-h"><h3>{item ? 'Edit item' : 'Add item'}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="field"><label>Name</label><input className="in" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chain Motor 1T" /></div>
      <div className="field"><label>Category</label><div className="seg">{Object.entries(CATS).map(([k, v]) => <div key={k} className={`o ${f.category === k ? 'on' : ''}`} onClick={() => set('category', k)}>{v}</div>)}</div></div>
      <div className="f2"><div className="field"><label>Quantity</label><input className="in" type="number" value={f.qty} onChange={(e) => set('qty', e.target.value)} placeholder="0" /></div><div className="field"><label>Unit</label><input className="in" value={f.unit} onChange={(e) => set('unit', e.target.value)} placeholder="units" /></div></div>
      {f.category === 'raw' && <div className="field"><label>Low-stock alert below</label><input className="in" type="number" value={f.minLevel} onChange={(e) => set('minLevel', e.target.value)} placeholder="0" /></div>}
      <div className="field"><label>Department (optional)</label><select className="sel" value={f.deptId} onChange={(e) => set('deptId', e.target.value)}><option value="">— None —</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
      <button className="btn primary block" disabled={!f.name.trim()} onClick={() => onSave({ name: f.name.trim(), category: f.category, unit: f.unit, qty: Number(f.qty) || 0, minLevel: Number(f.minLevel) || 0, deptId: f.deptId || null })}>{item ? 'Save' : 'Add'}</button>
    </>
  );
}

export function MoveForm({ item, kind, rental, projects, onClose, onSave }) {
  const [qty, setQty] = useState('');
  const [party, setParty] = useState('');
  const [note, setNote] = useState('');
  const [projectId, setProjectId] = useState('');
  const verb = rental ? (kind === 'out' ? 'Rent out' : 'Return') : (kind === 'in' ? 'Stock in' : 'Stock out');
  return (
    <>
      <div className="sh-h"><h3>{verb}</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="card" style={{ marginBottom: 14 }}><div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{rental ? `${item.rentedOut || 0} on rent · ${item.qty - (item.rentedOut || 0)} available` : `${item.qty} ${item.unit} in stock`}</div></div>
      <div className="field"><label>Quantity to {verb.toLowerCase()}</label><input className="in" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" autoFocus /></div>
      {rental && projects && <div className="field"><label>Project (optional)</label><select className="sel" value={projectId} onChange={(e) => setProjectId(e.target.value)}><option value="">— None —</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
      <div className="field"><label>{rental ? 'Site / client' : kind === 'in' ? 'Supplier' : 'Issued to'}</label><input className="in" value={party} onChange={(e) => setParty(e.target.value)} placeholder="optional" /></div>
      <div className="field"><label>Note</label><input className="in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" /></div>
      <button className="btn primary block" disabled={!qty || Number(qty) <= 0} onClick={() => onSave(Number(qty), party, note, projectId || null)}>{verb}</button>
    </>
  );
}

export function DispatchForm({ project, items, onClose, onSave }) {
  const rental = items.filter((i) => i.category === 'rental');
  const [itemId, setItemId] = useState(rental[0]?.id || '');
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const item = rental.find((i) => i.id === itemId);
  const avail = item ? item.qty - (item.rentedOut || 0) : 0;
  return (
    <>
      <div className="sh-h"><h3>Dispatch to site</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>Sending gear to <b>{project.name}</b>{project.location ? ` · ${project.location}` : ''}</div>
      <div className="field"><label>Gear</label><select className="sel" value={itemId} onChange={(e) => setItemId(e.target.value)}>{rental.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.qty - (i.rentedOut || 0)} avail)</option>)}</select></div>
      <div className="field"><label>Quantity (max {avail})</label><input className="in" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" autoFocus /></div>
      <div className="field"><label>Note</label><input className="in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" /></div>
      <button className="btn primary block" disabled={!item || !qty || Number(qty) <= 0 || Number(qty) > avail} onClick={() => onSave(item, Number(qty), note)}>Dispatch</button>
    </>
  );
}

export function ReturnForm({ project, item, max, onClose, onSave }) {
  const [qty, setQty] = useState(String(max || ''));
  return (
    <>
      <div className="sh-h"><h3>Return from site</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="card" style={{ marginBottom: 14 }}><div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>{item?.name}</div><div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{max} on site at {project.name}</div></div>
      <div className="field"><label>Quantity returning (max {max})</label><input className="in" type="number" value={qty} onChange={(e) => setQty(e.target.value)} autoFocus /></div>
      <button className="btn primary block" disabled={!qty || Number(qty) <= 0 || Number(qty) > max} onClick={() => onSave(Number(qty))}>Confirm return</button>
    </>
  );
}

export function RequestPicker({ onPick, onClose }) {
  return (
    <>
      <div className="sh-h"><h3>What do you need?</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 16 }}>Your request goes to Aashish for approval.</div>
      <div className="card" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => onPick('job')}><div className="n-ic" style={{ width: 44, height: 44, background: 'var(--hero)', color: 'var(--hero-text)' }}><ClipboardList size={20} /></div><div style={{ flex: 1 }}><div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>Request a job</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>A task for your department</div></div><CR size={18} color="var(--faint)" /></div>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => onPick('project')}><div className="n-ic" style={{ width: 44, height: 44, background: 'var(--accent)', color: 'var(--accent-ink)' }}><Folder size={20} /></div><div style={{ flex: 1 }}><div className="disp" style={{ fontWeight: 700, fontSize: 16 }}>Request a project</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>A new job grouping</div></div><CR size={18} color="var(--faint)" /></div>
    </>
  );
}

export function PinForm({ me, users, onClose, onSave }) {
  const [cur, setCur] = useState(''); const [n1, setN1] = useState(''); const [n2, setN2] = useState(''); const [err, setErr] = useState('');
  const taken = users.filter((u) => u.id !== me.id).map((u) => u.pin);
  const submit = () => {
    if (cur !== me.pin) return setErr('Current PIN is incorrect');
    if (!/^\d{4}$/.test(n1)) return setErr('New PIN must be 4 digits');
    if (n1 !== n2) return setErr('PINs don’t match');
    if (taken.includes(n1)) return setErr('That PIN is in use, pick another');
    onSave(n1);
  };
  return (
    <>
      <div className="sh-h"><h3>Change PIN</h3><button className="ico-btn sq" onClick={onClose}><X size={17} /></button></div>
      <div className="field"><label>Current PIN</label><input className="in" type="password" inputMode="numeric" maxLength={4} value={cur} onChange={(e) => { setErr(''); setCur(e.target.value.replace(/\D/g, '')); }} /></div>
      <div className="field"><label>New PIN</label><input className="in" type="password" inputMode="numeric" maxLength={4} value={n1} onChange={(e) => { setErr(''); setN1(e.target.value.replace(/\D/g, '')); }} /></div>
      <div className="field"><label>Confirm new PIN</label><input className="in" type="password" inputMode="numeric" maxLength={4} value={n2} onChange={(e) => { setErr(''); setN2(e.target.value.replace(/\D/g, '')); }} /></div>
      {err && <div className="lerr" style={{ marginTop: 0, marginBottom: 12 }}>{err}</div>}
      <button className="btn primary block" onClick={submit}>Update PIN</button>
    </>
  );
}

