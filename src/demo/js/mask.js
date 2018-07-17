/**
 * 抠图遮罩层
 */

 var Mask = function () {
  this.layer = this.createLayer();
}

Mask.prototype = new Base();

Mask.prototype.draw = function (config) {
  if (!config) config = {};
  var imgLayer = config.imgLayer;
  var pathList = config.pathList;
  
  this.layer.context.drawImage(imgLayer.canvas, 0, 0, this.width, this.height);
  // this.layer.context.globalCompositeOperation = 'destination-out'; // 保留选区外
  this.layer.context.globalCompositeOperation = 'destination-in'; // 保留选区内
  this.layer.context.moveTo(pathList[0].x, pathList[0].y);
  for (var i = 0, len = pathList.length; i < len - 1; i++) {
    var nextItem = pathList[i + 1];
    this.layer.context.lineTo(nextItem.x, nextItem.y);
  }
  this.layer.context.fill();
 }