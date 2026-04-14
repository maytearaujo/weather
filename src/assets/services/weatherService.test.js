import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getCoordinates, getWeather } from './weatherService.js';

describe('weatherService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches coordinates for a valid city', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        results: [{ latitude: -23.55052, longitude: -46.633308, name: 'São Paulo' }],
      }),
    });

    const coords = await getCoordinates('São Paulo');

    expect(coords).toEqual({ lat: -23.55052, lon: -46.633308, name: 'São Paulo' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com/v1/search'),
    );
  });

  it('throws when city is not found', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ results: [] }),
    });

    await expect(getCoordinates('Cidade Inexistente')).rejects.toThrow('Cidade não encontrada');
  });

  it('fetches weather data for coordinates', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ current_weather: { temperature: 22 }, daily: {} }),
    });

    const data = await getWeather(-23.55, -46.63);

    expect(data).toEqual({ current_weather: { temperature: 22 }, daily: {} });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.open-meteo.com/v1/forecast'),
    );
  });
});
