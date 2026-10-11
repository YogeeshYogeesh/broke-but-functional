import { memo } from 'react';
import { TOTAL_DAYS } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import Panel from './Panel.jsx';

const W = 640;
const H = 240;
const PAD = { left: 70, right: 14, top: 14, bottom: 30 };

function ForecastChart({ m }) {
  const { trajectory, currentDay } = m;
  const values = trajectory.map((p) => p.balance);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;

  const x = (day) => PAD.left + ((day - 1) / (TOTAL_DAYS - 1)) * (W - PAD.left - PAD.right);
  const y = (v) => PAD.top + (1 - (v - min) / span) * (H - PAD.top - PAD.bottom);
  const toPoints = (list) =>
    list.map((p) => `${x(p.day).toFixed(1)},${y(p.balance).toFixed(1)}`).join(' ');

  const actual = trajectory.filter((p) => p.day <= currentDay);
  const projected = trajectory.filter((p) => p.day >= currentDay);
  const endValue = trajectory[trajectory.length - 1].balance;
  const description = `Balance forecast. Today, day ${currentDay}, you have ${formatMoney(m.balance)}. On day ${TOTAL_DAYS} you are expected to have ${formatMoney(endValue)}.`;

  return (
    <Panel id="forecast-title" title="Month forecast">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={description}>
        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="chart-zero" />
        {max > 0 && (
          <text x={PAD.left - 8} y={y(max) + 4} textAnchor="end" className="chart-text">
            {formatMoney(max)}
          </text>
        )}
        <text x={PAD.left - 8} y={y(0) + 4} textAnchor="end" className="chart-text">
          ₹0
        </text>
        {min < 0 && (
          <text x={PAD.left - 8} y={y(min) + 4} textAnchor="end" className="chart-text">
            {formatMoney(min)}
          </text>
        )}
        <polyline points={toPoints(projected)} className="chart-projected" fill="none" />
        <polyline points={toPoints(actual)} className="chart-actual" fill="none" />
        <circle cx={x(currentDay)} cy={y(m.balance)} r="5" className="chart-dot" />
        <text x={x(1)} y={H - 8} className="chart-text">Day 1</text>
        <text x={x(15)} y={H - 8} textAnchor="middle" className="chart-text">Day 15</text>
        <text x={x(TOTAL_DAYS)} y={H - 8} textAnchor="end" className="chart-text">Day {TOTAL_DAYS}</text>
      </svg>
      <p className="hint">
        Solid line: what happened so far. Dashed line: where you are heading at your current pace.
        Expected on day {TOTAL_DAYS}: <strong>{formatMoney(endValue)}</strong>.
      </p>
    </Panel>
  );
}

export default memo(ForecastChart);
