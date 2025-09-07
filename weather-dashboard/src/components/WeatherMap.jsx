import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const TILE_BASE = import.meta.env.VITE_TILE_BASE;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// You can change 'temp_new' to other layers: clouds_new, precip_new, pressure_new, wind_new
const LAYER = 'temp_new';

export default function WeatherMap({ coords }) {
  // Fallback: New Delhi if no coords provided
  const lat = coords?.lat ?? 28.6139;
  const lon = coords?.lon ?? 77.2090;
  const center = [lat, lon];

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={10} className="map">
        {/* Basemap */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather overlay */}
        <TileLayer
          attribution="&copy; OpenWeatherMap"
          url={`${TILE_BASE}/${LAYER}/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.5}
        />

        {/* Marker that updates with coords */}
        <Marker position={center}>
          <Popup>
            📍 {coords ? "Your Selected Location" : "Default: New Delhi"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
