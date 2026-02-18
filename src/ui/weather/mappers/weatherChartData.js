import { getHourMinute } from "../../../core/utils/dateTime";

export function mapWeatherToBarChartData(weatherData) {
  const hours = weatherData.hourly.time.slice(0, 24).map(getHourMinute);
  const temperatures = weatherData.hourly.temperature_2m.slice(0, 24);

  return {
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          stacked: true,
          grid: {
            display: true,
            color: "rgba(255,99,132,0.2)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
    labels: hours,
    datasets: [
      {
        label: "Temperatura ºC",
        data: temperatures,
        borderRadius: 16,
        color: "white",
        backgroundColor: "rgba(255,255,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,255,132,0.4)",
      },
    ],
  };
}
