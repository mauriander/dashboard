import { useEffect } from "react";
import { useMap } from "react-leaflet";

function RecenterMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (typeof lat !== "number" || typeof lng !== "number") {
      return;
    }

    const currentZoom = map.getZoom();
    map.setView([lat, lng], currentZoom, { animate: false });
  }, [lat, lng, map]);

  return null;
}

export default RecenterMap;
