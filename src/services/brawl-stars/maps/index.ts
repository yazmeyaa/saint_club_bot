import { BrawlifyEvent } from "../api/types/rotation";
import { createCanvas, loadImage } from "canvas";

export class MapsDrawer {
  private readonly settings = {
    gapX: 70,
    gapY: 100,
  } as const;

  private getSizes(): {
    width: number;
    height: number;
  } {
    let width = 2560;
    let height = 1440;

    return { width, height };
  }

  public async drawEvents(events: BrawlifyEvent[]) {
    const images = await Promise.all(
      events.map((item) => loadImage(item.map.imageUrl))
    );

    const { width, height } = this.getSizes();

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const totalHorizontalGap = this.settings.gapX * 4; // Gap on both sides and between elements
    const totalVerticalGap = this.settings.gapY * 2; // Gap on both top and bottom

    let currentPaddingY = this.settings.gapY;

    for (let i = 0; i < images.length; i += 3) {
      const row = images.slice(i, i + 3).filter(Boolean);
      let currentPaddingX = this.settings.gapX;

      for (const [index, image] of row.entries()) {
        const imgWidth = (width - totalHorizontalGap) / 3;
        const imgHeight = (height - totalVerticalGap) / (images.length / 3);

        ctx.drawImage(
          image,
          currentPaddingX,
          currentPaddingY,
          imgWidth,
          imgHeight
        );

        ctx.font = "bold 48px arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.fillText(
          (index + i + 1).toString(),
          currentPaddingX + imgWidth / 2,
          currentPaddingY + 60
        );
        ctx.strokeText(
          (index + i + 1).toString(),
          currentPaddingX + imgWidth / 2,
          currentPaddingY + 60
        );
        currentPaddingX += imgWidth + this.settings.gapX;
      }
      const imgHeight = (height - totalVerticalGap) / (images.length / 3);
      currentPaddingY += imgHeight + this.settings.gapY;
    }

    return canvas.createPNGStream();
  }
}

export const mapsDrawer = new MapsDrawer();
