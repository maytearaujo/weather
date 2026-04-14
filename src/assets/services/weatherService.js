import { fetchWithCache } from './cache.js';

async function getCoordinates(city) {
  const params = new URLSearchParams({
    name: city,
    count: '5',
    language: 'en',
    format: 'json',
    country: 'BR',
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
  const data = await response.json();

  const brazilianResult = data.results && data.results.find(
    (result) => result.country_code === 'BR' || result.country === 'Brazil'
  );

  if (brazilianResult) {
    const locationParts = [brazilianResult.name, brazilianResult.admin1, brazilianResult.country].filter(Boolean);

    return {
      lat: brazilianResult.latitude,
      lon: brazilianResult.longitude,
      name: brazilianResult.name,
      state: brazilianResult.admin1 || null,
      country: brazilianResult.country || null,
      fullName: locationParts.join(', '),
    };
  }

  throw new Error('Cidade brasileira não encontrada');
}

function getWeatherDescription(code) {
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
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    80: 'Chuva leve',
    81: 'Chuva moderada',
    82: 'Chuva forte',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte',
  };
  return descriptions[code] || 'Desconhecido';
}

async function getWeather(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Coordenadas inválidas para busca de clima');
  }

  const cacheKey = `weather_current_${lat}_${lon}`;

  return fetchWithCache(cacheKey, async () => {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current_weather: 'true',
      daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      timezone: 'auto',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Falha ao buscar clima: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.current_weather || !data.daily) {
      throw new Error('Dados meteorológicos inválidos ou incompletos');
    }

    return data;
  }, 15);
}

async function getFiveDayForecast(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Coordenadas inválidas para previsão de 5 dias');
  }

  const cacheKey = `weather_forecast_${lat}_${lon}`;

  return fetchWithCache(cacheKey, async () => {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      forecast_days: '5',
      timezone: 'auto',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Falha ao buscar previsão de 5 dias: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.daily || !Array.isArray(data.daily.time)) {
      throw new Error('Dados de previsão inválidos ou incompletos');
    }

    const { time, temperature_2m_min, temperature_2m_max, weathercode } = data.daily;

    if (!temperature_2m_min || !temperature_2m_max || !weathercode) {
      throw new Error('Dados de previsão incompletos');
    }

    return time.map((date, index) => ({
      date,
      min: temperature_2m_min[index],
      max: temperature_2m_max[index],
      weatherCode: weathercode[index],
      description: getWeatherDescription(weathercode[index]),
    }));
  }, 60);
}

export { getCoordinates, getWeather, getFiveDayForecast };
