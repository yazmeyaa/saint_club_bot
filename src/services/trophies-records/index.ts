import { TrophiesRecordsDao } from "@orm/dao/TrophiesRecordsDao";
import { TrophiesRecord } from "@orm/models/TrophyRecord";
import { UserTrophies } from "@orm/models/UserTrophy";
import { userService } from "@services/user";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { type ChartConfiguration } from "chart.js";

export type ChartSizeType = "desktop" | "mobile"

export class TrophiesRecordsService {
  private static instance: TrophiesRecordsService;
  private dao: TrophiesRecordsDao;
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
    const width = size === "desktop" ? 1366 : 360;
    const height = size == "desktop" ? 768 : 800;
    const backgroundColour = "white";
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      backgroundColour,
    });

    records.sort((a, b) => b.date.getTime() - a.date.getTime());
    const labels = records.map((record) =>
      record.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    ).reverse();
    const trophiesData = records.map((record) => record.trophies).reverse();

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
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Trophies",
            },
          },
        },
      },
    };

    return chartJSNodeCanvas.renderToBufferSync(cfg);
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
