import { fetchJson } from "../../../core/http/fetchJson";
import { API_ENDPOINTS } from "../../../config/api";

export async function fetchWeatherByCoordinates(latitude, longitude) {
  return fetchJson(API_ENDPOINTS.weatherForecast({ latitude, longitude }));
}

export async function fetchCityNameByCoordinates(latitude, longitude) {
  const data = await fetchJson(API_ENDPOINTS.weatherCityName({ latitude, longitude }));
  return data.name;
}
