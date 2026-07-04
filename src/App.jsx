import React, { useState } from 'react';
import { useProjectState } from './hooks/useProjectState';
import ProjectHeader from './components/ProjectHeader';
import ResourcesTab from './components/ResourcesTab';
import WorkstreamsTab from './components/WorkstreamsTab';
import TimelineTab from './components/TimelineTab';
import CostTab from './components/CostTab';

const TABS = [
  { id: 'resources', label: 'Resources', icon: '👤' },
  { id: 'workstreams', label: 'Workstreams', icon: '📋' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'cost', label: 'Cost summary', icon: '💰' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('resources');
  const handlers = useProjectState();
  const { state } = handlers;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ProjectHeader
        state={state}
        updateProject={handlers.updateProject}
        exportJSON={handlers.exportJSON}
        importJSON={handlers.importJSON}
        resetProject={handlers.resetProject}
      />

      {/* Tab bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 1.5rem', display: 'flex', gap: 2
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 16px', fontSize: 13, fontWeight: 500,
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              borderBottom: `2px solid ${activeTab === tab.id ? '#2563eb' : 'transparent'}`,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s'
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            {tab.label}
            {tab.id === 'resources' && state.resources.length > 0 && (
              <span style={{
                background: '#eff6ff', color: '#2563eb', borderRadius: 99,
                fontSize: 10, fontWeight: 700, padding: '1px 6px'
              }}>
                {state.resources.length}
              </span>
            )}
            {tab.id === 'workstreams' && state.workstreams.length > 0 && (
              <span style={{
                background: '#eff6ff', color: '#2563eb', borderRadius: 99,
                fontSize: 10, fontWeight: 700, padding: '1px 6px'
              }}>
                {state.workstreams.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, padding: '1.5rem', maxWidth: 1100, width: '100%', margin: '0 auto', alignSelf: 'stretch' }}>
        {activeTab === 'resources' && (
          <ResourcesTab
            state={state}
            addResource={handlers.addResource}
            updateResource={handlers.updateResource}
            removeResource={handlers.removeResource}
          />
        )}
        {activeTab === 'workstreams' && (
          <WorkstreamsTab
            state={state}
            addWorkstream={handlers.addWorkstream}
            updateWorkstream={handlers.updateWorkstream}
            removeWorkstream={handlers.removeWorkstream}
            addTask={handlers.addTask}
            updateTask={handlers.updateTask}
            removeTask={handlers.removeTask}
            moveTask={handlers.moveTask}
            addAllocation={handlers.addAllocation}
            updateAllocation={handlers.updateAllocation}
            removeAllocation={handlers.removeAllocation}
          />
        )}
        {activeTab === 'timeline' && <TimelineTab state={state} />}
        {activeTab === 'cost' && <CostTab state={state} />}
      </div>

      <div style={{ textAlign: 'center', padding: '1rem', fontSize: 11, color: '#cbd5e1',
        borderTop: '1px solid #f1f5f9' }}>
        Auto-saved to browser · Export JSON to share or back up
      </div>
    </div>
  );
}
