import { memo } from 'react';
import { getInsights } from '../logic/insights.js';
import Panel from './Panel.jsx';

const ICONS = { bad: '🚨', warn: '⚠️', info: '💡', good: '✅' };

function Insights({ m }) {
  const tips = getInsights(m);
  return (
    <Panel id="insights-title" title="Smart tips">
      <ul className="tips">
        {tips.map((tip) => (
          <li key={tip.text} className={'tip tip-' + tip.level}>
            <span aria-hidden="true">{ICONS[tip.level]}</span>
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default memo(Insights);
