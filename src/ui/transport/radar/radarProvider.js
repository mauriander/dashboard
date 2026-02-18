import { API_KEYS, RADAR_CONFIG } from "../../../config/api";

const MAX_FRAMES = 36;
const FORECAST_STEP_HOURS = 3;

// Proveedores evaluados para Leaflet radar overlay:
// 1) RainViewer (elegido): API pública simple, sin SDK pesado.
// 2) OpenWeather Maps (capas precipitación, requiere API key).
// 3) Tomorrow.io / Climacell tiles (requiere cuenta y key).

function formatHour(timestampSeconds) {
  const date = new Date(timestampSeconds * 1000);
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function toRadarFrame(host, frame) {
  return {
    timestamp: frame.time,
    label: formatHour(frame.time),
    urlTemplate: `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,
    minZoom: 0,
    maxZoom: 18,
    maxNativeZoom: 7,
  };
}

function downsampleFrames(frames, maxFrames) {
  if (frames.length <= maxFrames) {
    return frames;
  }

  const step = Math.ceil(frames.length / maxFrames);
  const sampled = [];

  for (let index = 0; index < frames.length; index += step) {
    sampled.push(frames[index]);
  }

  if (sampled[sampled.length - 1]?.timestamp !== frames[frames.length - 1]?.timestamp) {
    sampled[sampled.length - 1] = frames[frames.length - 1];
  }

  return sampled;
}

export async function fetchRadarFramesLast12h({ signal } = {}) {
  const response = await fetch(RADAR_CONFIG.rainViewerApiBase, { signal });

  if (!response.ok) {
    throw new Error("Radar provider unavailable");
  }

  const payload = await response.json();
  const host = payload.host || "https://tilecache.rainviewer.com";
  const pastFrames = payload?.radar?.past || [];

  if (!pastFrames.length) {
    throw new Error("No radar frames found");
  }

  const latestTimestamp = pastFrames[pastFrames.length - 1].time;
  const fromTimestamp = latestTimestamp - 2 * 60 * 60;

  const filtered = pastFrames.filter((frame) => frame.time >= fromTimestamp);
  const mappedFrames = downsampleFrames(filtered.map((frame) => toRadarFrame(host, frame)), MAX_FRAMES);

  return {
    provider: "RainViewer",
    horizonLabel: "Últimas 2h",
    frames: mappedFrames,
    latestTimestamp,
  };
}

function roundToPreviousStep(timestampSeconds, stepSeconds) {
  return Math.floor(timestampSeconds / stepSeconds) * stepSeconds;
}

function toOpenWeatherFrame(timestampSeconds, apiKey) {
  const layer = RADAR_CONFIG.openWeatherPrecipLayer;
  return {
    timestamp: timestampSeconds,
    label: formatHour(timestampSeconds),
    urlTemplate: `${RADAR_CONFIG.openWeatherMapsBase}/${layer}/{z}/{x}/{y}?date=${timestampSeconds}&appid=${apiKey}`,
    minZoom: 0,
    maxZoom: 18,
    maxNativeZoom: 18,
  };
}

export async function fetchPrecipitationForecastFrames({ hours = 12 } = {}) {
  const apiKey = RADAR_CONFIG.openWeatherTileApiKey || API_KEYS.APP_ID;

  if (!apiKey) {
    throw new Error("Missing OpenWeather API key");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const stepSeconds = FORECAST_STEP_HOURS * 60 * 60;
  const baseTimestamp = roundToPreviousStep(nowSeconds, stepSeconds);
  const frameCount = Math.max(Math.ceil(hours / FORECAST_STEP_HOURS), 1);
  const frames = [];

  for (let index = 1; index <= frameCount; index += 1) {
    const frameTimestamp = baseTimestamp + index * stepSeconds;
    frames.push(toOpenWeatherFrame(frameTimestamp, apiKey));
  }

  return {
    provider: "OpenWeather Maps",
    horizonLabel: `Próximas ${hours}h`,
    frames,
    latestTimestamp: frames[frames.length - 1]?.timestamp || baseTimestamp,
  };
}
