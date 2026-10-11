import { memo } from 'react';
import { TOTAL_DAYS } from '../constants.js';
import { formatMoney } from '../utils/format.js';

function healthTone(score) {
  if (score >= 75) return 'good';
  if (score >= 50) return 'ok';
  if (score >= 25) return 'warn';
  return 'bad';
}

const HEALTH_TEXT = { good: 'Great shape', ok: 'Doing okay', warn: 'Be careful', bad: 'Danger zone' };

function Summary({ m }) {
  const tone = healthTone(m.health);

  return (
    <section className="summary" aria-label="Financial summary">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Money left {formatMoney(m.balance)}. Safe to spend {formatMoney(m.safeDaily)} per day.
        Risk level {m.risk}. Health score {m.health} out of 100.
      </div>

      <div className="card big">
        <p className="label">Money left</p>
        <p className={'value' + (m.balance < 0 ? ' negative' : '')} data-testid="balance">
          {formatMoney(m.balance)}
        </p>
        <p className="hint">
          Started with {formatMoney(m.startingBalance)}
          {m.totalIncome > 0 ? `, plus ${formatMoney(m.totalIncome)} income` : ''}
          {m.totalSaved > 0 ? `, ${formatMoney(m.totalSaved)} saved in goals` : ''}
        </p>
      </div>

      <div className="card">
        <p className="label">Safe to spend per day</p>
        <p className="value" data-testid="safe-daily">{formatMoney(m.safeDaily)}</p>
        <p className="hint">
          for {m.daysLeft} day{m.daysLeft === 1 ? '' : 's'}, after {formatMoney(m.obligationsUpcoming)} of upcoming bills
        </p>
      </div>

      <div className="card">
        <p className="label">Spent today</p>
        <p className={'value' + (m.spentToday > m.safeDaily ? ' negative' : '')}>
          {formatMoney(m.spentToday)}
        </p>
        <p className="hint">
          {m.spentToday > m.safeDaily ? 'Over your daily limit' : 'Within your daily limit'}
        </p>
      </div>

      <div className="card">
        <p className="label">Forecast for day {TOTAL_DAYS}</p>
        <p className={'value' + (m.projectedEnd < 0 ? ' negative' : '')} data-testid="forecast">
          {formatMoney(m.projectedEnd)}
        </p>
        <p className="hint">if you keep spending like this</p>
      </div>

      <div className="card">
        <p className="label">Financial risk</p>
        <p>
          <span className={'badge badge-' + m.risk.toLowerCase()} data-testid="risk">{m.risk}</span>
        </p>
        <p className="hint">Average spend: {formatMoney(m.averageDaily)} per day</p>
      </div>

      <div className="card">
        <p className="label">Money health</p>
        <p className={'value health-' + tone} data-testid="health">
          {m.health}
          <span className="out-of">/100</span>
        </p>
        <div className="meter" aria-hidden="true">
          <div className={'meter-fill meter-' + tone} style={{ width: m.health + '%' }} />
        </div>
        <p className="hint">{HEALTH_TEXT[tone]}</p>
      </div>
    </section>
  );
}

export default memo(Summary);
