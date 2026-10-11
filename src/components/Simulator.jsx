import { memo, useMemo, useState } from 'react';
import { LIMITS, TOTAL_DAYS } from '../constants.js';
import { simulate } from '../logic/simulator.js';
import { formatMoney } from '../utils/format.js';
import { parseAmount, parseDay, sanitizeText } from '../utils/sanitize.js';
import Panel from './Panel.jsx';

// Turns what the person typed into a real app action (or null if it is not valid yet).
function buildAction(state, form) {
  const amount = parseAmount(form.amount);
  if (amount === null) return null;

  if (form.type === 'purchase') {
    return {
      type: 'ADD_TRANSACTION',
      payload: {
        type: 'expense',
        amount,
        category: 'Shopping',
        note: sanitizeText(form.name, LIMITS.maxNote) || 'Planned purchase',
        kind: 'oneoff',
      },
    };
  }
  if (form.type === 'subscription') {
    const day = form.day === '' ? state.currentDay : parseDay(form.day);
    if (day === null) return null;
    return {
      type: 'ADD_OBLIGATION',
      payload: {
        kind: 'subscription',
        name: sanitizeText(form.name, LIMITS.maxName) || 'New subscription',
        amount,
        day,
      },
    };
  }
  const goal = state.goals.find((g) => g.id === form.goalId) || state.goals[0];
  return goal ? { type: 'CONTRIBUTE', goalId: goal.id, amount } : null;
}

function Delta({ value, format }) {
  if (!value) return null;
  const good = value > 0;
  return (
    <span className={'delta ' + (good ? 'good' : 'bad')}>
      {' '}({good ? '+' : '-'}
      {format(Math.abs(value))})
    </span>
  );
}

function Simulator({ state, dispatch }) {
  const [form, setForm] = useState({ type: 'purchase', amount: '', name: '', day: '', goalId: '' });
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const preview = useMemo(() => {
    const action = buildAction(state, form);
    return action ? { action, result: simulate(state, action) } : null;
  }, [state, form]);

  function handleApply() {
    dispatch(preview.action);
    setForm((f) => ({ ...f, amount: '', name: '', day: '' }));
  }

  const b = preview && preview.result.before;
  const a = preview && preview.result.after;

  return (
    <Panel id="sim-title" title="What if? Simulator">
      <p className="hint spaced">Test a decision first. Nothing changes until you press the button.</p>

      <div className="mini-form">
        <label className="field">
          <span>I am thinking of...</span>
          <select value={form.type} onChange={update('type')}>
            <option value="purchase">Buying something once</option>
            <option value="subscription">Starting a subscription</option>
            <option value="goal">Saving toward a goal</option>
          </select>
        </label>

        {form.type === 'goal' ? (
          state.goals.length === 0 ? (
            <p className="empty">Create a savings goal first to simulate saving.</p>
          ) : (
            <label className="field">
              <span>Goal</span>
              <select value={form.goalId} onChange={update('goalId')}>
                {state.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
          )
        ) : (
          <label className="field">
            <span>What is it?</span>
            <input
              type="text"
              maxLength={LIMITS.maxName}
              placeholder={form.type === 'purchase' ? 'e.g. New sneakers' : 'e.g. Spotify'}
              value={form.name}
              onChange={update('name')}
            />
          </label>
        )}

        <div className="row">
          <label className="field">
            <span>Amount (₹)</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              placeholder="e.g. 1200"
              value={form.amount}
              onChange={update('amount')}
            />
          </label>
          {form.type === 'subscription' && (
            <label className="field">
              <span>Billing day</span>
              <input
                type="number"
                min="1"
                max={TOTAL_DAYS}
                placeholder={`Today (${state.currentDay})`}
                value={form.day}
                onChange={update('day')}
              />
            </label>
          )}
        </div>
      </div>

      {preview ? (
        <div className="result">
          <table className="compare">
            <caption className="sr-only">Your month now compared with your month if you do it</caption>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">Now</th>
                <th scope="col">If you do it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Money left</th>
                <td>{formatMoney(b.balance)}</td>
                <td>
                  {formatMoney(a.balance)}
                  <Delta value={a.balance - b.balance} format={formatMoney} />
                </td>
              </tr>
              <tr>
                <th scope="row">Safe per day</th>
                <td>{formatMoney(b.safeDaily)}</td>
                <td>
                  {formatMoney(a.safeDaily)}
                  <Delta value={a.safeDaily - b.safeDaily} format={formatMoney} />
                </td>
              </tr>
              <tr>
                <th scope="row">Day {TOTAL_DAYS} forecast</th>
                <td>{formatMoney(b.projectedEnd)}</td>
                <td>
                  {formatMoney(a.projectedEnd)}
                  <Delta value={a.projectedEnd - b.projectedEnd} format={formatMoney} />
                </td>
              </tr>
              <tr>
                <th scope="row">Risk level</th>
                <td>{b.risk}</td>
                <td>{a.risk}</td>
              </tr>
              <tr>
                <th scope="row">Health score</th>
                <td>{b.health}</td>
                <td>
                  {a.health}
                  <Delta value={a.health - b.health} format={String} />
                </td>
              </tr>
            </tbody>
          </table>

          {preview.result.changed ? (
            <p className={'verdict verdict-' + preview.result.verdict.level} role="status">
              {preview.result.verdict.text}
            </p>
          ) : (
            <p className="verdict verdict-warn" role="status">
              This cannot be done right now (not enough money, or the goal is already full).
            </p>
          )}

          <button
            type="button"
            className="btn btn-primary full"
            onClick={handleApply}
            disabled={!preview.result.changed}
          >
            Do it for real
          </button>
        </div>
      ) : (
        <p className="empty">Enter an amount to see how it changes your month.</p>
      )}
    </Panel>
  );
}

export default memo(Simulator);
