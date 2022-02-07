import { Graphics } from "pixi.js";
import Towel from "./towel";

import { randColor } from "../utils/chance";

const Bunch = true;

const Width = 25;
const Offset = 25;

const GapRange = [0, 15];
const BunchRateRange = [5, 8];
const MinBunchHeightRange = [10, 30];
const MaxBunchHeightRange = [30, 70];

export default class Switch extends Towel {
  initialize(app) {
    this.graphics = new Graphics();
    this.app = app;

    this.height = 30;

    this.colors = [
      `0x${randColor()}`,
      `0x${randColor()}`,
      `0x${randColor()}`,
      `0x${randColor()}`,
      `0x${randColor()}`,
    ];

    this.app.stage.addChild(this.graphics);

    this.gaps = [];
    this.lastGaps = [];

    this.draw();

    for (let i = 0; i < 0; i++) {
      this.drawMoments();
    }
  }

  draw() {
    this.y = 0;
    this.x = 0;

    this.rate = this.getRandomInt(...BunchRateRange);
    this.direction = this.getRandomInt(0, 1);

    this.interval = this.direction
      ? this.getRandomInt(...MaxBunchHeightRange)
      : this.getRandomInt(...MinBunchHeightRange);

    let offset = -1000;
    const Buffer = 100;

    while (this.y < 1200 + Buffer) {
      offset += Offset;
      this.x = offset;

      while (this.x < 680) {
        this.colors.forEach((c) => {
          const index = this.x / Width;

          const useGap = Width === Offset;
          let lastGap = useGap ? this.lastGaps[index] || 0 : 0;

          const { gap } = this.drawRandomRect(
            this.x,
            this.y - lastGap,
            Width,
            this.height + lastGap,
            c,
            useGap
          );

          this.gaps[index] = gap;
          this.x += Width;
        });
      }

      this.lastGaps = this.gaps;
      this.y += this.height;

      if (!Bunch) return;

      //  BUNCH
      if (this.direction) {
        this.height += this.rate;
        if (this.height >= this.interval) {
          this.interval = this.getRandomInt(...MinBunchHeightRange);
          this.direction = !this.direction;
          this.rate = this.getRandomInt(...BunchRateRange);
        }
      } else {
        this.height -= this.rate;
        if (this.height <= this.interval) {
          this.interval = this.getRandomInt(...MaxBunchHeightRange);
          this.direction = !this.direction;
          this.rate = this.getRandomInt(...BunchRateRange);
        }
      }
    }
  }

  drawMoments() {
    const startingX = this.getRandomInt(0, 680);
    const startingY = this.getRandomInt(0, 1200);
    const height = this.getRandomInt(5, 30);

    let column = this.getRandomInt(3, 6);
    let row = this.getRandomInt(3, 6);

    const maxWidth = startingX + column * Width;
    const maxHeight = startingY + row * height;

    let startingColor = 1;
    let color = 1;

    for (let y = startingY; y < maxHeight; y += height) {
      startingColor = !startingColor;
      color = startingColor;
      for (let x = startingX; x < maxWidth; x += Width) {
        this.drawRandomRect(x, y, Width, height, color ? 0x000000 : 0xffffff);
        color = !color;
      }
    }
  }

  drawRandomRect(x, y, width, height, color, useGap) {
    const gap = useGap ? this.getRandomInt(...GapRange) : 0;

    this.graphics.beginFill(color);
    this.graphics.drawRect(x, y, width, height - gap);

    return { gap };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }
}
