import { RISK_ORDER } from '../constants.js';
import { reducer } from '../state/reducer.js';
import { computeFinance } from './finance.js';

// The simulator tries a decision on a COPY of your data.
// It uses the same reducer as the real app, so the preview is always honest.
export function simulate(state, action) {
  const before = computeFinance(state);
  const nextState = reducer(state, action);
  const after = computeFinance(nextState);
  return { before, after, changed: nextState !== state, verdict: getVerdict(before, after) };
}

export function getVerdict(before, after) {
  if (after.risk === 'Critical' && before.risk !== 'Critical') {
    return { level: 'bad', text: 'This would leave you with no free money for the rest of the month.' };
  }
  if (after.projectedEnd < 0 && before.projectedEnd >= 0) {
    return { level: 'bad', text: 'This pushes your forecast below zero. You would run out before day 30.' };
  }
  if (RISK_ORDER[after.risk] > RISK_ORDER[before.risk]) {
    return { level: 'warn', text: `Your risk goes up from ${before.risk} to ${after.risk}.` };
  }
  if (after.health <= before.health - 10) {
    return { level: 'warn', text: 'This is a big hit to your money health score.' };
  }
  return { level: 'good', text: 'You can afford this without raising your risk level.' };
}
