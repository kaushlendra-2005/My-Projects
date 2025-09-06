export default function Forecast({ items, loading }) {
  if (loading && items.length === 0) return <div className="skeleton">Loading forecast…</div>;
  if (!items || items.length === 0) return <p className="muted">No forecast yet.</p>;

  return (
    <div className="forecast">
      {items.map((d) => (
        <div className="forecast-card" key={d.date}>
          <div className="day">{formatDay(d.date)}</div>
          <img
            alt={d.description}
            src={`https://openweathermap.org/img/wn/${d.icon}.png`}
            className="icon"
          />
          <div className="desc capitalize">{d.description}</div>
          <div className="temps">
            <span className="max">{d.max}°</span>
            <span className="min">{d.min}°</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
