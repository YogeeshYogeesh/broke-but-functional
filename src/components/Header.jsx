import { memo, useCallback } from 'react';
import { TOTAL_DAYS } from '../constants.js';
import ProgressBar from './ProgressBar.jsx';

function Header({ currentDay, dispatch }) {
  const isLastDay = currentDay >= TOTAL_DAYS;

  const handleReset = useCallback(() => {
    if (window.confirm('Start over? This clears all your data.')) {
      dispatch({ type: 'RESET' });
    }
  }, [dispatch]);

  return (
    <header className="header">
      <div className="container header-inner">
        <div>
          <h1 className="title">Broke But Functional</h1>
          <p className="subtitle">Survive the month on ₹10,000</p>
        </div>
        <div className="day-box">
          <p className="day-text">
            Day <strong>{currentDay}</strong> of {TOTAL_DAYS}
          </p>
          <ProgressBar
            value={currentDay}
            max={TOTAL_DAYS}
            label="Month progress"
            text={`Day ${currentDay} of ${TOTAL_DAYS}`}
          />
          <div className="header-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch({ type: 'NEXT_DAY' })}
              disabled={isLastDay}
            >
              {isLastDay ? 'Month complete' : 'Next day →'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
