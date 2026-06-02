import * as XLSX from 'xlsx';
import { STATUS, CATS } from './constants.js';
import { fmtD, fmtT } from '../lib/helpers.js';

export function exportXlsx(state, me, isAdmin, visibleJobs, deptById, projById) {
  const wb = XLSX.utils.book_new();
  const pname = (id) => { const p = id ? (projById ? projById(id) : null) : null; return p ? p.name : ''; };
  // Department is now part of the row so Main is the single source of truth.
  const cols = ['Date', 'Department', 'Job No.', 'Customer', 'Product', 'Project', 'Material', 'Process', 'Qty', 'Priority', 'Operator', 'Start Time', 'End Time', 'Status', 'Remarks'];
  const widths = [{ wch: 9 }, { wch: 14 }, { wch: 9 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 6 }, { wch: 9 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 18 }];
  const row = (j) => [fmtD(j.date), deptById(j.deptId).name, j.jobNo, j.customer, j.product, pname(j.projectId), j.material, j.process, j.qty, j.priority, j.operator, fmtT(j.startTime), fmtT(j.endTime), STATUS[j.status].label, j.remarks];

  if (isAdmin) {
    const today = new Date().toISOString().slice(0, 10);
    const c = (arr, s) => arr.filter((j) => j.status === s).length;
    const all = state.jobs;

    /* ===== MAIN sheet: summary block on top, then the full combined job list ===== */
    const main = [];
    main.push([`RIGGR — Master Job Sheet`]);
    main.push([`Giant Truss · exported ${today}`]);
    main.push([]);
    main.push(['SUMMARY']);
    main.push(['Total jobs', all.length, '', 'Pending', c(all, 'pending'), 'Running', c(all, 'running')]);
    main.push(['On hold', c(all, 'hold'), '', 'Awaiting', c(all, 'awaiting'), 'Completed', c(all, 'completed')]);
    main.push(['Terminated', c(all, 'terminated'), '', 'Departments', state.departments.length, 'Projects', state.projects.length]);
    main.push([]);
    main.push(['BY DEPARTMENT']);
    main.push(['Department', 'Total', 'Pending', 'Running', 'On Hold', 'Awaiting', 'Completed', 'Terminated']);
    state.departments.forEach((d) => { const js = all.filter((j) => j.deptId === d.id); main.push([d.name, js.length, c(js, 'pending'), c(js, 'running'), c(js, 'hold'), c(js, 'awaiting'), c(js, 'completed'), c(js, 'terminated')]); });
    main.push([]);
    main.push(['ALL JOBS — this is the master list. Department tabs are filtered views of these rows.']);
    const headerRowIndex = main.length; // 0-based row where the job-table header sits
    main.push(cols);
    all.forEach((j) => main.push(row(j)));

    const wMain = XLSX.utils.aoa_to_sheet(main);
    wMain['!cols'] = widths;
    // freeze everything above the job table so the list scrolls under the summary
    wMain['!freeze'] = { xSplit: 0, ySplit: headerRowIndex + 1, topLeftCell: `A${headerRowIndex + 2}`, activePane: 'bottomLeft', state: 'frozen' };
    // enable autofilter on the job table
    const lastCol = XLSX.utils.encode_col(cols.length - 1);
    wMain['!autofilter'] = { ref: `A${headerRowIndex + 1}:${lastCol}${main.length}` };
    XLSX.utils.book_append_sheet(wb, wMain, 'Main');

    /* ===== Projects summary ===== */
    if (state.projects.length) {
      const pr = [['Project', 'Client', 'Site', 'Head', 'Rental', 'Total', 'Running', 'Completed']];
      state.projects.forEach((p) => { const js = all.filter((j) => j.projectId === p.id); const head = state.users.find((u) => u.id === p.headId); pr.push([p.name, p.client, p.location || '', head ? head.name : '', p.isRental ? 'Yes' : '', js.length, c(js, 'running'), c(js, 'completed')]); });
      const wp = XLSX.utils.aoa_to_sheet(pr); wp['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 16 }, { wch: 8 }, { wch: 7 }, { wch: 9 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, wp, 'Projects');
    }

    /* ===== Department tabs: filtered views of Main ===== */
    state.departments.forEach((d) => {
      const js = all.filter((j) => j.deptId === d.id);
      const sheet = [];
      sheet.push([`${d.name} — filtered from Main`]);
      sheet.push([`${js.length} jobs · edit in the Main tab; this view mirrors it.`]);
      sheet.push([]);
      sheet.push(cols);
      js.forEach((j) => sheet.push(row(j)));
      const ws = XLSX.utils.aoa_to_sheet(sheet); ws['!cols'] = widths;
      ws['!autofilter'] = { ref: `A4:${lastCol}${sheet.length}` };
      ws['!freeze'] = { xSplit: 0, ySplit: 4, topLeftCell: 'A5', activePane: 'bottomLeft', state: 'frozen' };
      XLSX.utils.book_append_sheet(wb, ws, d.name.slice(0, 28));
    });

    /* ===== Inventory ===== */
    const inv = [['Item', 'Category', 'Qty', 'Unit', 'On Rent', 'Department', 'Min Level']];
    state.inventory.items.forEach((i) => inv.push([i.name, CATS[i.category], i.qty, i.unit, i.rentedOut || 0, i.deptId ? deptById(i.deptId).name : '', i.minLevel || '']));
    const wi = XLSX.utils.aoa_to_sheet(inv); wi['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 7 }, { wch: 8 }, { wch: 8 }, { wch: 14 }, { wch: 9 }];
    XLSX.utils.book_append_sheet(wb, wi, 'Inventory');

    XLSX.writeFile(wb, `RIGGR_Master_${today}.xlsx`);
  } else {
    const today = new Date().toISOString().slice(0, 10);
    const r = [[`${me.name} — my jobs`], [`exported ${today}`], [], cols, ...visibleJobs.map(row)];
    const ws = XLSX.utils.aoa_to_sheet(r); ws['!cols'] = widths;
    ws['!freeze'] = { xSplit: 0, ySplit: 4, topLeftCell: 'A5', activePane: 'bottomLeft', state: 'frozen' };
    XLSX.utils.book_append_sheet(wb, ws, `${me.name.split(' ')[0]} Log`);
    XLSX.writeFile(wb, `RIGGR_${me.name.split(' ')[0]}_${today}.xlsx`);
  }
}
