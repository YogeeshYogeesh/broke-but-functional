import { LIMITS, TOTAL_DAYS } from '../constants.js';
import { computeFinance } from '../logic/finance.js';
import { initialState } from './initialState.js';
import { cleanGoal, cleanObligation, cleanTransaction } from './validate.js';
import { makeId } from '../utils/id.js';
import { parseAmount } from '../utils/sanitize.js';

// The reducer is the only place that changes data.
// Every action is re-checked here, so bad data can never get in.
export function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      if (state.transactions.length >= LIMITS.maxItems) return state;
      const tx = cleanTransaction({ ...action.payload, id: makeId(), day: state.currentDay });
      if (!tx || tx.type === 'saving') return state;
      return { ...state, transactions: [tx, ...state.transactions] };
    }

    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.id) };

    case 'ADD_OBLIGATION': {
      if (state.obligations.length >= LIMITS.maxItems) return state;
      const item = cleanObligation({ ...action.payload, id: makeId() });
      if (!item) return state;
      return { ...state, obligations: [...state.obligations, item] };
    }

    case 'DELETE_OBLIGATION':
      return { ...state, obligations: state.obligations.filter((o) => o.id !== action.id) };

    case 'ADD_GOAL': {
      if (state.goals.length >= LIMITS.maxItems) return state;
      const goal = cleanGoal({ ...action.payload, id: makeId() });
      if (!goal) return state;
      return { ...state, goals: [...state.goals, goal] };
    }

    case 'DELETE_GOAL':
      // Deleting a goal gives its saved money back to your balance.
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
        transactions: state.transactions.filter(
          (t) => !(t.type === 'saving' && t.goalId === action.id)
        ),
      };

    case 'CONTRIBUTE': {
      // Saving contributions create transactions too, so enforce the same
      // collection limit used by the other transaction-producing actions.
      if (state.transactions.length >= LIMITS.maxItems) return state;

      const goal = state.goals.find((g) => g.id === action.goalId);
      const amount = parseAmount(action.amount);
      if (!goal || amount === null) return state;

      const m = computeFinance(state);
      const saved = m.goalProgress.find((g) => g.id === goal.id).saved;
      // You cannot save more than you have, or more than the goal needs.
      const room = Math.min(amount, m.balance, goal.target - saved);
      const allowed = Math.floor(room * 100) / 100;
      if (allowed <= 0) return state;

      const tx = cleanTransaction({
        id: makeId(),
        type: 'saving',
        amount: allowed,
        day: state.currentDay,
        category: 'Savings',
        goalId: goal.id,
      });
      return tx ? { ...state, transactions: [tx, ...state.transactions] } : state;
    }

    case 'NEXT_DAY':
      return { ...state, currentDay: Math.min(state.currentDay + 1, TOTAL_DAYS) };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
