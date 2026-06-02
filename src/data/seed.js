import { uid, dk, addDays } from '../lib/helpers.js';

export function seed() {
  const t = Date.now(); const iso = (m) => new Date(t - m * 60000).toISOString();
  const departments = [
    { id: 'd_rig', name: 'Rigging', color: '#4f7cff' },
    { id: 'd_fab', name: 'Fabrication', color: '#f4a52a' },
    { id: 'd_weld', name: 'Welding', color: '#ef4444' },
    { id: 'd_powder', name: 'Powder Coat', color: '#22b07d' },
    { id: 'd_assem', name: 'Assembly', color: '#a855f7' },
    { id: 'd_logi', name: 'Logistics', color: '#06b6d4' },
    { id: 'd_rental', name: 'Rental', color: '#caa531' },
  ];
  const users = [
    { id: 'u_aashish', name: 'Aashish', username: 'aashish', pin: '1234', role: 'admin', deptId: null, hasAccess: true, mustReset: false, active: true, isUniversal: true, createdAt: iso(99999) },
    { id: 'u_ravi', name: 'Ravi Kumar', username: 'ravi.rig', pin: '1111', role: 'user', deptId: 'd_rig', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_amit', name: 'Amit Sharma', username: 'amit.rig', pin: '2222', role: 'user', deptId: 'd_rig', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_suresh', name: 'Suresh Patel', username: 'suresh.fab', pin: '3333', role: 'user', deptId: 'd_fab', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_manoj', name: 'Manoj Verma', username: 'manoj.pow', pin: '4444', role: 'user', deptId: 'd_powder', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_deepak', name: 'Deepak Singh', username: 'deepak.wel', pin: '5555', role: 'user', deptId: 'd_weld', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_vikas', name: 'Vikas Rao', username: 'vikas.log', pin: '6666', role: 'user', deptId: 'd_logi', hasAccess: true, mustReset: false, active: true, createdAt: iso(8000) },
    { id: 'u_karan', name: 'Karan Mehta', username: 'karan.ren', pin: '9999', role: 'user', deptId: 'd_rental', hasAccess: true, mustReset: true, active: true, createdAt: iso(60) },
  ];
  const projects = [
    { id: 'pr_sunburn', name: 'Sunburn — Main Stage', client: 'Sunburn Festivals', color: '#f4a52a', status: 'active', headId: 'u_ravi', location: 'Vagator Grounds, Goa', isRental: false, createdAt: iso(7000) },
    { id: 'pr_gala', name: 'Corporate Gala', client: 'Hyatt Regency', color: '#a855f7', status: 'active', headId: 'u_suresh', location: 'Hyatt, Delhi', isRental: false, createdAt: iso(5000) },
    { id: 'pr_cricket', name: 'Cricket Opening', client: 'DDCA', color: '#4f7cff', status: 'active', headId: 'u_karan', location: 'Arun Jaitley Stadium', isRental: true, createdAt: iso(4000) },
  ];
  const D = dk(new Date());
  const day = (n) => dk(addDays(new Date(), n));
  const mk = (n, o) => ({ id: uid('job'), jobNo: `J-${1000 + n}`, customer: '', product: '', material: '', process: '', qty: 0, priority: 'Medium', deliveryDate: '', deptId: 'd_rig', projectId: null, assigneeId: null, operator: '', status: 'pending', date: D, startTime: '', endTime: '', remarks: '', createdBy: 'u_aashish', createdAt: iso(600), history: [], ...o });
  const jobs = [
    mk(1, { deptId: 'd_rig', projectId: 'pr_sunburn', customer: 'Sunburn Festivals', product: 'Roof Truss Grid', material: 'Global Truss F34', process: 'Ground rig + motor', qty: 24, priority: 'Urgent', assigneeId: 'u_ravi', operator: 'Ravi Kumar', status: 'running', startTime: iso(45), date: D }),
    mk(2, { deptId: 'd_fab', projectId: 'pr_sunburn', customer: 'Sunburn Festivals', product: 'DJ Riser Frame', material: 'MS Box 50mm', process: 'Weld + bolt', qty: 4, priority: 'High', date: D }),
    mk(3, { deptId: 'd_fab', projectId: 'pr_gala', customer: 'Hyatt Regency', product: 'Backdrop Frame', material: 'Aluminium 40mm', process: 'Fabricate', qty: 6, priority: 'High', assigneeId: 'u_suresh', operator: 'Suresh Patel', status: 'awaiting', startTime: iso(180), endTime: iso(10), date: D }),
    mk(4, { deptId: 'd_powder', projectId: 'pr_gala', customer: 'Hyatt Regency', product: 'Entrance Arch', material: 'MS', process: 'Coat — Matte Black', qty: 2, priority: 'Medium', status: 'hold', date: day(1) }),
    mk(5, { deptId: 'd_weld', customer: 'Walk-in', product: 'Barricade Repair', material: 'MS Pipe', process: 'Weld', qty: 20, priority: 'Low', assigneeId: 'u_deepak', operator: 'Deepak Singh', status: 'completed', startTime: iso(400), endTime: iso(120), date: day(-1) }),
    mk(6, { deptId: 'd_rental', projectId: 'pr_cricket', customer: 'DDCA', product: 'Truss + Light Rental', material: '—', process: 'Dispatch to site', qty: 1, priority: 'Urgent', assigneeId: 'u_karan', operator: 'Karan Mehta', status: 'running', startTime: iso(220), date: D }),
    mk(7, { deptId: 'd_rig', projectId: 'pr_sunburn', customer: 'Sunburn Festivals', product: 'FOH Tower', material: 'Layher', process: 'Build', qty: 2, priority: 'High', date: day(1) }),
    mk(8, { deptId: 'd_assem', projectId: 'pr_gala', customer: 'Hyatt Regency', product: 'Stage Deck', material: 'Ply + steel', process: 'Assemble', qty: 40, priority: 'Medium', date: day(2) }),
    mk(9, { deptId: 'd_logi', customer: 'Yard', product: 'Truck Loadout', material: '—', process: 'Load', qty: 1, priority: 'Medium', date: day(-2), status: 'completed', startTime: iso(3000), endTime: iso(2880) }),
    mk(10, { deptId: 'd_fab', projectId: 'pr_sunburn', customer: 'Sunburn Festivals', product: 'Cable Ramp Set', material: 'Rubber + steel', process: 'Fabricate', qty: 30, priority: 'Low', date: day(3) }),
  ];
  const pendingUsers = [
    { id: 'p_rohit', name: 'Rohit Yadav', deptId: 'd_rig', message: 'Senior rigger, joining this week.', requestedAt: iso(120) },
  ];
  const requests = [
    { id: 'rq_1', kind: 'job', byId: 'u_ravi', byName: 'Ravi Kumar', ts: iso(90), note: 'Need extra hoists rigged for the wings', payload: { customer: 'Sunburn Festivals', product: 'Wing Hoists', deptId: 'd_rig', projectId: 'pr_sunburn', qty: 6, priority: 'High', date: D, material: 'CM Lodestar', process: 'Rig', remarks: '', assigneeId: null } },
  ];
  const inv = {
    items: [
      { id: 'it_f34', name: 'Global Truss F34 · 2m', category: 'rental', unit: 'lengths', qty: 60, deptId: 'd_rental', minLevel: 0, rentedOut: 12 },
      { id: 'it_motor', name: 'Chain Motor 1T', category: 'rental', unit: 'units', qty: 16, deptId: 'd_rental', minLevel: 0, rentedOut: 6 },
      { id: 'it_par', name: 'LED Par Fixture', category: 'rental', unit: 'units', qty: 80, deptId: 'd_rental', minLevel: 0, rentedOut: 24 },
      { id: 'it_base', name: 'Base Plate 600mm', category: 'rental', unit: 'pcs', qty: 40, deptId: 'd_rental', minLevel: 0, rentedOut: 8 },
      { id: 'it_ms', name: 'MS Box 50mm', category: 'raw', unit: 'lengths', qty: 120, deptId: 'd_fab', minLevel: 40, rentedOut: 0 },
      { id: 'it_alu', name: 'Aluminium 40mm', category: 'raw', unit: 'lengths', qty: 28, deptId: 'd_fab', minLevel: 40, rentedOut: 0 },
      { id: 'it_powder', name: 'Powder — Matte Black', category: 'raw', unit: 'kg', qty: 18, deptId: 'd_powder', minLevel: 10, rentedOut: 0 },
      { id: 'it_arch', name: 'Entrance Arch (built)', category: 'final', unit: 'pcs', qty: 3, deptId: null, minLevel: 0, rentedOut: 0 },
    ],
    movements: [
      { id: uid('mv'), itemId: 'it_f34', kind: 'out', qty: 12, party: 'Cricket Opening', note: 'Site dispatch', ts: iso(220), by: 'Karan Mehta', rental: true, projectId: 'pr_cricket' },
      { id: uid('mv'), itemId: 'it_par', kind: 'out', qty: 24, party: 'Cricket Opening', note: '', ts: iso(220), by: 'Karan Mehta', rental: true, projectId: 'pr_cricket' },
      { id: uid('mv'), itemId: 'it_ms', kind: 'in', qty: 100, party: 'Apollo Steel', note: 'PO-7781', ts: iso(2000), by: 'Aashish', rental: false, projectId: null },
    ],
  };
  const notifications = [
    { id: uid('n'), toUser: 'u_aashish', type: 'approval', jobId: jobs[2].id, jobNo: jobs[2].jobNo, by: 'Suresh Patel', ts: iso(10), read: false },
    { id: uid('n'), toUser: 'u_aashish', type: 'request', by: 'Ravi Kumar', ts: iso(90), read: false },
  ];
  return { users, pendingUsers, departments, projects, requests, jobs, inventory: inv, notifications, meta: { nextJobNo: 1011 } };
}

