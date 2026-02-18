import React from "react";
import "./weather.css";

function CardTemp({ Data }) {
  const maximo = Data.daily.temperature_2m_max[0];
  const minimo = Data.daily.temperature_2m_min[0];

  return (
    <div className="temp-range">
      <article className="temp-card max">
        <span className="temp-label">Máxima</span>
        <span className="temp-value">
          {maximo}
          {Data.daily_units.temperature_2m_max}
        </span>
      </article>
      <article className="temp-card min">
        <span className="temp-label">Mínima</span>
        <span className="temp-value">
          {minimo}
          {Data.daily_units.temperature_2m_min}
        </span>
      </article>
    </div>
  );
}

export default CardTemp;
