import { memo, useState } from 'react';
import { SURPRISES } from '../constants.js';
import { formatMoney } from '../utils/format.js';
import Panel from './Panel.jsx';

function SurpriseExpenses({ dispatch }) {
  const [message, setMessage] = useState('');

  function handleClick(item) {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        type: 'expense',
        amount: item.amount,
        category: 'Unexpected',
        note: item.label,
        kind: 'oneoff',
      },
    });
    setMessage(`${item.label} added: ${formatMoney(item.amount)}.`);
  }

  return (
    <Panel id="surprise-title" title="Life happens">
      <p className="hint spaced">Tap to see how a surprise expense hits your month.</p>
      <div className="chips">
        {SURPRISES.map((item) => (
          <button key={item.label} type="button" className="chip" onClick={() => handleClick(item)}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            <strong>{formatMoney(item.amount)}</strong>
          </button>
        ))}
      </div>
      <p className="hint" role="status">{message}</p>
    </Panel>
  );
}

export default memo(SurpriseExpenses);
