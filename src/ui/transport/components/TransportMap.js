import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaBus, FaInfo, FaRoad, FaDirections, FaTachometerAlt, FaMapMarker, FaMapMarked } from "react-icons/fa";
import L from "leaflet";
import { usePolling } from "../../../core/hooks/usePolling";
import { averageCoordinates } from "../../../core/utils/geo";
import { APP_CONFIG } from "../../../config/app";
import { RADAR_CONFIG } from "../../../config/api";
import { fetchTransportByRoute } from "../services/transportService";
import { fetchRadarFramesLast12h, fetchPrecipitationForecastFrames } from "../radar/radarProvider";
import RecenterMap from "./RecenterMap";
import MapLayerToggle from "./MapLayerToggle";
import RadarLayer from "./RadarLayer";
import RadarControls from "./RadarControls";
import busIcono from "../../../img/bus-svgrepo-com.svg";
import "./transport.css";

const RADAR_TIMEOUT_MS = 18000;
const prefetchedTiles = new Set();
const FORECAST_HOURS = RADAR_CONFIG.forecastHours;

function longitudeToTile(longitude, zoom) {
  return Math.floor(((longitude + 180) / 360) * 2 ** zoom);
}

function latitudeToTile(latitude, zoom) {
  const latitudeRad = (latitude * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(latitudeRad) + 1 / Math.cos(latitudeRad)) / Math.PI) / 2) * 2 ** zoom);
}

function buildPrefetchTileUrl(urlTemplate, latitude, longitude, zoom) {
  if (!urlTemplate) {
    return "";
  }

  const x = longitudeToTile(longitude, zoom);
  const y = latitudeToTile(latitude, zoom);
  return urlTemplate.replace("{z}", String(zoom)).replace("{x}", String(x)).replace("{y}", String(y));
}

function prefetchTile(url) {
  if (!url || prefetchedTiles.has(url)) {
    return;
  }

  const image = new Image();
  image.src = url;
  prefetchedTiles.add(url);
}

