import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';
import useWeather from '../hooks/useWeather';

function Home() {
  const { weather, forecast, loading, error, fetchWeather } = useWeather();

  return (
    <div className="home">
      <h1>Aplicativo de Clima</h1>
      <SearchBar onSearch={fetchWeather} />
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <WeatherCard weather={weather} />
      <ForecastList forecast={forecast} />
    </div>
  );
}

export default Home;