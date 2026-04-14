import React from 'react';
import './styles.css';

function ForecastList({ forecast }) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="forecast-list">
      <h2>Previsão para 5 dias</h2>
      <ul>
        {forecast.map((day) => (
          <li key={day.date} className="forecast-item">
            <strong>{day.date}</strong>
            <span>{day.description}</span>
            <span>Máx: {day.max}°C</span>
            <span>Mín: {day.min}°C</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForecastList;
