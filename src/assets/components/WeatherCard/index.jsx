import React from 'react';
import './styles.css';

function WeatherCard({ weather }) {
  if (!weather) return null;

  const { current_weather, daily, city, state, country, location } = weather;
  const temp = current_weather.temperature;
  const windSpeed = current_weather.windspeed;
  const weatherCode = current_weather.weathercode;

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Céu limpo',
      1: 'Principalmente limpo',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Névoa',
      48: 'Névoa com geada',
      51: 'Garoa leve',
      53: 'Garoa moderada',
      55: 'Garoa intensa',
      56: 'Garoa congelante leve',
      57: 'Garoa congelante intensa',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      66: 'Chuva congelante leve',
      67: 'Chuva congelante forte',
      71: 'Neve leve',
      73: 'Neve moderada',
      75: 'Neve forte',
      77: 'Grãos de neve',
      80: 'Chuva leve',
      81: 'Chuva moderada',
      82: 'Chuva forte',
      85: 'Neve leve',
      86: 'Neve forte',
      95: 'Tempestade',
      96: 'Tempestade com granizo leve',
      99: 'Tempestade com granizo forte',
    };
    return descriptions[code] || 'Desconhecido';
  };

  return (
    <div className="weather-card">
      <h2>{location || city}</h2>
      {state && country && <p>{state} • {country}</p>}
      {state && !country && <p>{state}</p>}
      {country && !state && <p>{country}</p>}
      <p>Temperatura atual: {temp}°C</p>
      <p>Condição: {getWeatherDescription(weatherCode)}</p>
      <p>Velocidade do vento: {windSpeed} km/h</p>
      <p>Máxima hoje: {daily.temperature_2m_max[0]}°C</p>
      <p>Mínima hoje: {daily.temperature_2m_min[0]}°C</p>
    </div>
  );
}

export default WeatherCard;