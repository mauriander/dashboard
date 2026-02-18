import React from "react";
import { TileLayer } from "react-leaflet";

function RadarLayer({ enabled, frame, opacity = 0.72 }) {
  if (!enabled || !frame) {
    return null;
  }

  return (
    <TileLayer
      key={frame.timestamp}
      url={frame.urlTemplate}
      opacity={opacity}
      zIndex={450}
      maxNativeZoom={frame.maxNativeZoom}
      minZoom={frame.minZoom}
      maxZoom={frame.maxZoom}
    />
  );
}

export default RadarLayer;
