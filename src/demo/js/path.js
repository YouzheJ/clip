/**
 * 路径层
 */
var Path = function (config) {
  if (!config) config = {};
  this.updateProp = config.update;
  this.closeProp = config.close;
  this.pathList = [];
  this.maxDistance = 14; // 两点间的最大距离，判断是否需要闭合路径
  this.pointRadius = 3; // 点的半径
  this.pointStyle = '#0077e6'; // 点的颜色
  this.lineStyle = '#00ffff'; // 线的颜色
  this.lineWidth = 3; // 路径的宽
  this.layer = this.createLayer();
  this.judgeLayer = this.createLayer();
  this.ctx = this.layer.context;
  this.judgeCtx = this.judgeLayer.context;

  this.isMouseDown = false;
  this.isMovePoint = false;

  this.addEventListener(this.layer, 'click', this.onClick.bind(this));
  this.addEventListener(this.layer, 'mousemove', this.onMousemove.bind(this));
  this.addEventListener(this.layer, 'mousedown', this.onMousedown.bind(this));
  this.addEventListener(this.layer, 'mouseup', this.onMouseup.bind(this));

}

Path.prototype = new Base();

Path.prototype.drawAndUpdate = function () {
  // 清除之前绘制的所有
  this.ctx.clearRect(0, 0, this.width, this.height);

  // 绘制内容
  if (this.draw()) {
    this.closeProp && this.closeProp(this.pathList);
    return true;
  }
  this.updateProp && this.updateProp();
}

// 点击事件
Path.prototype.onClick = function (e) {
  if (this.isMovePoint) return;
  var newItem = {
    x: e.x,
    y: e.y,
    inLine: false,
    inPoint: false,
    isMove: false,
    type: 'line',
  };
  // 判断鼠标是否在线上
  for (var i = 0, len = this.pathList.length; i < len; i++) {
    var item = this.pathList[i];
    if (item.inLine) {
      this.pathList.splice(i + 1, 0, newItem);
      return this.drawAndUpdate();
    }
  }
  this.pathList.push(newItem);
  return this.drawAndUpdate();
}

// 鼠标移入
Path.prototype.onMousemove = function (e) {
  // 按线段进行判断
  for (var i = 0, len = this.pathList.length; i < len; i++) {
    var mousePoint = {x: e.x, y: e.y};
    var item = this.pathList[i];
    item.inLine = false;
    item.inPoint = false;
    !this.isMovePoint && (item.isMove = false);
    var nextItem = this.pathList[i + 1];
    if (nextItem) {
      nextItem.inLine = false;
      nextItem.inPoint = false;
      !this.isMovePoint && (nextItem.isMove = false);
    }
    if (item.isMove || this.isInPoint(mousePoint, item)) {
      item.inPoint = true;
      if (this.isMouseDown) {
        this.isMovePoint = true;
        item.isMove = true;
        item.x = e.x;
        item.y = e.y;
      }
      this.drawAndUpdate();
      return true;
    }
    if (i < this.pathList.length - 1 && this.isInLine(mousePoint, item, nextItem)) {
      item.inLine = true;
      this.drawAndUpdate();
      return true;
    }
  }
  this.drawAndUpdate();
}

Path.prototype.onMousedown = function (e) {
  this.isMouseDown = true;
}

Path.prototype.onMouseup = function (e) {
  this.isMouseDown = false;
  setTimeout(function () {
    // 确保在触发click事件后，再执行
    this.isMovePoint = false;
  }.bind(this), 0);
}

/**
 * 判断点是否在某一段路径上
 * @param {*} mousePoint 
 * @param {*} item 
 * @param {*} nextItem 
 */
Path.prototype.isInLine = function (point, item, nextItem) {
  this.judgeCtx.lineWidth = this.lineWidth;
  this.judgeCtx.beginPath();
  this.judgeCtx.moveTo(item.x, item.y);
  this.judgeCtx.lineTo(nextItem.x, nextItem.y);
  this.judgeCtx.stroke();
  this.judgeCtx.closePath();
  return this.judgeCtx.isPointInStroke(point.x, point.y);
}

/**
 * 判断点是否在点上
 * @param {*} point 
 * @param {*} item 
 */
Path.prototype.isInPoint = function (point, item) {
  this.judgeCtx.beginPath();
  this.judgeCtx.arc(item.x, item.y, this.pointRadius, 0, Math.PI * 2, true);
  this.judgeCtx.closePath();
  this.judgeCtx.fill();
  return this.judgeCtx.isPointInPath(point.x, point.y);
}

Path.prototype.drawPoint = function (x, y, inPoint) {
  var r = (!!inPoint ? 3 : 1.6) * this.pointRadius;
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.fillStyle = this.pointStyle;
  this.ctx.fill();
}

// 将所有点绘制成路径
Path.prototype.drawAllLine = function () {
  var isClose = false;
  this.ctx.strokeStyle = this.lineStyle;
  if (this.pathList.length < 2) return isClose;
  for (var i = 0, len = this.pathList.length; i < len - 1; i++) {
    var item = this.pathList[i];
    var nextItem = this.pathList[i + 1];
    this.ctx.beginPath();
    this.ctx.lineWidth =  (!!item.inLine ? 2 : 1) * this.lineWidth;
    this.ctx.moveTo(item.x, item.y);
    this.ctx.lineTo(nextItem.x, nextItem.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }
  var firstItem = this.pathList[0];
  var lastItem = this.pathList[i];
  if (this.getDistance(firstItem, lastItem) < this.maxDistance) {
    this.ctx.beginPath();
    this.ctx.lineWidth = (!!lastItem.inLine ? 2 : 1) * this.lineWidth;
    this.ctx.moveTo(lastItem.x, lastItem.y);
    this.ctx.lineTo(firstItem.x, firstItem.y);
    this.ctx.closePath();
    this.ctx.stroke();
    isClose = true;
  }
  return isClose;
}

// 绘制路径的所有点
Path.prototype.drawAllPoint = function () {
  this.pathList.map(function (item) {
    this.drawPoint(item.x, item.y, item.inPoint);
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
