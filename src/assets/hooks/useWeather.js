import { useState } from 'react';
import { getCoordinates, getWeather, getFiveDayForecast } from '../services/weatherService.js';

function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);

    try {
      const coords = await getCoordinates(city);
      const [weatherData, forecastData] = await Promise.all([
        getWeather(coords.lat, coords.lon),
        getFiveDayForecast(coords.lat, coords.lon),
      ]);

      setWeather({
        ...weatherData,
        city: coords.name,
        state: coords.state,
        country: coords.country,
        location: coords.fullName,
      });
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { weather, forecast, loading, error, fetchWeather };
}

export default useWeather;