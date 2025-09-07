import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherMap from './components/WeatherMap';
import Favorites from './components/Favorites';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = import.meta.env.VITE_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5';

export default function App() {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState(null);      //this is for { lat, lon }
  const [current, setCurrent] = useState(null);    //this is for current weather data
  const [forecast, setForecast] = useState([]);    //this is for 5-day summary
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Trying to get user location on first load by built-in browser object
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setCoords({ lat: coords.latitude, lon: coords.longitude }),
      () => {} // silent fail (when user denied permission for location), they can search by city
    );
  }, []);

  //We'll fetch by coordinates (on geolocation) or when city changes from favorites/search
  useEffect(() => {
    if (coords) {
      fetchByCoords(coords.lat, coords.lon);
    }
  }, [coords]);

  async function fetchByCoords(lat, lon) {
    setLoading(true); setErr('');
    try {
      const [cur, fc] = await Promise.all([
        axios.get(`${BASE}/weather`, { params: { lat, lon, units: 'metric', appid: API_KEY } }),
        axios.get(`${BASE}/forecast`, { params: { lat, lon, units: 'metric', appid: API_KEY } })
      ]);
      setCurrent(cur.data);
      setForecast(summarizeForecast(fc.data));
      setCity(cur.data.name || '');
    } catch (e) {
      setErr('Failed to load weather for your location.');
      console.log(e);
      
    } finally {
      setLoading(false);
    }
  }

  async function fetchByCity(name) {
    if (!name.trim()) return;
    setLoading(true); setErr('');
    try {
      //first get current then extract coords then get forecast
      const cur = await axios.get(`${BASE}/weather`, {
        params: { q: name.trim(), units: 'metric', appid: API_KEY }
      });
      const { coord } = cur.data;
      const fc = await axios.get(`${BASE}/forecast`, {
        params: { lat: coord.lat, lon: coord.lon, units: 'metric', appid: API_KEY }
      });
      setCurrent(cur.data);
      setForecast(summarizeForecast(fc.data));
      setCoords({ lat: coord.lat, lon: coord.lon });
      setCity(cur.data.name || name.trim());
    } catch (e) {
      setErr('City not found or API error.');
      console.log(e);
      
      setCurrent(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <title>Weather Dashboard</title>
    <div className="page">
      <Header title="Weather Dashboard" />

      <div className="top-bar">
        <SearchBar
          value={city}
          onChange={setCity}
          onSearch={() => fetchByCity(city)}
          loading={loading}
        />
        <Favorites
          onPick={(c) => fetchByCity(c)}
          onSave={() => city && fetchByCity(city)} // ensure normalized saved city
          currentCity={city}
        />
      </div>

      {err && <div className="error">{err}</div>}

      <div className="grid">
        <section className="panel">
          <h2 className="panel-title">Current Weather</h2>
          <CurrentWeather data={current} loading={loading} />
        </section>

        <section className="panel">
          <h2 className="panel-title">5-Day Forecast</h2>
          <Forecast items={forecast} loading={loading} />
        </section>

        <section className="panel panel-full">
          <h2 className="panel-title">Weather Map</h2>
          <WeatherMap coords={coords} />
        </section>
      </div>
    </div>
    </>
  );
}

//converting 3-hourly forecast list into one item per day (choose around 12:00 if available)
function summarizeForecast(fc) {
  if (!fc || !fc.list) return [];
  const byDay = {};
  for (const item of fc.list) {
    const d = new Date(item.dt * 1000);
    const key = d.toISOString().slice(0, 10); //formatting for YYYY-MM-DD
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(item);
  }
  const days = Object.keys(byDay).slice(0, 5);
  return days.map((day) => {
    const arr = byDay[day];
    // prefer near 12:00; else middle item
    const noon = arr.find(x => x.dt_txt.includes('12:00')) || arr[Math.floor(arr.length / 2)];
    const temps = arr.map(x => x.main.temp);
    const min = Math.round(Math.min(...temps));
    const max = Math.round(Math.max(...temps));
    return {
      date: day,
      description: noon.weather?.[0]?.description || '',
      icon: noon.weather?.[0]?.icon || '01d',
      min, max
    };
  });
}
