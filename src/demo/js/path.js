/**
 * 路径层
 */
var Path = function (config) {
  if (!config) config = {};
  this.pathList = [];
  this.maxDistance = 10; // 两点间的最大距离，判断是否需要闭合路径
  this.layer = this.createLayer();
  this.addListener(this.layer, 'click', function (e) {
    this.pathList.push({
      x: e.x,
      y: e.y
    });
    this.layer.context.clearRect(0, 0, this.width, this.height);
    if (this.draw()) {
      config.close && config.close(this.pathList);
      return true;
    }
    config.update && config.update();
  }.bind(this));
}

Path.prototype = new Base();

Path.prototype.draw = function () {
  var isClose = false;
  this.layer.context.beginPath();
  this.layer.context.strokeStyle = 'red';
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

Path.prototype.getDistance = function (point1, point2) {
  var x = Math.abs(point1.x - point2.x);
  var y = Math.abs(point1.y - point2.y);
  return Math.sqrt(x * x + y * y);
}
