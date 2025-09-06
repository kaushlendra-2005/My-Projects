import { MapContainer, TileLayer } from 'react-leaflet';

const TILE_BASE = import.meta.env.VITE_TILE_BASE || 'https://tile.openweathermap.org/map';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// You can change 'temp_new' to other layers: clouds_new, precip_new, pressure_new, wind_new
const LAYER = 'temp_new';

export default function WeatherMap({ coords }) {
  const lat = coords?.lat ?? 28.6139; // Default: New Delhi
  const lon = coords?.lon ?? 77.2090;
  const center = [lat, lon];

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={7} className="map">
        {/* Basemap (OpenStreetMap or any other tiles you like) */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Weather overlay */}
        <TileLayer
          attribution="&copy; OpenWeatherMap"
          url={`${TILE_BASE}/${LAYER}/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.6}
        />
      </MapContainer>
    </div>
  );
}
