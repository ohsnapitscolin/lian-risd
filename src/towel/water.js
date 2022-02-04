import { Graphics } from "pixi.js";
import Towel from "./towel";

import { randColor } from "../utils/chance";

const MARGIN = 0;

export default class Switch extends Towel {

  initialize(app) {
    this.graphics = new Graphics();
    this.app = app;
    
    this.y = MARGIN
    this.x = MARGIN

    
    this.height = 20;

    this.color1 = `0x${randColor()}`;
    this.color2 = `0x${randColor()}`;
    this.color3 = `0x${randColor()}`;

    this.app.stage.addChild(this.graphics);

    // Calculate how many ropes to draw by available height
    this.ropeCount = (1200 - 2 * MARGIN) / this.height;

    this.draw();
  }

  draw() {
    this.interval = this.getRandomInt(20, 30);
    this.rate = this.getRandomInt(1, 3);
    this.direction = 1;


    while (this.y < 1200) {
      const offset = this.getRandomInt(MARGIN, 100) * -1
      this.x = offset;

      while (this.x < 680) {
        this.segment1Width = this.getRandomInt(10, 50);
        this.segment2Width = this.getRandomInt(10, 50);
        this.segment3Width = this.getRandomInt(10, 50);

        this.graphics.beginFill(this.color1);
        this.graphics.drawRect(this.x, this.y, this.segment1Width, this.height);

        this.x += this.segment1Width;

        this.graphics.beginFill(this.color2);
        this.graphics.drawRect(this.x, this.y, this.segment2Width, this.height)

        this.x += this.segment2Width;
    
        // this.graphics.beginFill(this.color3);
        // this.graphics.drawRect(this.x + this.segment1Width + this.segment2Width, this.y, this.segment3Width, this.height)
      }

       // BUNCH
      // if (this.direction) {
      //   this.height += this.rate;
      //   if (this.height >= this.interval) {
      //     this.interval = this.getRandomInt(10, 13)
      //     this.direction = !this.direction;
      //     this.rate = this.getRandomInt(1, 3);
      //   }
      // } else {
      //   this.height -= this.rate;
      //   if (this.height <= this.interval) {
      //     this.interval = this.getRandomInt(13, 20)
      //     this.direction = !this.direction;
      //     this.rate = this.getRandomInt(1, 3);
      //   }
      // }

      this.y +=+ this.height
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
  }
}
