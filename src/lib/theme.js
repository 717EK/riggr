import { ACCENTS } from '../data/constants.js';

export function themeVars(mode, accentId) {
  const a = ACCENTS.find((x) => x.id === accentId) || ACCENTS[0];
  const base = mode === 'dark' ? {
    '--bg': '#0a0b09', '--app': '#121310', '--card': '#1c1e18', '--card2': '#23251c',
    '--text': '#edeee5', '--ink': '#edeee5', '--muted': '#909285', '--faint': '#6d6f63',
    '--line': '#26281f', '--line2': '#30332a', '--hero': '#000000', '--hero-text': '#f3f2ec',
    '--olive': '#5a6549', '--olive-text': '#edeee5',
    '--shadow': '0 1px 2px rgba(0,0,0,.5),0 12px 30px rgba(0,0,0,.45)', '--shadow-sm': '0 1px 2px rgba(0,0,0,.4),0 5px 14px rgba(0,0,0,.35)',
  } : {
    '--bg': '#e4e3da', '--app': '#f3f2ec', '--card': '#ffffff', '--card2': '#fbfbf6',
    '--text': '#1c1c1a', '--ink': '#1c1c1a', '--muted': '#7d7e72', '--faint': '#a9a99d',
    '--line': '#edebe1', '--line2': '#e3e1d5', '--hero': '#1c1c1a', '--hero-text': '#f3f2ec',
    '--olive': '#aeb89c', '--olive-text': '#1c1c1a',
    '--shadow': '0 1px 2px rgba(28,28,26,.05),0 12px 30px rgba(28,28,26,.08)', '--shadow-sm': '0 1px 2px rgba(28,28,26,.05),0 5px 14px rgba(28,28,26,.06)',
  };
  return { ...base, '--accent': a.c, '--accent-ink': a.ink };
}
