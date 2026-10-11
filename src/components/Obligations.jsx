import { memo, useMemo, useState } from 'react';
import { LIMITS, TOTAL_DAYS } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import { parseAmount, parseDay, sanitizeText } from '../utils/sanitize.js';
import Panel from './Panel.jsx';

function Obligations({ obligations, currentDay, dispatch }) {
  const [kind, setKind] = useState('subscription');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  const sorted = useMemo(() => [...obligations].sort((a, b) => a.day - b.day), [obligations]);

  function handleSubmit(e) {
    e.preventDefault();
    const cleanName = sanitizeText(name, LIMITS.maxName);
    const parsedAmount = parseAmount(amount);
    const parsedDay = day === '' ? currentDay : parseDay(day);

    if (!cleanName) return setError('Give it a name.');
    if (parsedAmount === null) return setError('Enter a valid amount.');
    if (parsedDay === null) return setError(`Day must be a whole number from 1 to ${TOTAL_DAYS}.`);

    setError('');
    dispatch({
      type: 'ADD_OBLIGATION',
      payload: { kind, name: cleanName, amount: parsedAmount, day: parsedDay },
    });
    setName('');
    setAmount('');
    setDay('');
  }

  return (
    <Panel id="obl-title" title="Subscriptions & commitments">
      <p className="hint spaced">
        Bills that are still coming are taken out of your daily limit automatically.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mini-form">
        <label className="field">
          <span>Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="subscription">Subscription (OTT, music, app)</option>
            <option value="commitment">Commitment (rent share, EMI, fees)</option>
          </select>
        </label>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            maxLength={LIMITS.maxName}
            placeholder="e.g. Netflix"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div className="row">
          <label className="field">
            <span>Amount (₹)</span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              placeholder="e.g. 199"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Billing or due day</span>
            <input
              type="number"
              min="1"
              max={TOTAL_DAYS}
              placeholder={`Today (${currentDay})`}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </label>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary full">
          Add to my bills
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="empty">No bills added yet.</p>
      ) : (
        <ul className="list">
          {sorted.map((o) => {
            const paid = o.day <= currentDay;
            return (
              <li key={o.id} className="row-item">
                <div className="row-main">
                  <div className="row-title">{o.name}</div>
                  <div className="row-meta">
                    {o.kind === 'subscription' ? 'Subscription' : 'Commitment'} ·{' '}
                    {paid ? `Paid on day ${o.day}` : `Due on day ${o.day}`}
                  </div>
                </div>
                <div className={'row-amount ' + (paid ? 'minus' : 'pending')}>
                  {formatMoney(o.amount)}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Delete ${o.name}`}
                  onClick={() => dispatch({ type: 'DELETE_OBLIGATION', id: o.id })}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

export default memo(Obligations);
