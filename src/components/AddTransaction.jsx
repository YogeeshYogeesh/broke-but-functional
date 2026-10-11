import { useState } from 'react';
import { CATEGORIES, INCOME_CATEGORY, formatMoney } from '../store.js';

export default function AddTransaction({ dispatch, balance }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const value = Number(amount);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value || value <= 0) {
      setError('Enter an amount bigger than 0.');
      return;
    }
    setError('');
    dispatch({
      type: 'ADD',
      payload: {
        type,
        amount: value,
        category: type === 'income' ? INCOME_CATEGORY.name : category,
        note: note.trim(),
      },
    });
    setAmount('');
    setNote('');
  }

  const overspend = type === 'expense' && value > 0 && value > balance;

  return (
    <section className="panel">
      <h2>Add a transaction</h2>

      <div className="toggle">
        <button
          type="button"
          className={'toggle-btn ' + (type === 'expense' ? 'active-expense' : '')}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={'toggle-btn ' + (type === 'income' ? 'active-income' : '')}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Amount (₹)</span>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="e.g. 250"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        {type === 'expense' && (
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="field">
          <span>Note (optional)</span>
          <input
            type="text"
            placeholder={type === 'income' ? 'e.g. Pocket money' : 'e.g. Chai and samosa'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {overspend && (
          <p className="warning">
            Careful! This is more than the {formatMoney(Math.max(balance, 0))} you have left.
          </p>
        )}

        <button type="submit" className="btn btn-primary full">
          {type === 'income' ? 'Add income' : 'Add expense'}
        </button>
      </form>
    </section>
  );
}
