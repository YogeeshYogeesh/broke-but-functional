import { memo } from 'react';
import { formatMoney } from '../utils/format.js';
import Panel from './Panel.jsx';
import ProgressBar from './ProgressBar.jsx';

function CategoryBreakdown({ m }) {
  return (
    <Panel id="breakdown-title" title="Where your money goes">
      {m.byCategory.length === 0 ? (
        <p className="empty">No spending yet. Add an expense to see the breakdown.</p>
      ) : (
        <ul className="list">
          {m.byCategory.map((c) => (
            <li key={c.name}>
              <div className="bar-top">
                <span>
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </span>
                <span>
                  {formatMoney(c.total)} · {c.percent}%
                </span>
              </div>
              <ProgressBar
                value={c.percent}
                max={100}
                label={`${c.name} share of spending`}
                text={`${c.percent} percent`}
              />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default memo(CategoryBreakdown);
