/**
 * 路径层
 */
var Path = function (config) {
  if (!config) config = {};
  this.pathList = [];
  this.maxDistance = 14; // 两点间的最大距离，判断是否需要闭合路径
  this.pointRadius = 3; // 点的半径
  this.pointStyle = '#0077e6'; // 点的颜色
  this.lineStyle = '#00ffff'; // 线的颜色
  this.layer = this.createLayer();
  this.addListener(this.layer, 'click', function (e) {
    this.pathList.push({
      x: e.x,
      y: e.y
    });
    // 清除之前绘制的所有
    this.layer.context.clearRect(0, 0, this.width, this.height);

    // 绘制内容
    if (this.draw()) {
      config.close && config.close(this.pathList);
      return true;
    }
    config.update && config.update();
  }.bind(this));
}

Path.prototype = new Base();

Path.prototype.drawPoint = function (x, y) {
  this.layer.context.beginPath();
  this.layer.context.arc(x, y, this.pointRadius, 0, Math.PI * 2, true);
  this.layer.context.closePath();
  this.layer.context.fillStyle = this.pointStyle;
  this.layer.context.fill();
}

// 将所有点绘制成路径
Path.prototype.drawAllLine = function () {
  var isClose = false;
  this.layer.context.beginPath();
  this.layer.context.strokeStyle = this.lineStyle;
  // this.layer.context.lineWidth = 10;
  if (this.pathList.length < 2) return isClose;
  for (var i = 0, len = this.pathList.length; i < len - 1; i++) {
    var item = this.pathList[i];
    var nextItem = this.pathList[i + 1];
    this.layer.context.moveTo(item.x, item.y);
    this.layer.context.lineTo(nextItem.x, nextItem.y);
  }
  var firstItem = this.pathList[0];
  var lastItem = this.pathList[i];
  if (this.getDistance(firstItem, lastItem) < this.maxDistance) {
    this.layer.context.moveTo(lastItem.x, lastItem.y);
    this.layer.context.lineTo(firstItem.x, firstItem.y);
    this.layer.context.closePath();
    isClose = true;
  }
  this.layer.context.stroke();
  return isClose;
}

// 绘制路径的所有点
Path.prototype.drawAllPoint = function () {
  this.pathList.map(function (item) {
    this.drawPoint(item.x, item.y);
  }.bind(this));
}

Path.prototype.draw = function () {
  var isClose = this.drawAllLine();
  this.drawAllPoint();
  return isClose;
}

Path.prototype.getDistance = function (point1, point2) {
  var x = Math.abs(point1.x - point2.x);
  var y = Math.abs(point1.y - point2.y);
  return Math.sqrt(x * x + y * y);
}
