"use strict";

const BgImage = require("./BgImage.js");
const Polygon = require("./Polygon.js");
const Point = require("./Point.js");

const helpers = require("./helpers.js");

class CropArea {
  constructor(container, base64) {
    this.container = container;
    this.base64 = base64;

    this.canvas = document.createElement("canvas");
    this.isDrawing = false;
    this.img = "";
  }

  clearCanvas() {
    this.isDrawing = true;

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  create() {
    this.clearCanvas();

    this.container.innerHTML = "";
    this.container.style.backgroundImage = "url(" + this.base64 + ")";
    this.container.appendChild(this.canvas);

    let that = this;
    return helpers.loadImage(this.base64).then(function(img) {
      that.img = new BgImage(img, that.container);
      that.canvas.width = that.img.width;
      that.canvas.height = that.img.height;
      that.canvas.style.left = that.img.left + "px";
      that.canvas.style.top = that.img.top + "px";
      return that.img;
    });
  }

  crop(img, preview, points, config, smoothen) {
    const auxCanvas = document.createElement("canvas");

    auxCanvas.width = this.img.realWidth;
    auxCanvas.height = this.img.realHeight;

    let realPoints = [];
    for (const point of points) {
      realPoints.push(
        new Point(point.x * this.img.ratio, point.y * this.img.ratio)
      );
    }

    const renderer = new Polygon(preview, auxCanvas, smoothen);
    renderer.drawWithOverlay(
      realPoints,
      config.overlayColor,
      config.stroke,
      config.strokeColor,
      config.strokeDashed,
      config.strokeWeight,
      config.fillColor,
      config.showImage ? img : config.showImage
    );

    var base64 = auxCanvas.toDataURL();

    // We will also create the base64 image WITHOUT the "clipped" background, which is
    // frankly far more useful
    let minX = 10000;
    let minY = 10000;
    let maxX = -10000;
    let maxY = -10000;

    for (let i = 1; i < realPoints.length; i++) {
      const p = realPoints[i];
      if (p.x < minX) { minX = p.x; }
      if (p.y < minY) { minY = p.y; }
      if (p.x > maxX) { maxX = p.x; }
      if (p.y > maxY) { maxY = p.y; }
    }

    let clipWidth = maxX - minX;
    let clipHeight = maxY - minY;

    // Cropped canvas
    const croppedCanvas = document.createElement('canvas');
    const cx = croppedCanvas.getContext('2d');

    // Resize the new canvas to the size of the clipping area
    croppedCanvas.width = clipWidth;
    croppedCanvas.height = clipHeight;

    // Draw the clipped image from the main canvas to the new canvas
    cx.drawImage(auxCanvas, minX, minY, clipWidth, clipHeight, 0, 0, clipWidth, clipHeight);

    var crop = new CustomEvent("crop", { detail: { croppedWithBg: base64, croppedWithoutBg: croppedCanvas.toDataURL()} });
    document.dispatchEvent(crop);

    return base64;
  }
}

module.exports = exports = CropArea;
