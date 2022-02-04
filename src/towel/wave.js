import { Graphics } from "pixi.js";
import Towel from "./towel";

import { randColor } from "../utils/chance";

const MARGIN = 0;

export default class Switch extends Towel {

  initialize(app) {
    this.graphics = new Graphics();
    this.app = app;
    
    this.height = 20;

    this.color1 = `0x${randColor()}`;
    this.color2 = `0x${randColor()}`;
    this.color3 = `0x${randColor()}`;
    this.color4 = `0x${randColor()}`;
    this.color5 = `0x${randColor()}`;

    this.app.stage.addChild(this.graphics);

    this.draw();
  }

  draw() {
    this.y = MARGIN
    this.x = MARGIN

    this.interval = this.getRandomInt(20, 30);
    this.rate = this.getRandomInt(3, 5);
    this.direction = 1;

    this.offsetSize = 25;

    let offset = -1000;
    
    while (this.y < 1200) {
      offset += this.getRandomInt(10, 40);
      this.x = offset;

      while (this.x < 680) {
        this.segmentWidth = 25;

        this.graphics.beginFill(this.color1);
        this.graphics.drawRect(this.x, this.y, this.segmentWidth, this.height);

        this.x += this.segmentWidth;

        this.graphics.beginFill(this.color2);
        this.graphics.drawRect(this.x, this.y, this.segmentWidth, this.height)

        this.x += this.segmentWidth;
    
        this.graphics.beginFill(this.color3);
        this.graphics.drawRect(this.x, this.y, this.segmentWidth, this.height)

        this.x += this.segmentWidth;

        this.graphics.beginFill(this.color4);
        this.graphics.drawRect(this.x, this.y, this.segmentWidth, this.height)

        this.x += this.segmentWidth;

        this.graphics.beginFill(this.color5);
        this.graphics.drawRect(this.x, this.y, this.segmentWidth, this.height)

        this.x += this.segmentWidth;

      }

      this.y += this.height

      //  BUNCH
      if (this.direction) {
        this.height += this.rate;
        if (this.height >= this.interval) {
          this.interval = this.getRandomInt(5, 30)
          this.direction = !this.direction;
          this.rate = this.getRandomInt(3, 5);
        }
      } else {
        this.height -= this.rate;
        if (this.height <= this.interval) {
          this.interval = this.getRandomInt(30, 50)
          this.direction = !this.direction;
          this.rate = this.getRandomInt(3, 5);
        }
      }
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
  }
}
