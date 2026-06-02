export const APP_NAME = 'RIGGR';
export const APP_VERSION = '3.4.1';
export const APP_CODENAME = 'Giant Truss';
export const STATE_KEY = 'riggr:state:v3';
export const PREFS_KEY = 'riggr:prefs:v1';

export const CHANGELOG = [
  { v: '3.4.0', name: 'Profile & Fixes', items: ['Profile editor in Settings — upload a photo and change your display name', 'Press and hold any dashboard card to enter reorder mode (Edit-layout button removed)', 'Footer rebuilt to truly reach the screen edge — no gap', 'Chart date labels locked to a fixed baseline so they align at any bar height', 'Selected bar no longer overshoots the chart'] },
  { v: '3.3.0', name: 'Your Layout', items: ['Drag-to-reorder dashboard cards (Edit layout) — order is saved per device', 'In-app “Update available → Reload” banner when a new version ships — no need to reinstall', 'Bottom bar truly edge-to-edge (removed the stray gap)', 'Chart date labels now sit in a fixed row, aligned regardless of bar height', 'Desktop dashboard alignment tightened'] },
  { v: '3.2.0', name: 'Cleaner', items: ['Bottom bar trimmed to 4 tabs so ＋ sits dead-center; Team moved to a dashboard card', 'Job-volume chart now blends into the page and fades at the edges; tapping a day snaps it to exact center', 'Team: remove a user completely (hard delete)', 'Excel rebuilt — Main tab is the single source (summary on top + every job, with a Department column); department tabs are filtered views with freeze panes + filters'] },
  { v: '3.1.1', name: 'Polish', items: ['Ask-for-update on any job or project — default status request or a specific question, routed to the assignee, department, or project head', 'Job-volume chart now scrolls horizontally only, taller, with readable selected-day labels', 'Bottom bar runs edge-to-edge; larger centred ＋ that overshoots the bar'] },
  { v: '3.1.0', name: 'Any Screen', items: ['Responsive layout — phone, tablet, iPad, desktop', 'Desktop sidebar + multi-column dashboard', 'Pinned bottom bar with centred ＋ to create jobs/projects', 'Tap any job to open its full detail', 'Safe-area padding so header clears the notch'] },
  { v: '3.0.0', name: 'Giant Truss', items: ['Branded RIGGR for Giant Truss · Aashish set as permanent universal admin', 'Job-volume visualizer: scrollable centered bars, Day / Week / Month', 'Projects with per-project stats + dashboard project filter', 'Rental projects: dispatch / return / on-site gear tracking', 'Request-to-generate: crew can request jobs & projects, admin approves', 'Light / dark theme + accent colour picker', 'Reference floating-panel UI redesign'] },
  { v: '2.0.0', name: 'Conneq CRM', items: ['Mobile CRM redesign', 'Inventory, employees, self-registration, editable departments'] },
  { v: '1.0.0', name: 'Control Room', items: ['First build · PIN login · six-state job lifecycle · .xlsx export'] },
];

export const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'];
export const STATUS = {
  pending:   { label: 'Pending',           c: '#9a9b8f' },
  running:   { label: 'Running',           c: '#f4a52a' },
  hold:      { label: 'On Hold',           c: '#8b5cf6' },
  awaiting:  { label: 'Awaiting Approval', c: '#3b82f6' },
  completed: { label: 'Completed',         c: '#5fa83a' },
  terminated:{ label: 'Terminated',        c: '#ef4444' },
};
export const CATS = { raw: 'Raw Material', final: 'Final Product', rental: 'Rental Gear' };
export const ACCENTS = [
  { id: 'lime', c: '#d2f04a', ink: '#1c1c1a', name: 'Chartreuse' },
  { id: 'orange', c: '#f4a52a', ink: '#1c1c1a', name: 'Amber' },
  { id: 'blue', c: '#5b8def', ink: '#ffffff', name: 'Cobalt' },
  { id: 'violet', c: '#9b7bf0', ink: '#ffffff', name: 'Violet' },
  { id: 'coral', c: '#fb6f5a', ink: '#ffffff', name: 'Coral' },
];
