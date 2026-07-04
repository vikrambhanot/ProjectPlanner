import React from 'react';
import { Card } from './UI';
import { sprintToDate, fmt } from '../utils';

const COLORS = [
  { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
  { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
];

export default function TimelineTab({ state }) {
  const { startDate, totalSprints, workstreams } = state;

  const sprints = Array.from({ length: totalSprints }, (_, i) => i);

  const sprintLabels = sprints.map(i => {
    if (startDate) {
      const d = sprintToDate(new Date(startDate), i);
      return `S${i + 1}\n${fmt(d)}`;
    }
    return `S${i + 1}`;
  });

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Sprint timeline</h3>
        <button
          onClick={() => window.print()}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '4px 12px', fontSize: 13, cursor: 'pointer', color: '#475569' }}
        >
          🖨️ Print
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
        Each sprint = 2 weeks. Tasks can start at any sprint.
        {!startDate && ' Set a project start date to see calendar dates.'}
      </p>

      {workstreams.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: 13 }}>Add workstreams to see the timeline.</p>
      ) : (
        <div id="print-area-timeline">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: '#64748b', minWidth: 100, borderBottom: '1px solid #e2e8f0' }}>
                    Workstream
                  </th>
                  <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: '#64748b', minWidth: 90, borderBottom: '1px solid #e2e8f0' }}>
                    Task
                  </th>
                  {sprints.map(i => (
                    <th key={i} style={{
                      padding: '4px 2px', textAlign: 'center', fontSize: 10,
                      fontWeight: 600, color: '#94a3b8', minWidth: 34,
                      borderBottom: '1px solid #e2e8f0', whiteSpace: 'pre', lineHeight: 1.3
                    }}>
                      {sprintLabels[i]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workstreams.map((ws, wsIdx) => {
                  const color = COLORS[wsIdx % COLORS.length];
                  return ws.tasks.map((task, tIdx) => {
                    const taskStart = task.startSprint || 0;
                    const taskEnd = taskStart + task.sprints - 1;
                    return (
                      <tr key={task.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        {tIdx === 0 && (
                          <td rowSpan={ws.tasks.length} style={{
                            padding: '6px 10px', fontWeight: 600, fontSize: 12,
                            verticalAlign: 'top', paddingTop: 10,
                            borderRight: '1px solid #f1f5f9', color: '#1e293b'
                          }}>
                            {ws.name}
                          </td>
                        )}
                        <td style={{ padding: '5px 10px', color: '#475569', whiteSpace: 'nowrap' }}>
                          {task.name}
                        </td>
                        {sprints.map(s => {
                          const active = s >= taskStart && s <= taskEnd;
                          const isFirst = s === taskStart;
                          const isLast = s === taskEnd;
                          return (
                            <td key={s} style={{ padding: '3px 2px', textAlign: 'center' }}>
                              {active ? (
                                <div style={{
                                  height: 20, margin: '0 1px',
                                  background: color.bg,
                                  border: `1px solid ${color.border}`,
                                  borderRadius: isFirst && isLast ? 6
                                    : isFirst ? '6px 2px 2px 6px'
                                    : isLast ? '2px 6px 6px 2px' : 2,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  {isFirst && task.sprints <= 2 && (
                                    <span style={{ fontSize: 9, color: color.text, fontWeight: 600,
                                      overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                      {task.name.slice(0, 4)}
                                    </span>
                                  )}
                                </div>
                              ) : <div style={{ height: 20 }} />}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14, paddingTop: 12,
            borderTop: '1px solid #f1f5f9' }}>
            {workstreams.map((ws, i) => {
              const c = COLORS[i % COLORS.length];
              return (
                <div key={ws.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 14, height: 10, borderRadius: 3,
                    background: c.bg, border: `1px solid ${c.border}` }} />
                  <span style={{ fontSize: 11, color: '#475569' }}>{ws.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}