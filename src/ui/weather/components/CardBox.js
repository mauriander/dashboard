import React, { useState, useEffect } from "react";
import { FaCircle, FaEye, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import sunrise from "../../../img/sunrise.png";
import sunset from "../../../img/sunset.png";
import { classifyByRange } from "../../../core/utils/rangeClassifier";
import { getHour } from "../../../core/utils/dateTime";
import "./weather.css";

const rangeMappingsViento = {
  "0-5": ["Brisas suaves", "yellow"],
  "6-10": ["Vientos suaves", "yellow"],
  "11-20": ["Vientos leves", "orange"],
  "21-32": ["Vientos Moderados", "orange"],
  "33-50": ["Vientos fuertes", "red"],
  "51-500": ["Vientos muy fuertes", "red"],
};

const rangeMappingsVisibilidad = {
  "0-2": ["Muy Baja", "red"],
  "2-5": ["Baja", "orange"],
  "5-10": ["Moderada", "yellow"],
  "10-20": ["Buena", "lightgreen"],
  "20-50": ["Muy Buena", "green"],
  "50-100": ["Excelente", "darkgreen"],
};

const rangeMappingsUVIndex = {
  "0-2": ["Bajo", "#2e86c1"],
  "3-5": ["Moderado", "#7dcea0"],
  "6-7": ["Alto", "#f7dc6f"],
  "8-10": ["Muy Alto", "#ff4e50"],
  "11-50": ["Extremadamente Alto", "red"],
};

const rangeMappingsLluvia = {
  "0-30": ["Muy Baja", "green"],
  "31-50": ["Baja", "lightgreen"],
  "61-70": ["Moderada", "yellow"],
  "71-90": ["Alta", "lightblue"],
  "91-100": ["Muy Alta", "blue"],
};

const rangeMappingsHumedad = {
  "0-20": ["Muy Baja", "#2e86c1"],
  "21-40": ["Baja", "#77C2BF"],
  "41-60": ["Moderada", "#44C5C0"],
  "61-80": ["Alta", "lightblue"],
  "81-100": ["Muy Alta", "#448CC5"],
};

function CardBox({ Data }) {
  const [userhData, setUserhData] = useState(null);
  const [userwvData, setUserwvData] = useState(0);
  const [uservData, setUservData] = useState(null);
  const [useruvData, setUseruvData] = useState(null);
  const [usersriseData, setUsersriseData] = useState(null);
  const [usersrssetData, setUserssetData] = useState(0);
  const [usersppData, setUserppData] = useState(0);
  const [userwvDatac, setUserwvDatac] = useState("");
  const [userwvDatad, setUserwvDatad] = useState("");

  const safeClassify = (value, mapping, fallback = [value, "Sin dato", "var(--color-text-muted)"]) => {
    return classifyByRange(value, mapping) || fallback;
  };

  useEffect(() => {
    if (!Data) {
      return;
    }

    const hora = getHour(Data.current_weather.time);
    const windClass = classifyByRange(Data.daily.windspeed_10m_max[0].toFixed(0), rangeMappingsViento) || [
      Data.daily.windspeed_10m_max[0].toFixed(0),
      "Sin dato",
      "var(--color-text-muted)",
    ];

    setUserhData(Data.hourly.relativehumidity_2m[hora]);

    setUserwvData(+Data.daily.windspeed_10m_max[0]);
    setUserwvDatac(windClass[2]);
    setUserwvDatad(windClass[1]);

    setUservData((Data.hourly.visibility[hora] / 1000).toFixed(1));
    setUserppData(Data.hourly.precipitation_probability[hora]);
    setUseruvData(Data.daily.uv_index_max[0].toFixed(0));
    setUsersriseData(Data.daily.sunrise[0].slice(11, 16));
    setUserssetData(Data.daily.sunset[0].slice(11, 16));
  }, [Data]);

  if (Data === null) {
    return <div className="status-banner warning">Cargando métricas climáticas...</div>;
  }

  return (
    <section className="weather-metrics-grid" aria-label="Métricas climáticas">
      <article className="metric-card">
        <h3 className="metric-title">Índice UV</h3>
        <p className="metric-value kpi">{useruvData}</p>
        <div className="metric-progress">
          <Progress.Line
            percent={(useruvData * 100) / 11}
            strokeColor={safeClassify(useruvData, rangeMappingsUVIndex)[2]}
            vertical={false}
            showInfo={false}
            strokeWidth={12}
          />
        </div>
        <p className="metric-subtext">{safeClassify(useruvData, rangeMappingsUVIndex)[1]}</p>
      </article>

      <article className="metric-card">
        <h3 className="metric-title">Salida y puesta</h3>
        <div className="metric-sun">
          <p className="metric-subtext">Amanecer</p>
          <img src={sunrise} alt="Amanecer" />
          <p className="metric-value kpi">{usersriseData}</p>
        </div>
        <div className="metric-sun">
          <p className="metric-subtext">Atardecer</p>
          <img src={sunset} alt="Atardecer" />
          <p className="metric-value kpi">{usersrssetData}</p>
        </div>
      </article>

      <article className="metric-card">
        <h3 className="metric-title">Visibilidad</h3>
        <p className="metric-value kpi">{uservData} km</p>
        <p className="metric-subtext metric-inline">
          <FaEye className="metric-icon" />
          <FaCircle style={{ color: safeClassify(uservData, rangeMappingsVisibilidad)[2] }} />
          {safeClassify(uservData, rangeMappingsVisibilidad)[1]}
        </p>
      </article>

      <article className="metric-card">
        <h3 className="metric-title">Humedad</h3>
        <p className="metric-value kpi">
          {userhData}
          {Data.hourly_units.relativehumidity_2m}
        </p>
        <div className="metric-progress">
          <Progress.Line
            percent={userhData}
            strokeColor={safeClassify(userhData, rangeMappingsHumedad)[2]}
            vertical={false}
            showInfo={false}
            strokeWidth={12}
          />
        </div>
        <p className="metric-subtext metric-inline">
          <WiHumidity className="metric-icon" /> {safeClassify(userhData, rangeMappingsHumedad)[1]}
        </p>
      </article>

      <article className="metric-card">
        <h3 className="metric-title">Viento</h3>
        <p className="metric-value kpi">
          {userwvData}
          {Data.daily_units.windspeed_10m_max}
        </p>
        <p className="metric-subtext">{userwvDatad}</p>
        <p className="metric-subtext metric-inline">
          <FaWind className="metric-icon" style={{ color: userwvDatac }} /> Intensidad actual
        </p>
      </article>

      <article className="metric-card">
        <h3 className="metric-title">Prob. lluvia</h3>
        <p className="metric-value kpi">{usersppData}%</p>
        <div className="metric-progress">
          <Progress.Line
            percent={usersppData}
            strokeColor={safeClassify(usersppData, rangeMappingsLluvia)[2]}
            vertical={false}
            showInfo={false}
            strokeWidth={12}
          />
        </div>
        <p className="metric-subtext">{safeClassify(usersppData, rangeMappingsLluvia)[1]}</p>
      </article>
    </section>
  );
}

export default CardBox;
