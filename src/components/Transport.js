import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaBus, FaInfo, FaRoad, FaDirections, FaTachometerAlt, FaMapMarker, FaMapMarked } from "react-icons/fa";
import L from "leaflet";
import busIcono from "../img/bus-svgrepo-com.svg";

function Transport({ ruta }) {
  const [transportData, setTransportData] = useState([]);
  const [latcenter, setLatCenter] = useState(-34.62344);
  const [longcenter, setLongCenter] = useState(-58.479999);
  const [mapKey, setMapKey] = useState(0);

  const CLIENT_ID = process.env.REACT_APP_TRANSPORT_CLIENT_ID || "";
  const CLIENT_SECRET = process.env.REACT_APP_TRANSPORT_CLIENT_SECRET || "";
  const ROUTE_ID = "1468";

  const fetchTransportData = () => {
      let fetchURL;
   if (ruta) {
    fetchURL = `https://datosabiertos-transporte-apis.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?route_id=${ruta}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  } else {
    fetchURL = `https://datosabiertos-transporte-apis.buenosaires.gob.ar/colectivos/vehiclePositionsSimple?route_id=${ROUTE_ID}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  }

  fetch(fetchURL)
      .then((response) => response.json())
      .then((datat) => {
        setTransportData(datat);
        // console.log("datat " + datat.length);
        // const totalDataPoints = datat.length;
        // let totalLatitude = 0;
        // let totalLongitude = 0;

        // for (const data of datat) {
        //     totalLatitude += data.latitude;

        //     totalLongitude += data.longitude;
        //   }

        // setLatCenter((totalLatitude / totalDataPoints).toFixed(7));
        // setLongCenter((totalLongitude / totalDataPoints).toFixed(7));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchTransportData();

    const interval = setInterval(() => {
      fetchTransportData();
    }, 31000);

    return () => {
      clearInterval(interval);
    };
  }, [ruta]);

// const busIconHtml = ReactDOMServer.renderToString(<img width="18" height="18" src="https://img.icons8.com/color/48/bus.png" alt="bus"/>);
//  const busIcon = new L.divIcon({
//    className: 'custom-icon',
//    html: busIconHtml,
//    iconSize: [50, 82],
//    iconAnchor: [24, 82],
//  });
const busIcon = new L.divIcon({
  className: 'custom-icon',
  html: `<img src="${busIcono}" width="16" height="16" alt="bus" />`,
  iconSize: [32, 32], // Ajusta el tamaño según las dimensiones de tu imagen SVG
  iconAnchor: [16, 16], // Ajusta el punto de anclaje según las dimensiones de tu imagen SVG
});

  //  const busIcon = new L.Icon({
  //   iconUrl: 'https://iconos8.es/icon/15137/autob%C3%BAs',
  //   iconSize: [50, 50], 
  // });

  useEffect(() => {
    const totalDataPoints = transportData.length;
    let totalLatitude = 0;
    let totalLongitude = 0;

    for (const data of transportData) {
      totalLatitude += data.latitude;
      totalLongitude += data.longitude;
    }
    const newLatCenter = totalLatitude / totalDataPoints;
    const newLongCenter = totalLongitude / totalDataPoints;
    //Agregar validacion sino nan
    if (!isNaN(newLatCenter) && !isNaN(newLongCenter)) {
      setLatCenter(newLatCenter.toFixed(6));
      setLongCenter(newLongCenter.toFixed(6));
    } else {
      setLatCenter(-34.62344);
      setLongCenter(-58.479999);
    }

    //Este mapeo lo sugirio chat gpt para incrementar la key y poder pasarla en el marker    key={mapKey}  center={[latcenter, longcenter]}
    setMapKey((prevKey) => prevKey + 1); // Incrementa la clave
    // console.log(      "dentro use efectlat din " +        latcenter +        " vs lat fijo -34.62344       long dinamico" +        longcenter +        " VS long fijo-58.479999"    );
  }, [transportData]);

  // console.log(     "fuera use efect lat din " +      latcenter +      " vs lat fijo -34.62344       long dinamico" +      longcenter +      " VS long fijo-58.479999"  );

  return (
    <MapContainer
      key={mapKey}
      center={[latcenter, longcenter]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "90vh", margin: "2px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

         {transportData.map((data, index) => {
        const markerPosition = [data.latitude, data.longitude];

        return (
         <Marker
            key={index}
            position={markerPosition}
            icon={busIcon}
          >
          <Popup>
             <div>
              <span>
                <FaInfo /> Información:
              </span>
              <p>
                {" "}
                <span>
                  <FaRoad></FaRoad> Ruta: {data.route_short_name}
                </span>
              </p>
              <p>
                <FaTachometerAlt></FaTachometerAlt> Velocidad:{" "}
                {data.speed.toFixed(2)}
              </p>
              <p>
                <FaDirections></FaDirections> Dirección:{" "}
                {data.direction === "1" ? "IDA" : "VUELTA"}
              </p>
              <p>
                {" "}
                <FaBus /> Empresa: {data.agency_name}
              </p>
              <p>
                {" "}
                <FaMapMarker /> Destino: {data.trip_headsign}
              </p>
              <p>
                {latcenter} , {longcenter}
              </p>

              <a
                href={`https://www.bing.com/maps?cp=${data.latitude}~${data.longitude}&lvl=17.0`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMapMarked /> Abrir Mapa
              </a>
            </div>
          </Popup>
        </Marker>);
         })}
    </MapContainer>
  );
}

export default Transport;
