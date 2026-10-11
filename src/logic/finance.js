import { CATEGORY_ICONS, TOTAL_DAYS } from '../constants.js';

const sum = (list) => list.reduce((total, item) => total + item.amount, 0);
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Takes the saved data and works out every number the screens need.
// It is a pure function: same data in, same numbers out. No React inside.
export function computeFinance(state) {
  const { startingBalance, currentDay, transactions, obligations, goals } = state;

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');
  const savings = transactions.filter((t) => t.type === 'saving');

  const regularSpent = sum(expenses.filter((t) => t.kind !== 'oneoff'));
  const oneOffSpent = sum(expenses.filter((t) => t.kind === 'oneoff'));

  // Bills already charged vs bills still coming this month.
  const paidObligations = obligations.filter((o) => o.day <= currentDay);
  const upcomingObligations = obligations.filter((o) => o.day > currentDay);
  const obligationsPaid = sum(paidObligations);
  const obligationsUpcoming = sum(upcomingObligations);

  const totalIncome = sum(incomes);
  const totalSaved = sum(savings);
  const totalSpent = regularSpent + oneOffSpent + obligationsPaid;

  const balance = startingBalance + totalIncome - totalSpent - totalSaved;
  const freeBalance = balance - obligationsUpcoming;
  const daysLeft = TOTAL_DAYS - currentDay + 1; // today counts too
  const safeDaily = Math.max(freeBalance, 0) / daysLeft;
  const spentToday = sum(expenses.filter((t) => t.day === currentDay));

  // Forecast: normal daily spending continues; one-off surprises do not repeat.
  const averageDaily = regularSpent / currentDay;
  const projectedEnd = freeBalance - averageDaily * (TOTAL_DAYS - currentDay);

  let risk = 'Low';
  if (freeBalance <= 0) risk = 'Critical';
  else if (projectedEnd < 0) risk = 'High';
  else if (projectedEnd < startingBalance * 0.15) risk = 'Medium';

  // Health score out of 100, made of four parts.
  const forecastScore =
    projectedEnd >= 0 ? 50 * Math.min(1, projectedEnd / (startingBalance * 0.3)) : 0;
  const savingsScore = 20 * Math.min(1, totalSaved / (startingBalance * 0.1));
  const loadScore =
    15 * (1 - Math.min(1, (obligationsPaid + obligationsUpcoming) / (startingBalance * 0.5)));
  let disciplineScore = 15;
  if (spentToday > safeDaily) {
    disciplineScore = safeDaily > 0 ? 15 * Math.max(0, 1 - (spentToday - safeDaily) / safeDaily) : 0;
  }
  let health = Math.round(forecastScore + savingsScore + loadScore + disciplineScore);
  if (freeBalance <= 0) health = Math.min(health, 10);
  health = clamp(health, 0, 100);

  // Balance for every day: real days so far, forecast days after today.
  const trajectory = [];
  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    if (d <= currentDay) {
      const value =
        startingBalance +
        sum(incomes.filter((t) => t.day <= d)) -
        sum(expenses.filter((t) => t.day <= d)) -
        sum(savings.filter((t) => t.day <= d)) -
        sum(obligations.filter((o) => o.day <= d));
      trajectory.push({ day: d, balance: value, projected: false });
    } else {
      const value =
        balance -
        sum(upcomingObligations.filter((o) => o.day <= d)) -
        averageDaily * (d - currentDay);
      trajectory.push({ day: d, balance: value, projected: true });
    }
  }
  const runOut = trajectory.find((p) => p.projected && p.balance < 0);

  // Where the money went, biggest first.
  const totals = {};
  expenses.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });
  paidObligations.forEach((o) => {
    const name = o.kind === 'subscription' ? 'Subscriptions' : 'Commitments';
    totals[name] = (totals[name] || 0) + o.amount;
  });
  const byCategory = Object.entries(totals)
    .map(([name, total]) => ({
      name,
      icon: CATEGORY_ICONS[name] || '📦',
      total,
      percent: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const goalProgress = goals.map((g) => {
    const saved = sum(savings.filter((s) => s.goalId === g.id));
    return { ...g, saved, percent: clamp(Math.round((saved / g.target) * 100), 0, 100) };
  });

  return {
    startingBalance,
    currentDay,
    totalIncome,
    totalSpent,
    totalSaved,
    obligationsPaid,
    obligationsUpcoming,
    balance,
    freeBalance,
    daysLeft,
    safeDaily,
    spentToday,
    averageDaily,
    projectedEnd,
    risk,
    health,
    runOutDay: runOut ? runOut.day : null,
    trajectory,
    byCategory,
    goalProgress,
  };
}
