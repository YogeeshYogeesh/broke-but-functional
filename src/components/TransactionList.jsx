import { memo, useMemo } from 'react';
import { CATEGORY_ICONS } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import Panel from './Panel.jsx';

const MAX_SHOWN = 100;

function TransactionList({ transactions, goals, dispatch }) {
  const goalNames = useMemo(() => Object.fromEntries(goals.map((g) => [g.id, g.name])), [goals]);
  const shown = transactions.slice(0, MAX_SHOWN);

  return (
    <Panel id="tx-title" title="Your transactions">
      {shown.length === 0 ? (
        <p className="empty">Nothing here yet. Your first expense or income will show up here.</p>
      ) : (
        <ul className="list scroll">
          {shown.map((t) => {
            const title =
              t.note ||
              (t.type === 'saving' ? `Saved toward ${goalNames[t.goalId] || 'a goal'}` : t.category);
            const sign = t.type === 'income' ? '+' : '-';
            const tone = t.type === 'income' ? 'plus' : t.type === 'saving' ? 'saved' : 'minus';
            return (
              <li key={t.id} className="row-item">
                <div className="row-icon" aria-hidden="true">
                  {CATEGORY_ICONS[t.category] || '📦'}
                </div>
                <div className="row-main">
                  <div className="row-title">{title}</div>
                  <div className="row-meta">
                    {t.category} · Day {t.day}
                    {t.kind === 'oneoff' ? ' · One-time' : ''}
                  </div>
                </div>
                <div className={'row-amount ' + tone}>
                  {sign}
                  {formatMoney(t.amount)}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Delete ${title}, ${formatMoney(t.amount)}`}
                  onClick={() => dispatch({ type: 'DELETE_TRANSACTION', id: t.id })}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {transactions.length > MAX_SHOWN && (
        <p className="hint">Showing your latest {MAX_SHOWN} transactions.</p>
      )}
    </Panel>
  );
}

export default memo(TransactionList);
