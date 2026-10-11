// A titled box used by every section. The heading names the region for screen readers.
export default function Panel({ id, title, children }) {
  return (
    <section className="panel" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
