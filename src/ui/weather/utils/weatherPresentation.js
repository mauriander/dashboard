import {
  WiDayCloudy,
  WiDayFog,
  WiDayRain,
  WiDayShowers,
  WiDaySleet,
  WiDaySnow,
  WiDaySunny,
  WiDayThunderstorm,
  WiFog,
  WiNightAltCloudy,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltSnow,
  WiNightAltThunderstorm,
  WiNightClear,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

const weatherByCode = {
  0: { label: "Despejado", dayIcon: WiDaySunny, nightIcon: WiNightClear },
  1: { label: "Mayormente despejado", dayIcon: WiDaySunny, nightIcon: WiNightClear },
  2: { label: "Parcialmente nublado", dayIcon: WiDayCloudy, nightIcon: WiNightAltCloudy },
  3: { label: "Nublado", dayIcon: WiDayCloudy, nightIcon: WiNightAltCloudy },
  45: { label: "Niebla", dayIcon: WiDayFog, nightIcon: WiFog },
  48: { label: "Niebla con escarcha", dayIcon: WiDayFog, nightIcon: WiFog },
  51: { label: "Llovizna ligera", dayIcon: WiDayShowers, nightIcon: WiNightAltShowers },
  53: { label: "Llovizna moderada", dayIcon: WiDayShowers, nightIcon: WiNightAltShowers },
  55: { label: "Llovizna intensa", dayIcon: WiDayRain, nightIcon: WiNightAltRain },
  56: { label: "Llovizna helada ligera", dayIcon: WiDaySleet, nightIcon: WiNightAltRain },
  57: { label: "Llovizna helada intensa", dayIcon: WiDaySleet, nightIcon: WiNightAltRain },
  61: { label: "Lluvia ligera", dayIcon: WiDayRain, nightIcon: WiNightAltRain },
  63: { label: "Lluvia moderada", dayIcon: WiRain, nightIcon: WiNightAltRain },
  65: { label: "Lluvia intensa", dayIcon: WiRain, nightIcon: WiNightAltRain },
  66: { label: "Lluvia helada ligera", dayIcon: WiDaySleet, nightIcon: WiNightAltRain },
  67: { label: "Lluvia helada intensa", dayIcon: WiDaySleet, nightIcon: WiNightAltRain },
  71: { label: "Nevada ligera", dayIcon: WiDaySnow, nightIcon: WiNightAltSnow },
  73: { label: "Nevada moderada", dayIcon: WiSnow, nightIcon: WiNightAltSnow },
  75: { label: "Nevada intensa", dayIcon: WiSnow, nightIcon: WiNightAltSnow },
  77: { label: "Aguanieve", dayIcon: WiDaySleet, nightIcon: WiNightAltSnow },
  80: { label: "Chubascos ligeros", dayIcon: WiDayShowers, nightIcon: WiNightAltShowers },
  81: { label: "Chubascos moderados", dayIcon: WiDayRain, nightIcon: WiNightAltRain },
  82: { label: "Chubascos fuertes", dayIcon: WiRain, nightIcon: WiNightAltRain },
  85: { label: "Chubascos de nieve", dayIcon: WiDaySnow, nightIcon: WiNightAltSnow },
  86: { label: "Chubascos de nieve fuertes", dayIcon: WiSnow, nightIcon: WiNightAltSnow },
  95: { label: "Tormenta", dayIcon: WiDayThunderstorm, nightIcon: WiNightAltThunderstorm },
  96: { label: "Tormenta con granizo", dayIcon: WiThunderstorm, nightIcon: WiNightAltThunderstorm },
  99: { label: "Tormenta fuerte con granizo", dayIcon: WiThunderstorm, nightIcon: WiNightAltThunderstorm },
};

export function getWeatherPresentation(weatherCode, isDay = true) {
  const presentation = weatherByCode[weatherCode] || {
    label: "Condición variable",
    dayIcon: WiDayCloudy,
    nightIcon: WiNightAltCloudy,
  };

  return {
    label: presentation.label,
    Icon: isDay ? presentation.dayIcon : presentation.nightIcon,
  };
}
