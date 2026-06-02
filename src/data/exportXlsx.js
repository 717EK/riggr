import * as XLSX from 'xlsx';
import { STATUS, CATS } from './constants.js';
import { fmtD, fmtT } from '../lib/helpers.js';

export function exportXlsx(state, me, isAdmin, visibleJobs, deptById, projById) {
  const wb = XLSX.utils.book_new();
  const cols = ['Date', 'Customer', 'Job No.', 'Project', 'Material', 'Process', 'Qty', 'Priority', 'Operator', 'Start Time', 'End Time', 'Status', 'Remarks'];
  const widths = [{ wch: 9 }, { wch: 20 }, { wch: 9 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 6 }, { wch: 9 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 18 }];
  const pname = (id) => { const p = id ? (projById ? projById(id) : null) : null; return p ? p.name : ''; };
  const row = (j) => [fmtD(j.date), j.customer, j.jobNo, pname(j.projectId), j.material, j.process, j.qty, j.priority, j.operator, fmtT(j.startTime), fmtT(j.endTime), STATUS[j.status].label, j.remarks];
  if (isAdmin) {
    const dash = [['Department', 'Total', 'Pending', 'Running', 'On Hold', 'Awaiting', 'Completed', 'Terminated']];
    state.departments.forEach((d) => { const js = state.jobs.filter((j) => j.deptId === d.id); const c = (s) => js.filter((j) => j.status === s).length; dash.push([d.name, js.length, c('pending'), c('running'), c('hold'), c('awaiting'), c('completed'), c('terminated')]); });
    const w0 = XLSX.utils.aoa_to_sheet(dash); w0['!cols'] = dash[0].map((_, i) => ({ wch: i === 0 ? 14 : 11 })); XLSX.utils.book_append_sheet(wb, w0, 'Dashboard');
    if (state.projects.length) { const pr = [['Project', 'Client', 'Site', 'Rental', 'Total', 'Running', 'Completed']]; state.projects.forEach((p) => { const js = state.jobs.filter((j) => j.projectId === p.id); const c = (s) => js.filter((j) => j.status === s).length; pr.push([p.name, p.client, p.location || '', p.isRental ? 'Yes' : '', js.length, c('running'), c('completed')]); }); const wp = XLSX.utils.aoa_to_sheet(pr); wp['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 8 }, { wch: 7 }, { wch: 9 }, { wch: 10 }]; XLSX.utils.book_append_sheet(wb, wp, 'Projects'); }
    state.departments.forEach((d) => { const r = [cols, ...state.jobs.filter((j) => j.deptId === d.id).map(row)]; const ws = XLSX.utils.aoa_to_sheet(r); ws['!cols'] = widths; XLSX.utils.book_append_sheet(wb, ws, d.name.slice(0, 28)); });
    const inv = [['Item', 'Category', 'Qty', 'Unit', 'On Rent', 'Department', 'Min Level']];
    state.inventory.items.forEach((i) => inv.push([i.name, CATS[i.category], i.qty, i.unit, i.rentedOut || 0, i.deptId ? deptById(i.deptId).name : '', i.minLevel || '']));
    const wi = XLSX.utils.aoa_to_sheet(inv); wi['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 7 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 9 }]; XLSX.utils.book_append_sheet(wb, wi, 'Inventory');
    XLSX.writeFile(wb, `RIGGR_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } else {
    const r = [cols, ...visibleJobs.map(row)]; const ws = XLSX.utils.aoa_to_sheet(r); ws['!cols'] = widths;
    XLSX.utils.book_append_sheet(wb, ws, `${me.name.split(' ')[0]} Log`);
    XLSX.writeFile(wb, `RIGGR_${me.name.split(' ')[0]}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
}
