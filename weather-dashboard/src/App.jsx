import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

  const fetchWeather = async () => {
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      setError("City not found or API error.");
      setWeather(null);
      console.log(error);
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-4">🌦️ Weather Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white p-4 rounded-lg shadow-md w-80 text-center">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p className="text-2xl">
            🌡️ {Math.round(weather.main.temp)}°C
          </p>
          <p className="capitalize">
            {weather.weather[0].description}
          </p>
          <p>💨 Wind: {weather.wind.speed} m/s</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;