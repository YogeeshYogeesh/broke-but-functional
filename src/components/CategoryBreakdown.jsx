import { formatMoney } from '../store.js';

export default function CategoryBreakdown({ m }) {
  return (
    <section className="panel">
      <h2>Where your money goes</h2>
      {m.byCategory.length === 0 ? (
        <p className="empty">No spending yet. Add an expense to see the breakdown.</p>
      ) : (
        <ul className="bars">
          {m.byCategory.map((c) => {
            const percent = Math.round((c.total / m.totalSpent) * 100);
            return (
              <li key={c.name}>
                <div className="bar-top">
                  <span>
                    {c.icon} {c.name}
                  </span>
                  <span>
                    {formatMoney(c.total)} · {percent}%
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: percent + '%' }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
