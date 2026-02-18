import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./weather.css";

function BarChart({ chartData, options }) {
  return (
    <div className="chart-shell">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarChart;
