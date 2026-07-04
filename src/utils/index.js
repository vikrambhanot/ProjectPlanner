export const uuid = () => Math.random().toString(36).slice(2, 9);

export const DEFAULT_TASKS = ['Design', 'LLD', 'Dev', 'Test', 'Prod'];

export const SPRINT_DAYS = 14; // calendar days per sprint
export const WORK_DAYS_PER_SPRINT = 10;
export const HOURS_PER_DAY = 8;

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function calcOverallocation(state) {
  // For each resource, build a map of sprint -> total % allocated
  const resourceSprints = {}; // { resourceId: { sprintNum: totalPct } }

  state.resources.forEach(r => {
    resourceSprints[r.id] = {};
  });

  state.workstreams.forEach(ws => {
    ws.tasks.forEach(t => {
      const taskStart = t.startSprint || 0;
      t.allocations.forEach(a => {
        if (!resourceSprints[a.resourceId]) return;
        for (let s = taskStart; s < taskStart + t.sprints; s++) {
          resourceSprints[a.resourceId][s] = (resourceSprints[a.resourceId][s] || 0) + a.pct;
        }
      });
    });
  });

  // Build warnings: { resourceId: [{ sprint, pct }] }
  const warnings = {};
  Object.entries(resourceSprints).forEach(([resourceId, sprints]) => {
    const overloaded = Object.entries(sprints)
      .filter(([, pct]) => pct > 100)
      .map(([sprint, pct]) => ({ sprint: parseInt(sprint), pct }))
      .sort((a, b) => a.sprint - b.sprint);
    if (overloaded.length > 0) warnings[resourceId] = overloaded;
  });

  return warnings;
}
export function sprintToDate(projectStart, sprintOffset) {
  // sprintOffset is 0-based sprint index from project start
  return addDays(projectStart, sprintOffset * SPRINT_DAYS);
}

export function taskDateRange(projectStart, sprintOffset, numSprints) {
  const start = sprintToDate(projectStart, sprintOffset);
  const end = addDays(start, numSprints * SPRINT_DAYS - 1);
  return { start, end };
}

export function projectEndDate(projectStart, totalSprints) {
  return addDays(projectStart, totalSprints * SPRINT_DAYS - 1);
}

export function fmt(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export function fmtCurrency(n) {
  return '$' + Math.round(n).toLocaleString();
}

export function calcResourceCosts(state) {
  const costs = {};
  state.resources.forEach(r => {
    costs[r.id] = { sprints: 0, days: 0, cost: 0 };
  });

  state.workstreams.forEach(ws => {
    ws.tasks.forEach(t => {
      t.allocations.forEach(a => {
        if (!costs[a.resourceId]) return;
        const weighted = t.sprints * (a.pct / 100);
        const days = weighted * WORK_DAYS_PER_SPRINT;
        const cost = days * HOURS_PER_DAY * (state.resources.find(r => r.id === a.resourceId)?.billRate || 0);
        costs[a.resourceId].sprints += weighted;
        costs[a.resourceId].days += days;
        costs[a.resourceId].cost += cost;
      });
    });
  });

  return costs;
}

export function calcWorkstreamCosts(state) {
  return state.workstreams.map(ws => {
    let wsCost = 0;
    const tasks = ws.tasks.map(t => {
      let taskCost = 0;
      t.allocations.forEach(a => {
        const r = state.resources.find(x => x.id === a.resourceId);
        if (!r) return;
        const days = t.sprints * (a.pct / 100) * WORK_DAYS_PER_SPRINT;
        taskCost += days * HOURS_PER_DAY * r.billRate;
      });
      wsCost += taskCost;
      return { ...t, cost: taskCost };
    });
    return { ...ws, tasks, cost: wsCost };
  });
}

export function buildDefaultState() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: 'New Project',
    startDate: today,
    totalSprints: 8,
    resources: [],
    workstreams: [],
  };
}

export function saveToLocalStorage(state) {
  localStorage.setItem('projectPlanner_state', JSON.stringify(state));
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('projectPlanner_state');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
