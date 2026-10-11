// All the money data and calculations live in this one file.
// Every screen reads from here, so changing one thing updates everything.

export const TOTAL_DAYS = 30;
export const START_BALANCE = 10000;

export const CATEGORIES = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transport', icon: '🚌' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Fun', icon: '🎮' },
  { name: 'Bills', icon: '💡' },
  { name: 'Education', icon: '📚' },
  { name: 'Other', icon: '📦' },
];

export const INCOME_CATEGORY = { name: 'Income', icon: '💰' };

const STORAGE_KEY = 'broke-but-functional-v1';

export const initialState = {
  startingBalance: START_BALANCE,
  currentDay: 1,
  transactions: [],
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.transactions)) {
        return { ...initialState, ...saved };
      }
    }
  } catch (e) {
    // If saved data is broken, we just start fresh.
  }
  return initialState;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Saving can fail in private mode. The app still works.
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        transactions: [
          { id: Date.now() + Math.random(), day: state.currentDay, ...action.payload },
          ...state.transactions,
        ],
      };
    case 'DELETE':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };
    case 'NEXT_DAY':
      return {
        ...state,
        currentDay: Math.min(state.currentDay + 1, TOTAL_DAYS),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function formatMoney(n) {
  const value = Math.round(n);
  const sign = value < 0 ? '-' : '';
  return sign + '₹' + Math.abs(value).toLocaleString('en-IN');
}

const sum = (list) => list.reduce((total, t) => total + t.amount, 0);

// Takes the saved data and works out every number the screens need.
export function compute(state) {
  const { startingBalance, currentDay, transactions } = state;

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const totalSpent = sum(expenses);
  const totalIncome = sum(incomes);
  const balance = startingBalance + totalIncome - totalSpent;

  const daysLeft = TOTAL_DAYS - currentDay + 1; // today counts too
  const safeDaily = Math.max(balance, 0) / daysLeft;

  const spentToday = sum(expenses.filter((t) => t.day === currentDay));

  // Forecast: if you keep spending at your average pace, where do you end up?
  const averageDaily = totalSpent / currentDay;
  const projectedEnd = balance - averageDaily * (TOTAL_DAYS - currentDay);

  let risk = 'Low';
  if (balance <= 0) risk = 'Broke';
  else if (projectedEnd < 0) risk = 'High';
  else if (projectedEnd < startingBalance * 0.15) risk = 'Medium';

  let health;
  if (projectedEnd >= 0) {
    health = 40 + 60 * Math.min(1, projectedEnd / (startingBalance * 0.3));
  } else {
    health = Math.max(0, 40 + (projectedEnd / startingBalance) * 100);
  }
  if (balance <= 0) health = 0;
  health = Math.round(health);

  // Spending per category, biggest first
  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    total: sum(expenses.filter((t) => t.category === c.name)),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return {
    totalSpent,
    totalIncome,
    balance,
    daysLeft,
    safeDaily,
    spentToday,
    averageDaily,
    projectedEnd,
    risk,
    health,
    byCategory,
  };
}
