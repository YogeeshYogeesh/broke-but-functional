import { formatMoney, TOTAL_DAYS } from '../store.js';

function healthLabel(score) {
  if (score >= 75) return 'Great shape';
  if (score >= 50) return 'Doing okay';
  if (score >= 25) return 'Be careful';
  return 'Danger zone';
}

export default function Summary({ state, m }) {
  const riskClass = 'badge badge-' + m.risk.toLowerCase();
  const healthClass =
    m.health >= 75 ? 'good' : m.health >= 50 ? 'ok' : m.health >= 25 ? 'warn' : 'bad';

  return (
    <section className="summary">
      <div className="card big">
        <div className="label">Money left</div>
        <div className={'value ' + (m.balance < 0 ? 'negative' : '')}>
          {formatMoney(m.balance)}
        </div>
        <div className="hint">
          Started with {formatMoney(state.startingBalance)}
          {m.totalIncome > 0 ? ' + ' + formatMoney(m.totalIncome) + ' extra income' : ''}
        </div>
      </div>

      <div className="card">
        <div className="label">Safe to spend per day</div>
        <div className="value">{formatMoney(m.safeDaily)}</div>
        <div className="hint">for the next {m.daysLeft} day{m.daysLeft === 1 ? '' : 's'}</div>
      </div>

      <div className="card">
        <div className="label">Spent today</div>
        <div className={'value ' + (m.spentToday > m.safeDaily ? 'negative' : '')}>
          {formatMoney(m.spentToday)}
        </div>
        <div className="hint">
          {m.spentToday > m.safeDaily ? 'Over your daily limit' : 'Within your daily limit'}
        </div>
      </div>

      <div className="card">
        <div className="label">Forecast for day {TOTAL_DAYS}</div>
        <div className={'value ' + (m.projectedEnd < 0 ? 'negative' : '')}>
          {formatMoney(m.projectedEnd)}
        </div>
        <div className="hint">if you keep spending like this</div>
      </div>

      <div className="card">
        <div className="label">Financial risk</div>
        <div>
          <span className={riskClass}>{m.risk}</span>
        </div>
        <div className="hint">Average spend: {formatMoney(m.averageDaily)} per day</div>
      </div>

      <div className="card">
        <div className="label">Money health</div>
        <div className={'value health-' + healthClass}>
          {m.health}
          <span className="out-of">/100</span>
        </div>
        <div className="meter">
          <div className={'meter-fill meter-' + healthClass} style={{ width: m.health + '%' }} />
        </div>
        <div className="hint">{healthLabel(m.health)}</div>
      </div>
    </section>
  );
}
