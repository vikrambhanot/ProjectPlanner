import React from 'react';
import { Plus, Trash2, MapPin, DollarSign, User } from 'lucide-react';
import { Btn, Card, SectionTitle, EmptyState } from './UI';

export default function ResourcesTab({ state, addResource, updateResource, removeResource }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <SectionTitle style={{ marginBottom: 0 }}>Team resources</SectionTitle>
        <Btn size="sm" variant="accent" onClick={addResource}>
          <Plus size={13} /> Add resource
        </Btn>
      </div>

      {state.resources.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No resources yet"
          desc="Add team members to assign them to workstream tasks."
          action={<Btn variant="accent" size="sm" onClick={addResource}><Plus size={13}/> Add first resource</Btn>}
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Role / title', 'Location', 'Bill rate ($/hr)', 'Cost rate ($/hr)', 'Margin %', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 13,
                    fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.resources.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: idx < state.resources.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '7px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#eff6ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#2563eb', flexShrink: 0
                      }}>
                        {r.name ? r.name[0].toUpperCase() : <User size={12} color="#94a3b8"/>}
                      </div>
                      <input
                        value={r.name}
                        onChange={e => updateResource(r.id, 'name', e.target.value)}
                        placeholder="Full name"
                        style={{ minWidth: 130, border: 'none', background: 'transparent',
                          padding: '2px 0', fontWeight: 500, fontSize: 13, borderBottom: '1px solid #e2e8f0', borderRadius: 0 }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '7px 10px' }}>
                    <input
                      value={r.role}
                      onChange={e => updateResource(r.id, 'role', e.target.value)}
                      placeholder="e.g. Sr. Engineer"
                      style={{ minWidth: 140, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px' }}
                    />
                  </td>
                  <td style={{ padding: '7px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={12} color="#94a3b8" />
                      <select
                        value={r.location}
                        onChange={e => updateResource(r.id, 'location', e.target.value)}
                        style={{ minWidth: 110, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 16, background: '#fff' }}
                      >
                        <option value="">Select…</option>
                        <option value="US">US</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: '7px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <DollarSign size={12} color="#94a3b8" />
                      <input
                        type="number" min={0}
                        value={r.billRate}
                        onChange={e => updateResource(r.id, 'billRate', parseFloat(e.target.value) || 0)}
                        style={{ width: 80, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '7px 10px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <DollarSign size={12} color="#94a3b8" />
    <input
      type="number" min={0}
      value={r.costRate || 0}
      onChange={e => updateResource(r.id, 'costRate', parseFloat(e.target.value) || 0)}
      style={{ width: 80, border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px' }}
    />
  </div>
</td>
<td style={{ padding: '7px 10px' }}>
  {r.costRate > 0 && r.billRate > 0 ? (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: r.billRate > r.costRate ? '#f0fdf4' : '#fef2f2',
      color: r.billRate > r.costRate ? '#15803d' : '#dc2626'
    }}>
      {Math.round(((r.billRate - r.costRate) / r.billRate) * 100)}%
    </span>
  ) : (
    <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>
  )}
</td>
                  <td style={{ padding: '7px 10px', textAlign: 'right' }}>
                    <Btn size="sm" variant="danger" onClick={() => removeResource(r.id)}>
                      <Trash2 size={12} />
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
