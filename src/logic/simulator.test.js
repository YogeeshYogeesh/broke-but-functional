import { describe, it, expect } from 'vitest';
import { simulate } from './simulator.js';
import { initialState } from '../state/initialState.js';

describe('simulate', () => {
  it('shows the effect of a purchase without changing the real state', () => {
    const action = { type: 'ADD_TRANSACTION', payload: { type: 'expense', amount: 2000, category: 'Shopping', note: 'Shoes', kind: 'oneoff' } };
    const result = simulate(initialState, action);
    expect(result.before.balance).toBe(10000);
    expect(result.after.balance).toBe(8000);
    expect(result.changed).toBe(true);
    expect(initialState.transactions).toHaveLength(0);
  });

  it('warns when a decision leaves no free money', () => {
    const action = { type: 'ADD_TRANSACTION', payload: { type: 'expense', amount: 10000, category: 'Shopping', note: 'Everything', kind: 'oneoff' } };
    const result = simulate(initialState, action);
    expect(result.after.risk).toBe('Critical');
    expect(result.verdict.level).toBe('bad');
  });

  it('shows a new subscription lowering the safe daily amount', () => {
    const action = { type: 'ADD_OBLIGATION', payload: { kind: 'subscription', name: 'Spotify', amount: 300, day: 15 } };
    const result = simulate(initialState, action);
    expect(result.after.safeDaily).toBeLessThan(result.before.safeDaily);
  });

  it('reports when the decision cannot be applied', () => {
    const result = simulate(initialState, { type: 'CONTRIBUTE', goalId: 'nope', amount: 100 });
    expect(result.changed).toBe(false);
  });
});
