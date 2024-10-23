import { TrophiesRecordsDao } from "@orm/dao/TrophiesRecordsDao";
import { TrophiesRecord } from "@orm/models/TrophyRecord";
import { UserTrophies } from "@orm/models/UserTrophy";
import { userService } from "@services/user";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { type ChartConfiguration } from "chart.js";

export type ChartSizeType = "desktop" | "mobile";

export class TrophiesRecordsService {
  private static instance: TrophiesRecordsService;
  private dao: TrophiesRecordsDao;
  private canvas: Record<ChartSizeType, ChartJSNodeCanvas>;

  private initCanvas() {
    this.canvas = {
      desktop: new ChartJSNodeCanvas({
        width: 1366,
        height: 768,
        backgroundColour: "white",
      }),
      mobile: new ChartJSNodeCanvas({
        width: 360,
        height: 800,
        backgroundColour: "white",
      }),
    };
  }

  private getCanvas(type: ChartSizeType) {
    if (!this.canvas) this.initCanvas();
    return this.canvas[type];
  }

  constructor() {
    this.dao = new TrophiesRecordsDao();
  }
  public static getInstance(): TrophiesRecordsService {
    if (!this.instance) {
      this.instance = new TrophiesRecordsService();
    }
    return this.instance;
  }

  public createRecord(
    playerTag: string,
    trophies: UserTrophies
  ): Promise<TrophiesRecord> {
    return this.dao.createRecord(playerTag, trophies);
  }

  public getRecords(
    playerTag: string,
    limit = 20,
    offset = 0
  ): Promise<TrophiesRecord[]> {
    return this.dao.getRecordsByPlayerTag(playerTag, limit, offset);
  }

  public generateChart(
    records: TrophiesRecord[],
    size: ChartSizeType = "desktop"
  ): Buffer {
    const labels = records.map((record) =>
      record.date.toLocaleDateString("ru", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      })
    );
    const trophiesData = records.map((record) => record.trophies);

    const cfg: ChartConfiguration = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Trophies Over Time",
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

    return this.getCanvas(size).renderToBufferSync(cfg);
  }

  public async createRecordsForEveryLinkedUser() {
    const users = await userService.getAllLinkedUsers();
    const updates: Array<Promise<TrophiesRecord>> = [];
    for (const user of users) {
      updates.push(this.createRecord(user.player_tag!, user.trophies));
    }

    await Promise.all(updates);
  }
}
