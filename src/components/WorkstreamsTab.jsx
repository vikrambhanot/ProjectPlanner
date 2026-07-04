import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, UserPlus, X } from 'lucide-react';
import { Btn, Card, SectionTitle, EmptyState, Badge } from './UI';

import { taskDateRange, fmt, calcOverallocation } from '../utils';

function AllocationWarnings({ state }) {
  const warnings = calcOverallocation(state);
  const entries = Object.entries(warnings);
  if (entries.length === 0) return null;

  return (
    <div style={{
      background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10,
      padding: '10px 14px', marginBottom: 14
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>⚠️</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>
          Resource over-allocation detected
        </span>
      </div>
      {entries.map(([resourceId, overloaded]) => {
        const resource = state.resources.find(r => r.id === resourceId);
        return (
          <div key={resourceId} style={{ fontSize: 12, color: '#78350f', marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{resource?.name || '(unnamed)'}</span>
            {resource?.role && <span style={{ color: '#a16207' }}> ({resource.role})</span>}
           {` — over 100% in sprint${overloaded.length > 1 ? 's' : ''}: `}
            {overloaded.map((o, i) => (
              <span key={o.sprint}>
                <span style={{
                  display: 'inline-block', background: '#fef3c7',
                  border: '1px solid #fcd34d', borderRadius: 99,
                  padding: '1px 7px', fontSize: 11, fontWeight: 600, color: '#92400e'
                }}>
                  S{o.sprint + 1}: {Math.round(o.pct)}%
                </span>
                {i < overloaded.length - 1 && ' '}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}


function DependencyCell({ value, onChange }) {
  const [input, setInput] = React.useState('');
  const pills = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      const next = [...pills, input.trim()].join(', ');
      onChange(next);
      setInput('');
    }
  }

  function removePill(pill) {
    const next = pills.filter(p => p !== pill).join(', ');
    onChange(next);
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', minWidth: 140 }}>
      {pills.map(p => (
        <span key={p} style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: '#eff6ff', border: '1px solid #bfdbfe',
          color: '#1d4ed8', borderRadius: 99, fontSize: 11,
          fontWeight: 500, padding: '2px 8px'
        }}>
          {p}
          <button
            onClick={() => removePill(p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: '#93c5fd', padding: 0, lineHeight: 1, fontSize: 12 }}
          >×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add… Enter"
        style={{ border: 'none', outline: 'none', fontSize: 11,
          background: 'transparent', minWidth: 70, padding: '2px 0' }}
      />
    </div>
  );
}

function AllocationRow({ alloc, resources, wsId, taskId, updateAllocation, removeAllocation }) {
  const res = resources.find(r => r.id === alloc.resourceId);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
      <select
        value={alloc.resourceId}
        onChange={e => updateAllocation(wsId, taskId, alloc.id, 'resourceId', e.target.value)}
        style={{ fontSize: 12, padding: '3px 6px', minWidth: 120 }}
      >
        {resources.map(r => (
          <option key={r.id} value={r.id}>{r.name || '(unnamed)'}{r.role ? ` — ${r.role}` : ''}</option>
        ))}
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          type="number" min={5} max={200} step={5}
          value={alloc.pct}
          onChange={e => updateAllocation(wsId, taskId, alloc.id, 'pct', Math.max(5, parseFloat(e.target.value) || 0))}
          style={{ width: 60, fontSize: 12, padding: '3px 6px', textAlign: 'center' }}
        />
        <span style={{ fontSize: 11, color: '#64748b' }}>%</span>
      </div>
      {alloc.pct > 100 && (
        <span style={{ fontSize: 10, color: '#d97706', fontWeight: 500 }}>split</span>
      )}
      <button
        onClick={() => removeAllocation(wsId, taskId, alloc.id)}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
          display: 'flex', alignItems: 'center', padding: 2 }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

function handlePrint() {
  window.print();
}

function TaskRow({ task, ws, sprintOffset, totalSprints, resources,
  updateTask, removeTask,  moveTask, addAllocation, updateAllocation, removeAllocation }) {

  const dateRange = ws.id && task && resources && sprintOffset !== undefined
    ? null : null; // computed below

  const startDate = (() => {
    // project start date is passed via ws.projectStart (injected in parent)
    if (!ws.projectStart) return null;
    return taskDateRange(new Date(ws.projectStart), sprintOffset, task.sprints);
  })();

  const overBudget = sprintOffset + task.sprints > totalSprints;

  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '8px 10px' }}>
        <input
          value={task.name}
          onChange={e => updateTask(ws.id, task.id, 'name', e.target.value)}
          style={{ minWidth: 110, border: 'none', background: 'transparent',
            borderBottom: '1px solid #e2e8f0', borderRadius: 0, padding: '2px 0', fontWeight: 500 }}
        />
      </td>
<td style={{ padding: '8px 10px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Start sprint</label>
      <input
        type="number" min={1} max={totalSprints || 52}
        value={(task.startSprint || 0) + 1}
        onChange={e => updateTask(ws.id, task.id, 'startSprint', Math.max(0, parseInt(e.target.value) - 1) || 0)}
        style={{ width: 64, textAlign: 'center', fontSize: 13 }}
      />
    </div>
    <span style={{ color: '#cbd5e1', paddingTop: 14 }}>→</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <label style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Duration</label>
      <input
        type="number" min={1} max={52}
        value={task.sprints}
        onChange={e => updateTask(ws.id, task.id, 'sprints', Math.max(1, parseInt(e.target.value) || 1))}
        style={{ width: 64, textAlign: 'center', fontSize: 13 }}
      />
    </div>
  </div>
</td>
<td style={{ padding: '8px 10px' }}>
  {ws.projectStart ? (() => {
    const range = taskDateRange(new Date(ws.projectStart), task.startSprint || 0, task.sprints);
    const end = (task.startSprint || 0) + task.sprints;
    const over = end > (ws.totalSprints || 99);
    return (
      <div>
        <div style={{ fontSize: 11, color: over ? '#dc2626' : '#475569', fontWeight: 500 }}>
          {fmt(range.start)} – {fmt(range.end)}
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8' }}>
          Sprint {(task.startSprint || 0) + 1} – {end}
          {over && <span style={{ color: '#dc2626', marginLeft: 4 }}>over budget</span>}
        </div>
      </div>
    );
  })() : <span style={{ fontSize: 11, color: '#94a3b8' }}>Set project start</span>}
</td>

<td style={{ padding: '8px 10px' }}>
  <DependencyCell
    value={task.dependencies || ''}
    onChange={val => updateTask(ws.id, task.id, 'dependencies', val)}
  />
</td>

      <td style={{ padding: '8px 10px', minWidth: 220 }}>
        {task.allocations.map(a => (
          <AllocationRow
            key={a.id} alloc={a} resources={resources}
            wsId={ws.id} taskId={task.id}
            updateAllocation={updateAllocation}
            removeAllocation={removeAllocation}
          />
        ))}
        {resources.length > 0 ? (
          <button
            onClick={() => addAllocation(ws.id, task.id, resources[0].id)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
              color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            <UserPlus size={11} /> Assign
          </button>
        ) : (
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Add resources first</span>
        )}
      </td>
<td style={{ padding: '8px 10px', textAlign: 'right' }}>
  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
    <Btn size="sm" onClick={() => moveTask(ws.id, task.id, 'up')}
      style={{ padding: '3px 7px', color: '#64748b' }} title="Move up">
      <ChevronUp size={13} />
    </Btn>
    <Btn size="sm" onClick={() => moveTask(ws.id, task.id, 'down')}
      style={{ padding: '3px 7px', color: '#64748b' }} title="Move down">
      <ChevronDown size={13} />
    </Btn>
    <Btn size="sm" variant="danger" onClick={() => removeTask(ws.id, task.id)}>
      <Trash2 size={12} />
    </Btn>
  </div>
</td>
    </tr>
  );
}

function WorkstreamCard({ ws, resources, totalSprints, projectStart,
  updateWorkstream, removeWorkstream,
  addTask, updateTask, removeTask,moveTask,
  addAllocation, updateAllocation, removeAllocation  }) {

  const [collapsed, setCollapsed] = React.useState(false);

  // inject projectStart into ws so TaskRow can compute dates
  const wsWithMeta = { ...ws, projectStart };

  let offset = 0;
  const totalWsSprints = ws.tasks.reduce((s, t) => s + t.sprints, 0);
  const overBudget = totalWsSprints > totalSprints;

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: collapsed ? 0 : 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: overBudget ? '#dc2626' : '#2563eb', flexShrink: 0
        }} />
        <input
          value={ws.name}
          onChange={e => updateWorkstream(ws.id, 'name', e.target.value)}
          style={{ fontWeight: 600, fontSize: 14, border: 'none', background: 'transparent',
            flex: 1, color: '#1e293b', padding: '2px 0', borderBottom: '1.5px solid #e2e8f0', borderRadius: 0 }}
        />
        <Badge color={overBudget ? 'amber' : 'blue'}>
          {totalWsSprints} sprint{totalWsSprints !== 1 ? 's' : ''}
        </Badge>
        <Btn size="sm" variant="accent" onClick={() => addTask(ws.id)}>
          <Plus size={12} /> Task
        </Btn>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
            display: 'flex', alignItems: 'center', padding: 4 }}
        >
          {collapsed ? <ChevronDown size={15}/> : <ChevronUp size={15}/>}
        </button>
        <Btn size="sm" variant="danger" onClick={() => removeWorkstream(ws.id)}>
          <Trash2 size={12} />
        </Btn>
      </div>

      {!collapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Task', 'Sprints', 'Dates', 'Dependencies', 'Assignments', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 10px',
                    fontSize: 11, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ws.tasks.map(task => {
                const row = (
                  <TaskRow
                    key={task.id}
                    task={task}
                    ws={wsWithMeta}
                    sprintOffset={offset}
                    totalSprints={totalSprints}
                    resources={resources}
                    updateTask={updateTask}
                    removeTask={removeTask}
                      moveTask={moveTask}
                    addAllocation={addAllocation}
                    updateAllocation={updateAllocation}
                    removeAllocation={removeAllocation}
                  />
                );
                offset += task.sprints;
                return row;
              })}
            </tbody>
          </table>
          {ws.tasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: 13 }}>
              No tasks — <button onClick={() => addTask(ws.id)}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 13 }}>
                add one
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function WorkstreamsTab({
  state, addWorkstream, updateWorkstream, removeWorkstream,
  addTask, updateTask, removeTask, moveTask,
  addAllocation, updateAllocation, removeAllocation
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
  <div>
    <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Workstreams</h3>
    <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
      Tasks run sequentially within each workstream. Assign resources with % allocation.
    </p>
  </div>
  <div style={{ display: 'flex', gap: 8 }}>
    <Btn variant="default" size="sm" onClick={handlePrint}>
      🖨️ Print
    </Btn>
    <Btn variant="accent" size="sm" onClick={addWorkstream}>
      <Plus size={13} /> Add workstream
    </Btn>
  </div>
</div>
<AllocationWarnings state={state} />
<div id="print-area">
      {state.workstreams.length === 0 ? (
        <Card>
          <EmptyState
            icon="📋"
            title="No workstreams yet"
            desc="Each workstream groups related tasks. Tasks run sequentially with auto-computed sprint dates."
            action={<Btn variant="accent" size="sm" onClick={addWorkstream}><Plus size={13}/> Add workstream</Btn>}
          />
        </Card>
      ) : (
        state.workstreams.map(ws => (
          <WorkstreamCard
            key={ws.id}
            ws={ws}
            resources={state.resources}
            totalSprints={state.totalSprints}
            projectStart={state.startDate}
            updateWorkstream={updateWorkstream}
            removeWorkstream={removeWorkstream}
            addTask={addTask}
            updateTask={updateTask}
            removeTask={removeTask}
              moveTask={moveTask}
            addAllocation={addAllocation}
            updateAllocation={updateAllocation}
            removeAllocation={removeAllocation}
          />
        ))
      )}
      </div>
    </div>
  );
}
