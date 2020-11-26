const IdCrop = require("./idcrop/IdCrop.js");
const Point = require("./idcrop/Point.js");

const idcrop = new IdCrop({
  displaySelector: "#display",
  previewSelector: "#preview",
  toolbarSelector: "#toolbar",
  numPoints: Infinity,
  allowUpload: false,
  crop: {
    overlayColor: "black",
    fillColor: "white",
    showImage: false
  },
  points: [
    new Point( 265.453125, 119),
    new Point( 225.453125, 200),
    new Point( 225.453125, 289),
    new Point( 302.453125, 430),
    new Point( 474.453125, 466),
    new Point( 630.453125, 377),
    new Point( 663.453125, 196),
    new Point( 611.453125, 109),
    new Point( 499.453125, 42),
    new Point( 374.453125, 35),
  ]
});

idcrop.init();
