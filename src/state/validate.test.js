import { describe, it, expect } from 'vitest';
import { sanitizeState } from './validate.js';
import { initialState } from './initialState.js';

describe('sanitizeState', () => {
  it('falls back to the starting state for garbage', () => {
    expect(sanitizeState('hello')).toEqual(initialState);
    expect(sanitizeState(null)).toEqual(initialState);
    expect(sanitizeState([1, 2])).toEqual(initialState);
  });

  it('drops invalid items and keeps valid ones', () => {
    const s = sanitizeState({
      currentDay: 4,
      transactions: [
        { id: 'a', type: 'expense', amount: 100, day: 2, category: 'Food', note: 'ok' },
        { id: 'b', type: 'hack', amount: 100, day: 2 },
        { id: 'c', type: 'expense', amount: -50, day: 2 },
        'nonsense',
      ],
    });
    expect(s.transactions).toHaveLength(1);
    expect(s.transactions[0].id).toBe('a');
  });

  it('keeps the day inside 1 to 30', () => {
    expect(sanitizeState({ currentDay: 99 }).currentDay).toBe(30);
    expect(sanitizeState({ currentDay: -3 }).currentDay).toBe(1);
  });

  it('removes savings that point to a missing goal', () => {
    const s = sanitizeState({
      transactions: [{ id: 's1', type: 'saving', amount: 50, day: 1, goalId: 'missing' }],
    });
    expect(s.transactions).toHaveLength(0);
  });

  it('cleans text and unknown categories', () => {
    const s = sanitizeState({
      transactions: [{ id: 'a', type: 'expense', amount: 10, day: 1, category: 'Weird', note: '<img src=x>' }],
    });
    expect(s.transactions[0].category).toBe('Other');
    expect(s.transactions[0].note).toBe('img src=x');
  });
});
