import { describe, it, expect } from 'vitest';
import { computeFinance } from './finance.js';
import { initialState } from '../state/initialState.js';

const tx = (patch) => ({ id: 't' + Math.random(), type: 'expense', amount: 100, day: 1, category: 'Food', note: '', kind: 'regular', ...patch });
const make = (patch) => ({ ...initialState, ...patch });

describe('computeFinance', () => {
  it('starts with the full budget spread over 30 days', () => {
    const m = computeFinance(initialState);
    expect(m.balance).toBe(10000);
    expect(m.safeDaily).toBeCloseTo(10000 / 30, 5);
    expect(m.risk).toBe('Low');
  });

  it('subtracts expenses and adds income', () => {
    const m = computeFinance(make({ transactions: [tx({ amount: 500 }), tx({ type: 'income', amount: 1000, category: 'Income' })] }));
    expect(m.balance).toBe(10500);
    expect(m.totalSpent).toBe(500);
    expect(m.totalIncome).toBe(1000);
  });

  it('upcoming bills lower the safe daily amount but not the balance', () => {
    const m = computeFinance(make({ obligations: [{ id: 'o1', kind: 'subscription', name: 'Netflix', amount: 300, day: 10 }] }));
    expect(m.balance).toBe(10000);
    expect(m.obligationsUpcoming).toBe(300);
    expect(m.safeDaily).toBeCloseTo(9700 / 30, 5);
  });

  it('a bill due today or earlier is already paid', () => {
    const m = computeFinance(make({ obligations: [{ id: 'o1', kind: 'commitment', name: 'Fees', amount: 700, day: 1 }] }));
    expect(m.balance).toBe(9300);
    expect(m.obligationsUpcoming).toBe(0);
  });

  it('money saved in goals leaves the spendable balance and tracks progress', () => {
    const m = computeFinance(make({
      goals: [{ id: 'g1', name: 'Trip', target: 1000 }],
      transactions: [tx({ type: 'saving', goalId: 'g1', amount: 250, category: 'Savings' })],
    }));
    expect(m.balance).toBe(9750);
    expect(m.totalSaved).toBe(250);
    expect(m.goalProgress[0].percent).toBe(25);
  });

  it('warns High risk and finds the run-out day when spending is too fast', () => {
    const m = computeFinance(make({ currentDay: 5, transactions: [tx({ amount: 4000, day: 3 })] }));
    expect(m.balance).toBe(6000);
    expect(m.projectedEnd).toBeLessThan(0);
    expect(m.risk).toBe('High');
    expect(m.runOutDay).toBe(13);
  });

  it('does not repeat one-off surprise expenses in the forecast', () => {
    const m = computeFinance(make({ currentDay: 2, transactions: [tx({ amount: 1500, kind: 'oneoff', category: 'Unexpected' })] }));
    expect(m.averageDaily).toBe(0);
    expect(m.balance).toBe(8500);
  });

  it('is Critical with a very low health score when no money is free', () => {
    const m = computeFinance(make({ transactions: [tx({ amount: 10000 })] }));
    expect(m.risk).toBe('Critical');
    expect(m.health).toBeLessThanOrEqual(10);
  });

  it('builds a 30 day trajectory that ends at the forecast', () => {
    const m = computeFinance(make({ currentDay: 3, transactions: [tx({ amount: 300, day: 2 })] }));
    expect(m.trajectory).toHaveLength(30);
    expect(m.trajectory[29].balance).toBeCloseTo(m.projectedEnd, 5);
    expect(m.trajectory[2].balance).toBe(m.balance);
  });
});
