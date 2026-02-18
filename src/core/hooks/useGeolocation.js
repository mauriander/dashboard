import { useEffect, useState } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords(position.coords);
    });
  }, []);

  return coords;
}
