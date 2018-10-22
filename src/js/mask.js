import Base from './base';

/**
 * 抠图遮罩层
 */

const Mask = function () {
  this.layer = this.createLayer();
  this.ctx = this.layer.context;
}

Mask.prototype = new Base();

Mask.prototype.draw = function (config) {
  if (!config) config = {};
  var imgLayer = config.imgLayer;
  var pathList = config.pathList;
  this.ctx.globalCompositeOperation = 'destination-over'; // 恢复正常层叠状态
  this.ctx.clearRect(0, 0, this.width, this.height);
  this.ctx.drawImage(imgLayer.canvas, 0, 0, this.width, this.height);
  // this.ctx.globalCompositeOperation = 'destination-out'; // 保留选区外
  this.ctx.globalCompositeOperation = 'destination-in'; // 保留选区内
  this.ctx.beginPath();
  this.ctx.moveTo(pathList[0].x, pathList[0].y);
  for (var i = 0, len = pathList.length; i < len - 1; i++) {
    var nextItem = pathList[i + 1];
    this.ctx.lineTo(nextItem.x, nextItem.y);
  }
  this.ctx.closePath();
  this.ctx.fillStyle = 'red';
  this.ctx.fill();
 }

 export default Mask;