import React, { useState, useEffect, useCallback } from "react";
import { APP_CONFIG } from "../../config/app";
import { FaBars, FaTimes } from "react-icons/fa";
import { mapWeatherToBarChartData } from "../weather/mappers/weatherChartData";
import { fetchWeatherByCoordinates, fetchCityNameByCoordinates } from "../weather/services/weatherService";
import SearchCity from "../search/components/SearchCity";
import CardTermo from "../weather/components/CardTermo";
import BarChart from "../weather/components/BarChart";
import CardBox from "../weather/components/CardBox";
import SelectorRuta from "../transport/components/SelectorRuta";
import TransportMap from "../transport/components/TransportMap";
import "./dashboard.css";

function DashboardPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uData, setUData] = useState(null);
  const [Data, setData] = useState(null);
  const [city, setCity] = useState(null);
  const [rutaid, setRutaId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRouteChange = (selectedRouteID) => {
    setRutaId(selectedRouteID);
  };

  const loadWeatherData = useCallback(async (latitude, longitude) => {
    setWeatherError("");

    try {
      const [weatherData, cityName] = await Promise.all([
        fetchWeatherByCoordinates(latitude, longitude),
        fetchCityNameByCoordinates(latitude, longitude),
      ]);
      setData(weatherData);
      setCity(cityName);
    } catch (error) {
      console.error(error);
      setWeatherError("No pudimos actualizar el clima. Reintentá en unos segundos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadWeatherData(APP_CONFIG.defaultWeatherCoordinates.latitude, APP_CONFIG.defaultWeatherCoordinates.longitude);
  }, [loadWeatherData]);

  const handleLocationSearch = (selectedLocation) => {
    setIsLoading(true);
    setIsSidebarOpen(false);
    loadWeatherData(selectedLocation.latitude, selectedLocation.longitude);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setWeatherError("Este navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoading(true);
        loadWeatherData(latitude, longitude).finally(() => {
          setIsLocating(false);
        });
      },
      (error) => {
        console.error(error);
        setWeatherError("No pudimos acceder a tu ubicación. Podés seguir usando la búsqueda manual.");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    if (Data && Data.hourly) {
      setUData(mapWeatherToBarChartData(Data));
    }
  }, [Data]);

  const showLoading = isLoading && (!Data || !uData);
  const hasWeatherData = Boolean(Data?.hourly && Data?.daily && Data?.current_weather && uData);

  return (
    <div className="dashboard-root app-shell" data-theme={isDarkMode ? "dark" : "light"}>
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1 className="dashboard-title">Weather + Transit Dashboard</h1>
          <p className="dashboard-subtitle">Condiciones actuales, pronóstico y transporte en una sola vista.</p>
        </div>
        <div className="dashboard-actions">
          <button
            className="btn btn-ghost mobile-nav-toggle"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir panel lateral"
            aria-expanded={isSidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            <FaBars aria-hidden="true" />
          </button>
          <button className="btn btn-ghost" type="button" onClick={handleUseCurrentLocation} aria-label="Usar mi ubicación actual">
            {isLocating ? "Ubicando..." : "Usar mi ubicación"}
          </button>
          <button className="btn btn-primary" type="button" onClick={toggleDarkMode} aria-label="Alternar modo claro y oscuro">
            {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {weatherError ? <div className="status-banner error">{weatherError}</div> : null}
        {isSidebarOpen ? (
          <button
            className="sidebar-backdrop"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar panel lateral"
          ></button>
        ) : null}

        {showLoading ? (
          <section className="loading-grid" aria-label="Cargando datos del dashboard">
            <div className="loading-card skeleton"></div>
            <div className="loading-card skeleton"></div>
            <div className="loading-card tall skeleton"></div>
          </section>
        ) : null}

        {!showLoading && !hasWeatherData ? (
          <section className="card empty-state" role="status" aria-live="polite">
            <h3>No hay datos para mostrar</h3>
            <p>Podés buscar una ciudad o reintentar con tu ubicación actual.</p>
          </section>
        ) : null}

        {!showLoading && hasWeatherData ? (
          <section className="dashboard-grid grid" aria-label="Contenido principal del dashboard">
            <aside id="dashboard-sidebar" className={`dashboard-column left sidebar ${isSidebarOpen ? "open" : ""}`}>
              <section className="card card-soft panel card-glass">
                <div className="sidebar-inner">
                  <button
                    className="sidebar-close"
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Cerrar panel lateral"
                  >
                    <FaTimes aria-hidden="true" />
                  </button>
                  <div className="panel-heading">
                    <h2 className="panel-title">Ubicación</h2>
                    <p className="panel-subtitle">Seleccioná ciudad o GPS</p>
                  </div>
                  <div className="stack">
                    <SearchCity onLocationSearch={handleLocationSearch} />
                    <CardTermo Data={Data} city={city} />
                  </div>
                </div>
              </section>
            </aside>

            <section className="dashboard-column center">
              <section className="card card-strong panel">
                <div className="panel-heading">
                  <h2 className="panel-title">Tendencia térmica</h2>
                  <p className="panel-subtitle">Próximas 24 horas</p>
                </div>
                <BarChart chartData={uData} options={uData.options} />
              </section>

              <section className="card panel card-soft">
                <div className="panel-heading">
                  <h2 className="panel-title">Indicadores climáticos</h2>
                  <p className="panel-subtitle">Estado actual y riesgo</p>
                </div>
                <CardBox Data={Data} />
              </section>
            </section>

            <section className="dashboard-column right">
              <section className="card card-strong panel transport-panel">
                <div className="panel-heading">
                  <h2 className="panel-title">Transporte</h2>
                  <p className="panel-subtitle">Posición en tiempo real</p>
                </div>
                <div className="stack">
                  <SelectorRuta onRouteChange={handleRouteChange} />
                  <div className="transport-map-slot map-container">
                    <TransportMap ruta={rutaid} />
                  </div>
                </div>
              </section>
            </section>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default DashboardPage;
