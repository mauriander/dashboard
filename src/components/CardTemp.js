import React from "react";
import styled from "styled-components";

//import  Data  from "../api.json";

const TotalTemp = styled.div`
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  margin:4px;
  padding:8px;
  
    @media (max-width: 480px) {
       margin:32px;
     justify-content: center;
    align-items: center;
      }
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px 0 0 36px;
  box-sizing: border-box;
  text-align: center;
  background-image: linear-gradient(90deg, #f83600 0%, #f9d423 100%);
  font-weight: bold;

`;

const Numero = styled.h1`
line-height: 42px; 
  font-size:20px;
  height: 42px;  
  font-weight: bold;
  color: rgba(22, 22, 22, 0.92);
`;

const RightColumn = styled.div`
    flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border-radius: 0 36px 8px 0;
  text-align: center;
  background-image: linear-gradient(90deg, #f9d423 0%, #30cad7 100%);
  font-weight: bold;
`;

function CardTemp({Data}) {
  //Maximo
 // const maxTemperatura = Math.max(...UserData.map((data) => data.temperatura));
  const maximo = Data.daily.temperature_2m_max[0];
  //Minimo
  //const minTemperatura = Math.min(...UserData.map((data) => data.temperatura));
  const minimo = Data.daily.temperature_2m_min[0];


  return (
    <TotalTemp>
      <LeftColumn>
        Máxima        
        <Numero> {maximo}{Data.daily_units.temperature_2m_max}</Numero>
      </LeftColumn>
      <RightColumn>
        Mínima        
        <Numero>{minimo}{Data.daily_units.temperature_2m_min}</Numero>
      </RightColumn>
    </TotalTemp>
  );
}

export default CardTemp;
