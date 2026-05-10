import React from "react";
import { WEATHER_LAYER_METADATA } from "../radar/radarProvider";

const layerOrder = ["map", "radar", "forecast"];

function MapLayerToggle({ mapMode, onChange }) {
  return (
    <div className="map-layer-toggle" role="group" aria-label="Alternar capas del mapa">
      {layerOrder.map((layerId) => {
        const layer = WEATHER_LAYER_METADATA[layerId];

        return (
          <button
            key={layer.id}
            type="button"
            className={`chip ${mapMode === layer.id ? "active" : ""}`}
            onClick={() => onChange(layer.id)}
            aria-pressed={mapMode === layer.id}
          >
            {layer.label}
            {layer.isBeta ? <span className="chip-beta">Beta</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default MapLayerToggle;