function TransportMap({ ruta }) {
  const [transportData, setTransportData] = useState([]);
  const [latcenter, setLatCenter] = useState(APP_CONFIG.fallbackMapCenter[0]);
  const [longcenter, setLongCenter] = useState(APP_CONFIG.fallbackMapCenter[1]);
  const [mapMode, setMapMode] = useState("map");
  const [layerFrames, setLayerFrames] = useState([]);
  const [horizonLabel, setHorizonLabel] = useState("Últimas 12h");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isLayerLoading, setIsLayerLoading] = useState(false);
  const [layerError, setLayerError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [reloadLayerToken, setReloadLayerToken] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < 768);
  const radarOpacity = 0.72;

  const fetchTransportData = useCallback(() => {
    fetchTransportByRoute(ruta)
      .then((data) => {
        setTransportData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error(error);
        setTransportData([]);
      });
  }, [ruta]);

  usePolling(fetchTransportData, APP_CONFIG.transportPollingMs);

  const busIcon = useMemo(
    () =>
      new L.divIcon({
        className: "custom-icon",
        html: `<img src="${busIcono}" width="16" height="16" alt="bus" />`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    []
  );

  useEffect(() => {
    const [nextLat, nextLong] = averageCoordinates(transportData, APP_CONFIG.fallbackMapCenter);
    setLatCenter(nextLat);
    setLongCenter(nextLong);
  }, [transportData]);

  useEffect(() => {
    const onResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (mapMode === "map") {
      setIsPlaying(false);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, RADAR_TIMEOUT_MS);

    setIsLayerLoading(true);
    setLayerError("");

    const loadFramesPromise =
      mapMode === "forecast"
        ? fetchPrecipitationForecastFrames({ hours: FORECAST_HOURS })
        : fetchRadarFramesLast12h({ signal: controller.signal });

    loadFramesPromise
      .then((payload) => {
        if (isCancelled) {
          return;
        }
        const safeFrames = Array.isArray(payload.frames) ? payload.frames : [];
        setLayerFrames(safeFrames);
        setHorizonLabel(payload.horizonLabel || "Últimas 12h");
        setFrameIndex((previousIndex) => {
          const maxIndex = Math.max(safeFrames.length - 1, 0);
          return Math.min(previousIndex, maxIndex);
        });
        if (!safeFrames.length) {
          throw new Error("No frames available");
        }
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        if (error.name === "AbortError") {
          return;
        }
        console.error(error);
        if (mapMode === "forecast" && String(error?.message || "").includes("Missing OpenWeather API key")) {
          setLayerError("Pronóstico no disponible: falta REACT_APP_OPENWEATHER_TILE_API_KEY");
          return;
        }
        setLayerError(mapMode === "forecast" ? "Pronóstico no disponible" : "Radar no disponible");
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }
        clearTimeout(timeoutId);
        setIsLayerLoading(false);
      });

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mapMode, reloadLayerToken]);

  useEffect(() => {
    if (mapMode === "map" || !isPlaying || layerFrames.length <= 1) {
      return;
    }

    const intervalMs = Math.max(350, Math.round(1000 / playSpeed));
    const timer = setInterval(() => {
      setFrameIndex((previousIndex) => (previousIndex + 1) % layerFrames.length);
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [mapMode, isPlaying, playSpeed, layerFrames.length]);

  useEffect(() => {
    if (mapMode === "map" || layerFrames.length <= 1) {
      return;
    }

    const prefetchWindow = isMobileViewport ? 1 : 2;
    const zoom = isMobileViewport ? 5 : 6;
    const urls = [];

    for (let offset = -prefetchWindow; offset <= prefetchWindow; offset += 1) {
      if (offset === 0) {
        continue;
      }

      const candidateIndex = frameIndex + offset;
      if (candidateIndex < 0 || candidateIndex >= layerFrames.length) {
        continue;
      }

      const url = buildPrefetchTileUrl(layerFrames[candidateIndex].urlTemplate, latcenter, longcenter, zoom);
      if (url) {
        urls.push(url);
      }
    }

    let idleId = null;
    let timeoutId = null;

    const runPrefetch = () => {
      urls.forEach((url) => prefetchTile(url));
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(runPrefetch);
    } else {
      timeoutId = window.setTimeout(runPrefetch, 220);
    }

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [mapMode, layerFrames, frameIndex, latcenter, longcenter, isMobileViewport]);

  const handleModeChange = useCallback((nextMode) => {
    setMapMode(nextMode);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((previousState) => !previousState);
  }, []);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setFrameIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setFrameIndex((previousIndex) => Math.min(previousIndex + 1, Math.max(layerFrames.length - 1, 0)));
  }, [layerFrames.length]);

  const handleScrub = useCallback((nextFrameIndex) => {
    setIsPlaying(false);
    setFrameIndex(nextFrameIndex);
  }, []);

  const handleRetryLayer = useCallback(() => {
    setReloadLayerToken((previousToken) => previousToken + 1);
  }, []);

  const hasTransport = transportData.length > 0;
  const activeLayerFrame = layerFrames[frameIndex];
  const currentRadarLabel = activeLayerFrame?.label || "--:--";
  const showLayerControls = mapMode !== "map" && !isLayerLoading && !layerError;
  const overlayLoadingLabel = mapMode === "forecast" ? "Cargando pronóstico..." : "Cargando radar...";

  return (
    <div className="transport-map-frame mapPanel" aria-label="Mapa de transporte">
      <MapContainer className="transport-map-canvas" center={[latcenter, longcenter]} zoom={12} scrollWheelZoom={true}>
        <RecenterMap lat={latcenter} lng={longcenter} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RadarLayer
          enabled={mapMode !== "map" && !isLayerLoading && !layerError}
          frame={activeLayerFrame}
          opacity={radarOpacity}
        />

        {transportData.map((data, index) => {
          const markerPosition = [data.latitude, data.longitude];

          return (
            <Marker key={index} position={markerPosition} icon={busIcon}>
              <Popup>
                <div className="transport-popup">
                  <p>
                    <strong>
                      <FaInfo /> Información
                    </strong>
                  </p>
                  <p>
                    <FaRoad /> Ruta: {data.route_short_name}
                  </p>
                  <p>
                    <FaTachometerAlt /> Velocidad: {data.speed.toFixed(2)}
                  </p>
                  <p>
                    <FaDirections /> Dirección: {data.direction === "1" ? "IDA" : "VUELTA"}
                  </p>
                  <p>
                    <FaBus /> Empresa: {data.agency_name}
                  </p>
                  <p>
                    <FaMapMarker /> Destino: {data.trip_headsign}
                  </p>
                  <p>
                    Centro: {latcenter}, {longcenter}
                  </p>
                  <p>
                    <a href={`https://www.bing.com/maps?cp=${data.latitude}~${data.longitude}&lvl=17.0`} target="_blank" rel="noopener noreferrer">
                      <FaMapMarked /> Abrir en mapa externo
                    </a>
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="map-overlay-top">
        <MapLayerToggle mapMode={mapMode} onChange={handleModeChange} />
      </div>

      {mapMode !== "map" && isLayerLoading ? (
        <div className="map-overlay-status card card-glass" role="status" aria-live="polite">
          {overlayLoadingLabel}
        </div>
      ) : null}

      {mapMode !== "map" && layerError ? (
        <div className="map-overlay-status card card-glass">
          <p>{layerError}</p>
          <div className="map-overlay-actions">
            <button type="button" className="btn btn-ghost" onClick={handleRetryLayer}>
              Reintentar
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setMapMode("map")}>
              Volver a mapa
            </button>
          </div>
        </div>
      ) : null}

      {showLayerControls ? (
        <div className="map-overlay-bottom">
          <RadarControls
            frameIndex={frameIndex}
            totalFrames={layerFrames.length}
            currentLabel={currentRadarLabel}
            horizonLabel={horizonLabel}
            isPlaying={isPlaying}
            playSpeed={playSpeed}
            onTogglePlay={handleTogglePlay}
            onStepBack={handleStepBack}
            onStepForward={handleStepForward}
            onScrub={handleScrub}
            onChangeSpeed={setPlaySpeed}
          />
        </div>
      ) : null}

      {!hasTransport ? <div className="transport-empty">Sin unidades disponibles para la ruta seleccionada.</div> : null}
    </div>
  );
}

export default TransportMap;
