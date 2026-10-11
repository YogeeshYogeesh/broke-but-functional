import { CATEGORIES, INCOME_CATEGORY, formatMoney } from '../store.js';

function iconFor(name) {
  if (name === INCOME_CATEGORY.name) return INCOME_CATEGORY.icon;
  const found = CATEGORIES.find((c) => c.name === name);
  return found ? found.icon : '📦';
}

export default function TransactionList({ state, dispatch }) {
  const list = state.transactions;

  return (
    <section className="panel">
      <h2>Your transactions</h2>
      {list.length === 0 ? (
        <p className="empty">Nothing here yet. Your first expense or income will show up here.</p>
      ) : (
        <ul className="tx-list">
          {list.map((t) => (
            <li key={t.id} className="tx">
              <div className="tx-icon">{iconFor(t.category)}</div>
              <div className="tx-info">
                <div className="tx-title">{t.note || t.category}</div>
                <div className="tx-meta">
                  {t.category} · Day {t.day}
                </div>
              </div>
              <div className={'tx-amount ' + (t.type === 'income' ? 'plus' : 'minus')}>
                {t.type === 'income' ? '+' : '-'}
                {formatMoney(t.amount)}
              </div>
              <button
                className="tx-delete"
                aria-label="Delete transaction"
                onClick={() => dispatch({ type: 'DELETE', id: t.id })}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
