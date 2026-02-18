import React from "react";

function MapLayerToggle({ mapMode, onChange }) {
  return (
    <div className="map-layer-toggle" role="group" aria-label="Alternar capas del mapa">
      <button
        type="button"
        className={`chip ${mapMode === "map" ? "active" : ""}`}
        onClick={() => onChange("map")}
        aria-pressed={mapMode === "map"}
      >
        Mapa
      </button>
      <button
        type="button"
        className={`chip ${mapMode === "radar" ? "active" : ""}`}
        onClick={() => onChange("radar")}
        aria-pressed={mapMode === "radar"}
      >
        Radar (pasado)
      </button>
      <button
        type="button"
        className={`chip ${mapMode === "forecast" ? "active" : ""}`}
        onClick={() => onChange("forecast")}
        aria-pressed={mapMode === "forecast"}
      >
        Pronóstico
      </button>
    </div>
  );
}

export default MapLayerToggle;
