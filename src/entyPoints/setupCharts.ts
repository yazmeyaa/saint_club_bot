import { Chart } from "chart.js";

export function setupCharts(): void {
  Chart.defaults.animation = false;
  Chart.defaults.responsive = false;
}
