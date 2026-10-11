import { formatMoney } from '../utils/format.js';

// Short, plain-language tips based on the current numbers.
export function getInsights(m) {
  const tips = [];

  if (m.freeBalance <= 0) {
    tips.push({
      level: 'bad',
      text: 'You have no free money left after upcoming bills. Pause spending and look for extra income.',
    });
  } else if (m.runOutDay) {
    tips.push({
      level: 'warn',
      text: `At your current pace you will run out around day ${m.runOutDay}. Try to stay under ${formatMoney(m.safeDaily)} a day.`,
    });
  }

  if (m.freeBalance > 0 && m.spentToday > m.safeDaily) {
    tips.push({
      level: 'warn',
      text: `You are ${formatMoney(m.spentToday - m.safeDaily)} over today's safe limit. Spend less tomorrow to balance it out.`,
    });
  }

  if (m.obligationsUpcoming > 0) {
    tips.push({
      level: 'info',
      text: `${formatMoney(m.obligationsUpcoming)} of bills are still coming. They are already taken out of your daily limit.`,
    });
  }

  if (m.totalSaved === 0 && m.freeBalance > 0) {
    tips.push({
      level: 'info',
      text: 'You have not saved anything yet. Even ₹100 toward a goal improves your health score.',
    });
  }

  if (tips.length === 0) {
    tips.push({ level: 'good', text: 'You are on track. Keep it up!' });
  }
  return tips;
}
