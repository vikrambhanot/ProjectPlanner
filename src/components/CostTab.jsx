import React from 'react';
import { Card, SectionTitle, MetricCard } from './UI';
import { calcResourceCosts, calcWorkstreamCosts, fmtCurrency } from '../utils';

export default function CostTab({ state }) {
  const resCosts = calcResourceCosts(state);
  const wsCosts = calcWorkstreamCosts(state);
  const totalCost = Object.values(resCosts).reduce((s, v) => s + v.cost, 0);
  const totalDays = Object.values(resCosts).reduce((s, v) => s + v.days, 0);

  return (
    <div>
      {/* Summary metrics */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <MetricCard label="Total sprints" value={state.totalSprints} sub={`${(state.totalSprints || 0) * 2} weeks`} />
        <MetricCard label="Resources" value={state.resources.length} sub="team members" />
        <MetricCard label="Total effort" value={`${Math.round(totalDays)}d`} sub="at 10 days/sprint" />
        <MetricCard label="Total cost" value={fmtCurrency(totalCost)} sub="bill rate × hours" />
      </div>

      {/* By resource */}
      <Card>
        <SectionTitle>Cost by resource</SectionTitle>
        {state.resources.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Add resources to see cost breakdown.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Resource', 'Role', 'Bill rate', 'Weighted sprints', 'Work days', 'Total cost'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 10px',
                    fontSize: 11, fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.resources.map((r, idx) => {
                const c = resCosts[r.id] || { sprints: 0, days: 0, cost: 0 };
                return (
                  <tr key={r.id} style={{ borderBottom: idx < state.resources.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '7px 10px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#eff6ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
                          {r.name ? r.name[0].toUpperCase() : '?'}
                        </div>
                        {r.name || <span style={{ color: '#94a3b8' }}>(unnamed)</span>}
                      </div>
                    </td>
                    <td style={{ padding: '7px 10px', color: '#64748b' }}>{r.role || '—'}</td>
                    <td style={{ padding: '7px 10px' }}>${r.billRate}/hr</td>
                    <td style={{ padding: '7px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: `${Math.min(100, (c.sprints / (state.totalSprints || 1)) * 100)}%`,
                          maxWidth: 80, height: 6, borderRadius: 3,
                          background: c.sprints > 0 ? '#2563eb' : '#e2e8f0',
                          minWidth: 2, transition: 'width 0.3s'
                        }} />
                        <span>{c.sprints.toFixed(1)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '7px 10px' }}>{Math.round(c.days)}</td>
                    <td style={{ padding: '7px 10px', fontWeight: 600, color: c.cost > 0 ? '#1e293b' : '#94a3b8' }}>
                      {fmtCurrency(c.cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <td colSpan={5} style={{ padding: '7px 10px', fontWeight: 600, fontSize: 13 }}>Total</td>
                <td style={{ padding: '7px 10px', fontWeight: 700, color: '#2563eb', fontSize: 14 }}>
                  {fmtCurrency(totalCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </Card>

      {/* By workstream */}
      <Card>
        <SectionTitle>Cost by workstream</SectionTitle>
        {wsCosts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>Add workstreams to see cost breakdown.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Workstream', 'Task', 'Sprints', 'Task cost', 'Workstream total'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 10px',
                    fontSize: 11, fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wsCosts.map((ws, wsIdx) =>
                ws.tasks.map((t, tIdx) => (
                  <tr key={t.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: wsIdx % 2 === 0 ? 'transparent' : '#fafbfc'
                  }}>
                    {tIdx === 0 && (
                      <td rowSpan={ws.tasks.length} style={{
                        padding: '7px 10px', fontWeight: 600, verticalAlign: 'top', paddingTop: 10,
                        borderRight: '1px solid #f1f5f9'
                      }}>
                        {ws.name}
                      </td>
                    )}
                    <td style={{ padding: '7px 10px', color: '#475569' }}>{t.name}</td>
                    <td style={{ padding: '7px 10px' }}>{t.sprints}</td>
                    <td style={{ padding: '7px 10px' }}>
                      {t.cost > 0 ? fmtCurrency(t.cost) : <span style={{ color: '#94a3b8' }}>—</span>}
                    </td>
                    {tIdx === 0 && (
                      <td rowSpan={ws.tasks.length} style={{
                        padding: '7px 10px', fontWeight: 700, verticalAlign: 'top', paddingTop: 10,
                        color: ws.cost > 0 ? '#2563eb' : '#94a3b8'
                      }}>
                        {fmtCurrency(ws.cost)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <td colSpan={4} style={{ padding: '7px 10px', fontWeight: 600 }}>Grand total</td>
                <td style={{ padding: '7px 10px', fontWeight: 700, color: '#2563eb', fontSize: 14 }}>
                  {fmtCurrency(totalCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </Card>

      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
        Cost formula: sprints × allocation% × 10 work days/sprint × 8 hours/day × bill rate
      </p>
    </div>
  );
}
