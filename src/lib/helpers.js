export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`;
export const nowISO = () => new Date().toISOString();
export const dk = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
export const parseDK = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const startOfWeek = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
export const fmtT = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
export const fmtD = (iso) => iso ? new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short' }) : '—';
export const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MOABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const initials = (n) => (n || '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function buildBuckets(jobs, mode) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out = [];
  if (mode === 'day') {
    for (let i = -28; i <= 14; i++) { const d = addDays(today, i); const key = dk(d);
      out.push({ key, mode, top: WD[(d.getDay() + 6) % 7], mid: String(d.getDate()), bot: MOABBR[d.getMonth()], label: `${WD[(d.getDay() + 6) % 7]} ${d.getDate()} ${MOABBR[d.getMonth()]}`, count: jobs.filter((j) => j.date === key).length, date: d, isNow: i === 0 }); }
  } else if (mode === 'week') {
    const s0 = startOfWeek(today);
    for (let i = -16; i <= 8; i++) { const ws = addDays(s0, i * 7); const we = addDays(ws, 6); const key = 'W' + dk(ws);
      const count = jobs.filter((j) => { const jd = parseDK(j.date); return jd >= ws && jd <= we; }).length;
      out.push({ key, mode, top: 'Wk', mid: String(ws.getDate()), bot: MOABBR[ws.getMonth()], label: `${ws.getDate()} ${MOABBR[ws.getMonth()]} – ${we.getDate()} ${MOABBR[we.getMonth()]}`, count, date: ws, end: we, isNow: i === 0 }); }
  } else {
    for (let i = -12; i <= 6; i++) { const m = new Date(today.getFullYear(), today.getMonth() + i, 1); const key = 'M' + m.getFullYear() + '-' + m.getMonth();
      const count = jobs.filter((j) => { const jd = parseDK(j.date); return jd.getFullYear() === m.getFullYear() && jd.getMonth() === m.getMonth(); }).length;
      out.push({ key, mode, top: '', mid: MOABBR[m.getMonth()], bot: String(m.getFullYear()).slice(2), label: `${MO[m.getMonth()]} ${m.getFullYear()}`, count, date: m, isNow: i === 0 }); }
  }
  return out;
}
export const currentKey = (mode) => { const t = new Date(); t.setHours(0, 0, 0, 0); if (mode === 'day') return dk(t); if (mode === 'week') return 'W' + dk(startOfWeek(t)); return 'M' + t.getFullYear() + '-' + t.getMonth(); };
export const jobInBucket = (j, b) => { if (!b) return false; if (b.mode === 'day') return j.date === b.key; const jd = parseDK(j.date); if (b.mode === 'week') return jd >= b.date && jd <= b.end; return jd.getFullYear() === b.date.getFullYear() && jd.getMonth() === b.date.getMonth(); };

export const genUsername = (name, deptName, users) => {
  const first = (name.trim().split(/\s+/)[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  const d = (deptName || 'gen').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 3);
  let base = `${first}.${d}`, u = base, i = 1; const t = new Set(users.map((x) => x.username));
  while (t.has(u)) u = `${base}${i++}`; return u;
};
export const genPin = (users) => { const t = new Set(users.map((x) => x.pin)); let p; do { p = String(Math.floor(1000 + Math.random() * 9000)); } while (t.has(p)); return p; };
