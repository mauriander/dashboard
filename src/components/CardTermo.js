import React from "react";
import styled from "styled-components";
import CardTemp from "./CardTemp";
import {
  FaArrowDown,
  FaCalendar,
  FaClock,
  FaMapMarker,
  FaThermometerQuarter,
  FaWind,
} from "react-icons/fa";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import CodigoClima from "../imgclima.json";

const Termo2 = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);  
  font-size: 18px;  
  align-items:center;
  margin-bottom: 2px;

`;

const Dia = styled.div`
  display: grid;
  font-size: 5vh;  
  align-items:center;


`;
const CalendarioContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NumeroDia = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5vh;
  font-weight: bold;   
  color: #ff6600;
  
`;


const Termo = styled.div`
   width: 90%;
  height: auto;
  padding: 6px;
  margin: 6px;
  justify-content: center;
  box-shadow: 0 2px 30px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  text-align: center;
  background: transparent;

  @media (max-width: 480px) {
    margin: 32px;
    padding: 16px;
    justify-content: center;
    align-items: center;
  }
`;
const Temperatura = styled.div`
  ${"" /* position: absolute; */}
  text-align: center;
`;

const Ciudad = styled.div`
  display: flex;
  text-align: center;
  ${"" /* align-items:flex-end; */}
  font-weight: bold;
  justify-content: center;
  align-items: center;
`;

function CardTermo({ Data, city }) {
  // const promedioTemperatura =
  //   UserData.reduce((total, data) => total + data.temperatura, 0) /
  //   UserData.length;
  // const [promedio, setPromedio] = useState(promedioTemperatura.toFixed(0));
  // de api josn
  const tempact = Data.current_weather.temperature.toFixed(1);
  const tempPercent = ((Number(tempact) + 15) * 100) / 60;
  const wind = Data.current_weather.windspeed.toFixed(1);
  const windd = Data.current_weather.winddirection.toFixed(0);
  const hora = Data.current_weather.time.slice(11, 16);
  //const [ciudad, setCiudad] = useState("Ubicacion Actual");

  const ciudad=city;
  
  const EstadoClima = Data.current_weather.weathercode;
  const IconoEstadoClima = CodigoClima[EstadoClima].icons;
  //Maximo y minimo para cada dia
  const setMaximo1 = Data.daily.temperature_2m_max[1].toFixed(0);
  const setMinimo1 = Data.daily.temperature_2m_min[1].toFixed(0);
  const setDia1= Data.daily.time[1].slice(8,10);
  const setDia2= Data.daily.time[2].slice(8,10);
  const setDia3= Data.daily.time[3].slice(8,10);
  const setDia4= Data.daily.time[4].slice(8,10);
  const setDia5= Data.daily.time[5].slice(8,10);
  const setDia6= Data.daily.time[6].slice(8,10);

  const IconoEstadoClima1 = CodigoClima[Data.daily.weathercode[1]].icons;
  const setMaximo2 = Data.daily.temperature_2m_max[2].toFixed(0);
  const setMinimo2 = Data.daily.temperature_2m_min[2].toFixed(0);
  const IconoEstadoClima2 = CodigoClima[Data.daily.weathercode[2]].icons;
  const setMaximo3 = Data.daily.temperature_2m_max[3].toFixed(0);
  const setMinimo3 = Data.daily.temperature_2m_min[3].toFixed(0);
  const IconoEstadoClima3 = CodigoClima[Data.daily.weathercode[3]].icons;
  const setMaximo4 = Data.daily.temperature_2m_max[4].toFixed(0);
  const setMinimo4 = Data.daily.temperature_2m_min[4].toFixed(0);
  const IconoEstadoClima4 = CodigoClima[Data.daily.weathercode[4]].icons;
  const setMaximo5 = Data.daily.temperature_2m_max[5].toFixed(0);
  const setMinimo5 = Data.daily.temperature_2m_min[5].toFixed(0);
  const IconoEstadoClima5 = CodigoClima[Data.daily.weathercode[5]].icons;
  const setMaximo6 = Data.daily.temperature_2m_max[6].toFixed(0);
  const setMinimo6 = Data.daily.temperature_2m_min[6].toFixed(0);
  const IconoEstadoClima6 = CodigoClima[Data.daily.weathercode[6]].icons;

  return (
    <Termo >
      <h6 style={{ margin: "0px" }}>Temp.</h6>
      <Progress.Circle
        percent={Math.max(0, Math.min(100, tempPercent))}
        strokeColor="#7dcea0"
        trailColor="rgba(255,255,255,0.2)"
        strokeWidth={8}
        showInfo={false}
      />
      <p style={{ margin: "0px" }}>
        {tempact}
        {decodeURI("%C2%B0C")}
      </p>
      <Ciudad>
        <FaMapMarker />
        {ciudad}
      </Ciudad>
      <Temperatura>
        {" "}
        <FaClock />
        {hora} &nbsp; <FaThermometerQuarter />
        {tempact}
        {Data.hourly_units.temperature_2m}
      </Temperatura>
      <Temperatura>
        {" "}
        <FaWind />
        {wind}
        {Data.daily_units.windspeed_10m_max}&nbsp;
        <FaArrowDown style={{ transform: `rotate(${windd}deg)` }} />
      </Temperatura>
      <img
        src={IconoEstadoClima}
        alt="Clima"
        style={{
          width: "10vh",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "10vh",
        }}
      />
      <Termo2 >
       <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia1}</NumeroDia>
    </CalendarioContainer></Dia>
    <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia2}</NumeroDia>
    </CalendarioContainer></Dia>
    <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia3}</NumeroDia>
    </CalendarioContainer></Dia>
    <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia4}</NumeroDia>
    </CalendarioContainer></Dia>
    <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia5}</NumeroDia>
    </CalendarioContainer></Dia>
    <Dia><CalendarioContainer>
      <FaCalendar />
      <NumeroDia>{setDia6}</NumeroDia>
    </CalendarioContainer></Dia>
    
      

      <img
          src={IconoEstadoClima1}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />
        <img
          src={IconoEstadoClima2}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />
        <img
          src={IconoEstadoClima3}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />
        <img
          src={IconoEstadoClima4}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />
        <img
          src={IconoEstadoClima5}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />
        <img
          src={IconoEstadoClima6}
          alt="Clima"
          style={{
            width: "5vh",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5vh",
          }}
        />

        <p style={{ margin: "0px" }}>{setMaximo1}º</p>
        <p style={{ margin: "0px" }}>{setMaximo2}º</p>
        <p style={{ margin: "0px" }}>{setMaximo3}º</p>
        <p style={{ margin: "0px" }}>{setMaximo4}º</p>
        <p style={{ margin: "0px" }}>{setMaximo5}º</p>
        <p style={{ margin: "0px" }}>{setMaximo6}º</p>
        <p style={{ margin: "0px" }}>{setMinimo1}º</p>
        <p style={{ margin: "0px" }}>{setMinimo2}º</p>
        <p style={{ margin: "0px" }}>{setMinimo3}º</p>
        <p style={{ margin: "0px" }}>{setMinimo4}º</p>
        <p style={{ margin: "0px" }}>{setMinimo5}º</p>
        <p style={{ margin: "0px" }}>{setMinimo6}º</p>  
      </Termo2>
      <CardTemp Data={Data} />
    </Termo>
  );
}

export default CardTermo;
