import { TOTAL_DAYS } from '../store.js';

export default function Header({ state, dispatch }) {
  const { currentDay } = state;
  const percent = (currentDay / TOTAL_DAYS) * 100;
  const isLastDay = currentDay >= TOTAL_DAYS;

  function handleReset() {
    if (window.confirm('Start over? This clears all your data.')) {
      dispatch({ type: 'RESET' });
    }
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <div>
          <h1 className="title">Broke But Functional</h1>
          <p className="subtitle">Survive the month on ₹10,000</p>
        </div>
        <div className="day-box">
          <div className="day-text">
            Day <strong>{currentDay}</strong> of {TOTAL_DAYS}
          </div>
          <div className="progress">
            <div className="progress-fill" style={{ width: percent + '%' }} />
          </div>
          <div className="header-buttons">
            <button
              className="btn btn-primary"
              onClick={() => dispatch({ type: 'NEXT_DAY' })}
              disabled={isLastDay}
            >
              {isLastDay ? 'Month complete' : 'Next day →'}
            </button>
            <button className="btn btn-ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
