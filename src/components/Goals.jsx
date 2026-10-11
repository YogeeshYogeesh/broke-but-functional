import { memo, useState } from 'react';
import { LIMITS } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import { parseAmount, sanitizeText } from '../utils/sanitize.js';
import Panel from './Panel.jsx';
import ProgressBar from './ProgressBar.jsx';

function GoalItem({ goal, dispatch }) {
  const [amount, setAmount] = useState('');
  const done = goal.saved >= goal.target;

  function handleSave(e) {
    e.preventDefault();
    const value = parseAmount(amount);
    if (value === null) return;
    dispatch({ type: 'CONTRIBUTE', goalId: goal.id, amount: value });
    setAmount('');
  }

  return (
    <li className="goal">
      <div className="bar-top">
        <strong>{goal.name}</strong>
        <span>
          {formatMoney(goal.saved)} / {formatMoney(goal.target)}
        </span>
      </div>
      <ProgressBar
        value={goal.percent}
        max={100}
        label={`${goal.name} progress`}
        text={`${goal.percent} percent saved`}
      />
      <div className="goal-actions">
        {done ? (
          <p className="hint">Goal reached! 🎉</p>
        ) : (
          <form onSubmit={handleSave} className="inline-form" noValidate>
            <label className="sr-only" htmlFor={`save-${goal.id}`}>
              Amount to save toward {goal.name}
            </label>
            <input
              id={`save-${goal.id}`}
              type="number"
              inputMode="decimal"
              min="1"
              placeholder="Save ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button type="submit" className="btn btn-primary small">
              Save
            </button>
          </form>
        )}
        <button
          type="button"
          className="btn btn-ghost small"
          aria-label={`Delete goal ${goal.name}`}
          onClick={() => dispatch({ type: 'DELETE_GOAL', id: goal.id })}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function Goals({ goals, balance, dispatch }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const cleanName = sanitizeText(name, LIMITS.maxName);
    const parsedTarget = parseAmount(target);
    if (!cleanName) return setError('Give your goal a name.');
    if (parsedTarget === null) return setError('Enter a valid target amount.');
    setError('');
    dispatch({ type: 'ADD_GOAL', payload: { name: cleanName, target: parsedTarget } });
    setName('');
    setTarget('');
  }

  return (
    <Panel id="goals-title" title="Savings goals">
      <p className="hint spaced">
        Money you save leaves your spendable balance. You can save up to {formatMoney(Math.max(balance, 0))} right now.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mini-form">
        <div className="row">
          <label className="field">
            <span>Goal name</span>
            <input
              type="text"
              maxLength={LIMITS.maxName}
              placeholder="e.g. Concert ticket"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Target (₹)</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              placeholder="e.g. 2000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </label>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary full">
          Create goal
        </button>
      </form>

      {goals.length === 0 ? (
        <p className="empty">No goals yet. Create one to start saving.</p>
      ) : (
        <ul className="list">
          {goals.map((g) => (
            <GoalItem key={g.id} goal={g} dispatch={dispatch} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default memo(Goals);
