import React from "react";
import { FaArrowDown, FaCalendar, FaClock, FaMapMarker, FaThermometerQuarter, FaWind } from "react-icons/fa";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { getDayOfMonth, getHourMinute, getWeekdayName } from "../../../core/utils/dateTime";
import CardTemp from "./CardTemp";
import { getWeatherPresentation } from "../utils/weatherPresentation";
import "./weather.css";

function CardTermo({ Data, city }) {
  const tempact = Data.current_weather.temperature.toFixed(1);
  const tempPercent = ((Number(tempact) + 15) * 100) / 60;
  const wind = Data.current_weather.windspeed.toFixed(1);
  const windd = Data.current_weather.winddirection.toFixed(0);
  const hora = getHourMinute(Data.current_weather.time);

  const ciudad = city || "Ubicación actual";
  const currentWeather = getWeatherPresentation(Data.current_weather.weathercode, Data.current_weather.is_day !== 0);
  const CurrentWeatherIcon = currentWeather.Icon;

  const forecast = [1, 2, 3, 4, 5, 6].map((index) => ({
    dayName: getWeekdayName(Data.daily.time[index]),
    dayNumber: getDayOfMonth(Data.daily.time[index]),
    max: Data.daily.temperature_2m_max[index].toFixed(0),
    min: Data.daily.temperature_2m_min[index].toFixed(0),
    weather: getWeatherPresentation(Data.daily.weathercode[index], true),
  }));

  return (
    <section className="card weather-summary card-glass" aria-label="Resumen de clima actual">
      <div className="weather-summary-main">
        <div className="weather-gauge">
          <h6>Temp.</h6>
          <Progress.Circle
            percent={Math.max(0, Math.min(100, tempPercent))}
            strokeColor="var(--color-primary)"
            trailColor="rgba(148, 163, 184, 0.28)"
            strokeWidth={8}
            showInfo={false}
          />
          <p>
            {tempact}
            {decodeURI("%C2%B0C")}
          </p>
        </div>

        <div className="weather-current">
          <h2 className="weather-city">
            <FaMapMarker /> {ciudad}
          </h2>
          <p className="weather-meta">
            <FaClock /> {hora}
          </p>
          <p className="weather-meta">
            <FaThermometerQuarter />
            {tempact}
            {Data.hourly_units.temperature_2m}
          </p>
          <p className="weather-meta">
            <FaWind />
            {wind}
            {Data.daily_units.windspeed_10m_max}
            <FaArrowDown style={{ transform: `rotate(${windd}deg)` }} />
          </p>
        </div>

        <CurrentWeatherIcon className="weather-main-icon weather-main-symbol" aria-label={currentWeather.label} />
      </div>

      <div className="forecast-grid" aria-label="Pronóstico próximos días">
        {forecast.map((item, index) => {
          const ForecastIcon = item.weather.Icon;

          return (
            <article className="forecast-item" key={`forecast-${index}`}>
              <p className="metric-subtext">
                <FaCalendar aria-hidden="true" /> {item.dayName} {item.dayNumber}
              </p>
              <ForecastIcon className="forecast-weather-icon" aria-label={item.weather.label} />
              <p className="forecast-range">↑ {item.max}º</p>
              <p className="forecast-range">↓ {item.min}º</p>
            </article>
          );
        })}
      </div>

      <CardTemp Data={Data} />
    </section>
  );
}

export default CardTermo;
