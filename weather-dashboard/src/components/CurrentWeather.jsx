


export default function CurrentWeather({ data, loading }) {
  if (loading && !data) return <div className="skeleton">Loading current weather…</div>;
  if (!data) return <p className="muted">No data yet. Search a city or allow location.</p>;

  const icon = data.weather?.[0]?.icon;
  const desc = data.weather?.[0]?.description ?? '';
  const temp = Math.round(data.main?.temp ?? 0);
  const feels = Math.round(data.main?.feels_like ?? 0);
  const humidity = data.main?.humidity;
  const wind = data.wind?.speed;

  return (
    <div className="current">
      <div className="current-main">
        <div className="city">{data.name}</div>
        <div className="temp">{temp}°C</div>
        <div className="desc">
          {icon && <img alt={desc} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />}
          <span className="capitalize">{desc}</span>
        </div>
      </div>
      <div className="current-extra">
        <div><span className="label">Feels like:</span> {feels}°C</div>
        <div><span className="label">Humidity:</span> {humidity}%</div>
        <div><span className="label">Wind:</span> {wind} m/s</div>
      </div>
    </div>
  );
}
