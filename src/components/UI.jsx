import React from 'react';

export function Btn({ children, onClick, variant = 'default', size = 'md', style, ...rest }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
    fontWeight: 500, cursor: 'pointer', border: '1px solid', borderRadius: 8,
    transition: 'all 0.15s', whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { fontSize: 12, padding: '3px 10px' },
    md: { fontSize: 13, padding: '6px 14px' },
  };
  const variants = {
    default: { background: '#fff', borderColor: '#cbd5e1', color: '#1e293b' },
    accent: { background: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' },
    danger: { background: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
    primary: { background: '#2563eb', borderColor: '#2563eb', color: '#fff' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
      padding: '1rem 1.25rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      ...style
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, style }) {
  return (
    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12, ...style }}>
      {children}
    </h3>
  );
}

export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: { background: '#eff6ff', color: '#1d4ed8' },
    green: { background: '#f0fdf4', color: '#15803d' },
    amber: { background: '#fffbeb', color: '#b45309' },
    purple: { background: '#f5f3ff', color: '#6d28d9' },
    gray: { background: '#f8fafc', color: '#475569' },
  };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, ...colors[color]
    }}>
      {children}
    </span>
  );
}

export function MetricCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#f8f9fb', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '14px 18px', flex: 1, minWidth: 120
    }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#1e293b' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#475569', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, marginBottom: 16 }}>{desc}</div>
      {action}
    </div>
  );
}
