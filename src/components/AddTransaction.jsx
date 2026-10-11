import { memo, useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS, LIMITS } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import { parseAmount } from '../utils/sanitize.js';
import Panel from './Panel.jsx';

function AddTransaction({ dispatch, balance }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const parsed = parseAmount(amount);
  const overspend = type === 'expense' && parsed !== null && parsed > balance;

  function handleSubmit(e) {
    e.preventDefault();
    if (parsed === null) {
      setError(`Enter an amount between ₹1 and ${formatMoney(LIMITS.maxAmount)}.`);
      return;
    }
    setError('');
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        type,
        amount: parsed,
        category: type === 'income' ? 'Income' : category,
        note,
      },
    });
    setAmount('');
    setNote('');
  }

  return (
    <Panel id="add-tx-title" title="Add a transaction">
      <div className="toggle">
        <button
          type="button"
          aria-pressed={type === 'expense'}
          className={'toggle-btn' + (type === 'expense' ? ' active-expense' : '')}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          aria-pressed={type === 'income'}
          className={'toggle-btn' + (type === 'income' ? ' active-income' : '')}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Amount (₹)</span>
          <input
            type="number"
            inputMode="decimal"
            min="1"
            max={LIMITS.maxAmount}
            placeholder="e.g. 250"
            value={amount}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'amount-error' : undefined}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        {type === 'expense' && (
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {CATEGORY_ICONS[name]} {name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="field">
          <span>Note (optional)</span>
          <input
            type="text"
            maxLength={LIMITS.maxNote}
            placeholder={type === 'income' ? 'e.g. Pocket money' : 'e.g. Chai and samosa'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        {error && (
          <p id="amount-error" className="error" role="alert">
            {error}
          </p>
        )}
        {overspend && (
          <p className="warning" role="status">
            Careful! This is more than the {formatMoney(Math.max(balance, 0))} you have left.
          </p>
        )}

        <button type="submit" className="btn btn-primary full">
          {type === 'income' ? 'Add income' : 'Add expense'}
        </button>
      </form>
    </Panel>
  );
}

export default memo(AddTransaction);
