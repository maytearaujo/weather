import { render, screen } from '@testing-library/react';
import WeatherCard from './index.jsx';

describe('WeatherCard', () => {
  it('renders nothing when no weather prop is provided', () => {
    const { container } = render(<WeatherCard weather={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders weather details when weather prop is provided', () => {
    const weather = {
      city: 'São Paulo',
      current_weather: {
        temperature: 25,
        windspeed: 12,
        weathercode: 1,
      },
      daily: {
        temperature_2m_max: [30],
        temperature_2m_min: [18],
      },
    };

    render(<WeatherCard weather={weather} />);

    expect(screen.getByText(/são paulo/i)).toBeInTheDocument();
    expect(screen.getByText(/temperatura atual: 25°C/i)).toBeInTheDocument();
    expect(screen.getByText(/condição: principalmente limpo/i)).toBeInTheDocument();
    expect(screen.getByText(/velocidade do vento: 12 km\/h/i)).toBeInTheDocument();
    expect(screen.getByText(/máxima hoje: 30°C/i)).toBeInTheDocument();
    expect(screen.getByText(/mínima hoje: 18°C/i)).toBeInTheDocument();
  });
});
