const APP_ID = process.env.REACT_APP_OPENWEATHER_API_KEY || "";
const TRANSPORT_CLIENT_ID = process.env.REACT_APP_TRANSPORT_CLIENT_ID || "";
const TRANSPORT_CLIENT_SECRET = process.env.REACT_APP_TRANSPORT_CLIENT_SECRET || "";
const DEFAULT_ROUTE_ID = "1468";
const WEATHER_TIMEZONE = "America%2FSao_Paulo";
const FORECAST_HOURS = Number.parseInt(process.env.REACT_APP_OPENWEATHER_FORECAST_HOURS || "12", 10);

export const API_KEYS = {
  APP_ID,
  TRANSPORT_CLIENT_ID,
  TRANSPORT_CLIENT_SECRET,
};

export const API_ENDPOINTS = {
  weatherForecast: ({ latitude, longitude }) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,visibility,temperature_80m,temperature_120m,temperature_180m,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max&current_weather=true&timezone=${WEATHER_TIMEZONE}`,
  weatherCityName: ({ latitude, longitude }) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APP_ID}`,
  transportVehiclePositions: ({ routeId }) => {
    const resolvedRouteId = routeId || DEFAULT_ROUTE_ID;
    return `https://datosabiertos-transporte-apis.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?route_id=${resolvedRouteId}&client_id=${TRANSPORT_CLIENT_ID}&client_secret=${TRANSPORT_CLIENT_SECRET}`;
  },
  transportAllVehiclePositions:
    `https://datosabiertos-transporte-apis.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?&client_id=${TRANSPORT_CLIENT_ID}&client_secret=${TRANSPORT_CLIENT_SECRET}`,
  geocodingSearch: ({ name }) =>
    `https://geocoding-api.open-meteo.com/v1/search?count=40&language=es&format=json&name=${name}`,
};

export const RADAR_CONFIG = {
  rainViewerApiBase: process.env.REACT_APP_RAINVIEWER_API_BASE || "https://api.rainviewer.com/public/weather-maps.json",
  openWeatherMapsBase: process.env.REACT_APP_OPENWEATHER_MAPS_BASE || "https://maps.openweathermap.org/maps/2.0/weather",
  openWeatherPrecipLayer: process.env.REACT_APP_OPENWEATHER_PRECIP_LAYER || "PA0",
  openWeatherTileApiKey: process.env.REACT_APP_OPENWEATHER_TILE_API_KEY || APP_ID,
  forecastHours: Number.isFinite(FORECAST_HOURS) && FORECAST_HOURS > 0 ? FORECAST_HOURS : 12,
};
