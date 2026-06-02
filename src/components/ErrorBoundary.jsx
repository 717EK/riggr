import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error('RIGGR crashed:', err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 560, margin: '40px auto', color: '#1c1c1a' }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>RIGGR hit an error while loading. Details below — and a reset usually fixes it.</p>
          <pre style={{ background: '#f4f3ee', padding: 14, borderRadius: 12, fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{String(this.state.err && this.state.err.stack || this.state.err)}</pre>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: '#1c1c1a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Reload</button>
            <button onClick={() => { try { Object.keys(localStorage).filter(k => k.startsWith('riggr')).forEach(k => localStorage.removeItem(k)); } catch (_) {} window.location.reload(); }} style={{ padding: '10px 16px', borderRadius: 12, border: '1.5px solid #ddd', background: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Reset data & reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
