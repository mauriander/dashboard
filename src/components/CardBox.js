import React, { useState, useEffect } from "react";
// import  Card  from './Card';
import styled from "styled-components";
import {FaCircle, FaEye, FaWind } from "react-icons/fa";
import {WiHumidity } from "react-icons/wi";
import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import sunrise from "../img/sunrise.png";
import sunset from "../img/sunset.png";
//import  Data  from "../api.json";

const CardBoxDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  align-items: center;
  background: transparent;
  background: rgba(255, 255, 255, 0.1);
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 3fr);
  }
`;
const Card = styled.div`
  width: 20vh;
  height: 25vh;
  border-radius: 5%;
  margin: 2px;
  z-index: 1;
  top: 1em;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(160px);
  @media (max-width: 480px) {
    margin: 6px;
  }
`;
const Numero = styled.h3`
  font-weight: bold;
  color: purple;
  font-size: 16px;
`;
const Unidad = styled.h6`
  text-align: center;
  font-size: 10px;
  color: light-purple;
`;
const Columna = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const Parrafo = styled.p`
  font-size: 10px;
  text-align: center;
`;
const Titulo = styled.h3`
  font-size: 16px;
  text-align: center;
`;

function CardBox({Data}) {
  const [userhData, setUserhData] = useState(null);
  const [userwvData, setUserwvData] = useState(0);
  // const [useraqData, setUseraqData] = useState(null);
  const [uservData, setUservData] = useState(null);
  const [useruvData, setUseruvData] = useState(null);
  const [usersriseData, setUsersriseData] = useState(null);
  const [usersrssetData, setUserssetData] = useState(0);
  const [usersppData, setUserppData] = useState(0);

  const [userwvDatac, setUserwvDatac] = useState('');
   const [userwvDatad, setUserwvDatad] = useState('');
     
 // const [Data, setData] = useState(null);
  // useEffect(() => {
  //   fetch(
  //     "https://api.open-meteo.com/v1/forecast?latitude=-31.4135&longitude=-64.181&hourly=temperature_2m,relativehumidity_2m,weathercode,visibility,temperature_80m,temperature_120m,temperature_180m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max&current_weather=true&timezone=America%2FSao_Paulo"
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data);
  //     })
  //     .catch((ex) => {
  //       console.error(ex);
  //     });
  // }, []);

  useEffect(() => {
      const hora= +Data.current_weather.time.slice(11, 13);
     if (Data) {
      
   
      
      
      setUserhData(Data.hourly.relativehumidity_2m[hora]);

      //wv wind velocity
      setUserwvData(+Data.daily.windspeed_10m_max[0]);
      setUserwvDatac((codificarViento(Data.daily.windspeed_10m_max[0].toFixed(0))[2]));
      setUserwvDatad((codificarViento(Data.daily.windspeed_10m_max[0].toFixed(0)))[1]);


      //v visibility
      setUservData((Data.hourly.visibility[hora] / 1000).toFixed(1));


setUserppData( Data.hourly.precipitation_probability[hora]);
// console.log('Probabilidad'+ usersppData);

      //uv indice uv
      setUseruvData(Data.daily.uv_index_max[0].toFixed(0));

      //sunrise and sunset
      setUsersriseData(Data.daily.sunrise[0].slice(11, 16));
      setUserssetData(Data.daily.sunset[0].slice(11, 16));
     }
   }, [Data]);

   if (Data === null) {
    return <div>Loading...</div>;
   }

  //aq air quality

    const rangeMappingsViento = {
     "0-5": ["Brisas suaves","yellow"],
     "6-10": ["Vientos suaves", "yellow"],
   "11-20": ["Vientos leves", "orange"],
   "21-32": ["Vientos Moderados", "orange"],
  "33-50": ["Vientos fuertes", "red"],
   "51-500": ["Vientos muy fuertes", "red"],
 }
   function codificarViento(valor) {
     for (const rango in rangeMappingsViento) {
       const [descripcion, color] = rangeMappingsViento[rango];
     const [min, max] = rango.split("-").map(Number);
       if (valor >= min && valor <= max) {
         return [valor, descripcion, color];
       }
     }
   }
  

   
   
      const rangeMappingsVisibilidad = {
 "0-2": ["Muy Baja", "red"],
  "2-5": ["Baja", "orange"],
  "5-10": ["Moderada", "yellow"],
  "10-20": ["Buena", "lightgreen"],
  "20-50": ["Muy Buena", "green"],
  "50-100": ["Excelente", "darkgreen"],
 }
   function codificarVisibilidad(valor) {
     for (const rango in rangeMappingsVisibilidad) {
       const [descripcion, color] = rangeMappingsVisibilidad[rango];
     const [min, max] = rango.split("-").map(Number);
       if (valor >= min && valor <= max) {
         return [valor, descripcion, color];
       }
     }
   }

const rangeMappingsUVIndex = {
  "0-2": ["Bajo", "#2e86c1"],
  "3-5": ["Moderado", "#7dcea0"],
  "6-7": ["Alto", "#f7dc6f"],
  "8-10": ["Muy Alto", "#ff4e50"],
  "11-50": ["Extremadamente Alto", "red"],
};
  function codificarIndiceUV(valor) {
     for (const rango in rangeMappingsUVIndex) {
       const [descripcion, color] = rangeMappingsUVIndex[rango];
     const [min, max] = rango.split("-").map(Number);
       if (valor >= min && valor <= max) {
         return [valor, descripcion, color];
       }
     }
   }

    const rangeMappingsLluvia = {
  "0-30": ["Muy Baja", "green"],
  "31-50": ["Baja", "lightgreen"],
  "61-70": ["Moderada", "yellow"],
  "71-90": ["Alta", "lightblue"],
  "91-100": ["Muy Alta", "blue"],
};

  function codificarLluvia(valor) {
     for (const rango in rangeMappingsLluvia) {
       const [descripcion, color] = rangeMappingsLluvia[rango];
     const [min, max] = rango.split("-").map(Number);
       if (valor >= min && valor <= max) {
         return [valor, descripcion, color];
       }
     }
   }
   const rangeMappingsHumedad = {
  "0-20": ["Muy Baja", "#2e86c1"],
  "21-40": ["Baja", "#77C2BF"],
  "41-60": ["Moderada", "#44C5C0"],
  "61-80": ["Alta", "lightblue"],
  "81-100": ["Muy Alta", "#448CC5"],
};

function codificarHumedad(valor) {
  for (const rango in rangeMappingsHumedad) {
    const [descripcion, color] = rangeMappingsHumedad[rango];
    const [min, max] = rango.split("-").map(Number);
    if (valor >= min && valor <= max) {
      return [valor, descripcion, color];
    }
  }

 


}
  // setUseraqData(codificarCalidadDelAire(valor));
  //calcular porcentaje para hacer la grafica suponiendo que 300 es lo peor entonces lo divido directamente ene la tabla por osea valor *100/300 seria  1/3

  // Función para obtener la codificación basada en el valor

  return (
    <CardBoxDiv>
      <Card>
        <Titulo>Indice UV</Titulo>
        <Columna>
          <Numero>{useruvData} </Numero>
        </Columna>
        <Progress.Line
          percent={(useruvData * 100) / 11}
          strokeColor={codificarIndiceUV(useruvData)[2]}
          vertical={false}
          showInfo={false}
          strokeWidth={16}
        />
            <Parrafo>{codificarIndiceUV(useruvData)[1]}   </Parrafo>
      </Card>
      <Card>
        <Titulo>Puesta del sol</Titulo>
        <Columna>
          <Numero>{usersriseData} </Numero>
          <Unidad>AM</Unidad>
          <img src={sunrise} alt="Clima" style={{ width: "7vh" }} />
        </Columna>
        <Columna>
          <Numero>{usersrssetData} </Numero>
          <Unidad>PM</Unidad>
          <img src={sunset} alt="Clima" style={{ width: "7vh" }} />
        </Columna>
      </Card>

      <Card>
        <Titulo>VIisibilidad</Titulo>
        <Columna>
          <Numero>{uservData} </Numero>
          <Unidad>km</Unidad>
          </Columna>
          <Parrafo><FaEye style={{ fontSize: '20px' }}/></Parrafo>
          <Parrafo><FaCircle style={{ color: codificarVisibilidad(uservData)[2]}} /> {codificarVisibilidad(uservData)[1]}   </Parrafo>
              
        
      </Card>
      <Card>
        <Titulo>Humedad</Titulo>
        <Columna>
          <Numero>{userhData} </Numero>
          <Unidad>{Data.hourly_units.relativehumidity_2m}</Unidad>
          <Progress.Line
            percent={userhData}
            strokeColor={codificarHumedad(userhData)[2]}
            vertical={true}
            showInfo={false}
            strokeWidth={20}
            style={{ padding: "0px", maxHeight: "18vh" }}
          />
           
        </Columna>
        
           <Parrafo><WiHumidity></WiHumidity>{codificarHumedad(userhData)[1]}   </Parrafo>
      </Card>
      <Card>
        <Titulo>Viento</Titulo>
        <Columna>
          <Numero>{userwvData} </Numero>
          <Unidad>{Data.daily_units.windspeed_10m_max}</Unidad>
        </Columna>
      
        <Parrafo>{userwvDatad} </Parrafo> 
         <Parrafo>
    <FaWind style={{ color: userwvDatac  , fontSize: '20px' }} /> 
  </Parrafo>
      </Card>
      <Card>
        <Titulo>Prob.lluvia</Titulo>
        <Columna>
          <Numero>{usersppData} </Numero>
           <Unidad>{Data.hourly_units.relativehumidity_2m}</Unidad>
          <Progress.Line
            percent={usersppData}
            strokeColor={codificarLluvia(usersppData)[2]}
            vertical={true}
            showInfo={false}
            strokeWidth={16}
            style={{ padding: "0px", maxHeight: "14vh" }}
          />
        </Columna>
        <Parrafo> {codificarLluvia(usersppData)[1]}</Parrafo>
      </Card>
    </CardBoxDiv>
  );
}

export default CardBox;
