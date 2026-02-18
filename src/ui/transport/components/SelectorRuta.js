import React, { useState, useEffect } from "react";
import { fetchAllTransportVehicles } from "../services/transportService";
import "./transport.css";

function SelectorRuta({ onRouteChange }) {
  const [transportData, setTransportData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetchAllTransportVehicles()
      .then((data) => {
        setTransportData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTransportData([]);
        setLoading(false);
      });
  }, []);

  const handleRouteChange = (event) => {
    const selectedRouteID = transportData.find((item) => item.route_short_name === event.target.value)?.route_id;
    setSelectedRoute({ name: event.target.value, id: selectedRouteID });
    onRouteChange(selectedRouteID);
  };

  const routeNames = [...new Set((Array.isArray(transportData) ? transportData : []).map((item) => item.route_short_name))].filter(Boolean).sort();

  return (
    <div className="route-selector">
      <label className="field-label" htmlFor="routeSelector">
        Seleccionar línea
      </label>
      <select id="routeSelector" className="control" onChange={handleRouteChange} aria-label="Seleccionar línea de colectivo">
        <option value="">Selecciona una ruta</option>
        {loading ? (
          <option value="" disabled>
            Cargando rutas...
          </option>
        ) : (
          routeNames.map((routeName, index) => (
            <option key={index} value={routeName}>
              {routeName} {transportData.find((item) => item.route_short_name === routeName)?.trip_headsign}
            </option>
          ))
        )}
      </select>
      {selectedRoute ? <p className="route-selected">Ruta seleccionada: {selectedRoute.name}</p> : null}
    </div>
  );
}

export default SelectorRuta;
