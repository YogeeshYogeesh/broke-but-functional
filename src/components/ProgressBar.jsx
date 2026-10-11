export default function ProgressBar({ value, max, label, text }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={text}
    >
      <div className="progress-fill" style={{ width: percent + '%' }} />
    </div>
  );
}
