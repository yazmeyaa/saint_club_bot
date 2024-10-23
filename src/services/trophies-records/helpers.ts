import { ChartConfiguration } from "chart.js";

export function makeCfg(labels: string[], trophiesData: number[]): ChartConfiguration {
  return {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Изменение трофеев",
          data: trophiesData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          yAxisID: "left-y-axis",
        },
        {
          label: "Trophies Mirror",
          data: trophiesData,
          borderColor: "rgba(192, 75, 192, 1)",
          backgroundColor: "rgba(192, 75, 192, 0.2)",
          fill: false,
          yAxisID: "right-y-axis",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            filter(item) {
              return item.text !== "Trophies Mirror";
            },
          },
        },
      },
      scales: {
        "left-y-axis": {
          position: "left",
          title: {
            display: true,
            text: "Trophies",
          },
        },
        "right-y-axis": {
          display: false,
          position: "right",
          title: {
            display: true,
            text: "Trophies",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  };
}
