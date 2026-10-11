import { describe, it, expect } from 'vitest';
import { reducer } from './reducer.js';
import { initialState } from './initialState.js';
import { computeFinance } from '../logic/finance.js';

const addExpense = (state, amount) =>
  reducer(state, { type: 'ADD_TRANSACTION', payload: { type: 'expense', amount, category: 'Food', note: 'x' } });

describe('reducer', () => {
  it('adds a transaction on the current day', () => {
    const s = addExpense(initialState, 250);
    expect(s.transactions).toHaveLength(1);
    expect(s.transactions[0].day).toBe(1);
    expect(s.transactions[0].amount).toBe(250);
  });

  it('ignores invalid transactions without changing state', () => {
    expect(addExpense(initialState, -5)).toBe(initialState);
    expect(addExpense(initialState, 'abc')).toBe(initialState);
  });

  it('cleans notes before saving', () => {
    const s = reducer(initialState, { type: 'ADD_TRANSACTION', payload: { type: 'expense', amount: 10, category: 'Food', note: '<b>hi</b>' } });
    expect(s.transactions[0].note).toBe('bhi/b');
  });

  it('moves to the next day but never past day 30', () => {
    let s = reducer(initialState, { type: 'NEXT_DAY' });
    expect(s.currentDay).toBe(2);
    s = { ...s, currentDay: 30 };
    expect(reducer(s, { type: 'NEXT_DAY' }).currentDay).toBe(30);
  });

  it('adds subscriptions and rejects bad ones', () => {
    const ok = reducer(initialState, { type: 'ADD_OBLIGATION', payload: { kind: 'subscription', name: 'Netflix', amount: 199, day: 12 } });
    expect(ok.obligations).toHaveLength(1);
    expect(reducer(initialState, { type: 'ADD_OBLIGATION', payload: { kind: 'subscription', name: '', amount: 199, day: 12 } })).toBe(initialState);
    expect(reducer(initialState, { type: 'ADD_OBLIGATION', payload: { kind: 'subscription', name: 'X', amount: 199, day: 45 } })).toBe(initialState);
  });

  it('saving never goes above the money you have or the goal target', () => {
    let s = reducer(initialState, { type: 'ADD_GOAL', payload: { name: 'Phone', target: 500 } });
    const id = s.goals[0].id;
    s = reducer(s, { type: 'CONTRIBUTE', goalId: id, amount: 9999 });
    expect(computeFinance(s).goalProgress[0].saved).toBe(500);
    expect(computeFinance(s).balance).toBe(9500);
  });


  it('does not add saving transactions after the transaction limit is reached', () => {
    let s = reducer(initialState, { type: 'ADD_GOAL', payload: { name: 'Laptop', target: 500 } });
    const goalId = s.goals[0].id;
    s = {
      ...s,
      transactions: Array.from({ length: 300 }, (_, index) => ({
        id: `tx-${index}`,
        type: 'expense',
        amount: 1,
        day: 1,
        category: 'Food',
        note: '',
        kind: 'regular',
      })),
    };

    expect(reducer(s, { type: 'CONTRIBUTE', goalId, amount: 10 })).toBe(s);
    expect(s.transactions).toHaveLength(300);
  });

  it('deleting a goal returns the saved money', () => {
    let s = reducer(initialState, { type: 'ADD_GOAL', payload: { name: 'Phone', target: 500 } });
    const id = s.goals[0].id;
    s = reducer(s, { type: 'CONTRIBUTE', goalId: id, amount: 200 });
    s = reducer(s, { type: 'DELETE_GOAL', id });
    expect(computeFinance(s).balance).toBe(10000);
  });

  it('resets everything', () => {
    const s = addExpense(initialState, 100);
    expect(reducer(s, { type: 'RESET' })).toEqual(initialState);
  });
});
