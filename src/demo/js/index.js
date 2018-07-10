var Clipping = function () {
  var clientWidth = document.body.clientWidth;
  var clientHeight = document.body.clientHeight;
  this.width = clientWidth;
  this.height = clientHeight;

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if (!this.canvas.getContext) {
    alert('您的浏览器不支持canvas！');
    return false;
  }

  this.context = this.canvas.getContext('2d');

  document.body.appendChild(this.canvas);
}

Clipping.prototype.init = function () {
  this.drawBG();
  var layer = this.createLayer();
  this.painterCanvas = layer.canvas;
  this.painterContext = layer.context;
  this.drawImg(this.clearImgByPath.bind(this));
}

/**
 * 绘制矩形
 * @param {context} context canvas的context
 * @param {string} color 颜色值（rgb|hex）
 * @param {number} startX 起点横坐标
 * @param {number} startY 起点纵坐标
 * @param {number} width 宽
 * @param {number} height 高
 */
Clipping.prototype.drawRect = function (context, color, startX, startY, width, height) {
  context.fillStyle = color;
  context.fillRect(startX, startY, width, height);
}

/**
 * 创建图层
 * @param {?number} width 
 * @param {?number} height 
 */
Clipping.prototype.createLayer = function (width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width || this.width;
  canvas.height = height || this.height;
  var context = canvas.getContext('2d');
  return {
    canvas: canvas,
    context: context
  }
}

// 绘制栅格化背景
Clipping.prototype.getBGPattern = function (context) {
  var bgItemWidth = 10, bgItemHeight = 10;
  var colorGray = '#d6d6d6', colorWihte = '#fff';
  var layer = this.createLayer(2 * bgItemWidth, 2 * bgItemHeight);
  var bgItemCanvas = layer.canvas;
  var bgItemContext = layer.context;

  this.drawRect(bgItemContext, colorGray, 0, 0, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorWihte, bgItemWidth, 0, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorWihte, 0, bgItemHeight, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorGray, bgItemWidth, bgItemHeight, bgItemWidth, bgItemHeight);
  return context.createPattern(bgItemCanvas, 'repeat');
}

Clipping.prototype.drawBG = function () {
  this.drawRect(this.context, this.getBGPattern(this.context), 0, 0, this.width, this.height)
}

Clipping.prototype.getImg = function (url, cb) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    cb && cb(img);
  }
  img.onerror = function () {
    alert('获取图片失败，请更换图片');
  }
}

//TODO: 根据图片大小显示，超大按最大显示
Clipping.prototype.drawImg = function (cb) {
  var that = this;
  this.getImg('./images/IMGP3122.jpg', function (img) {
    that.painterContext.drawImage(img, 0, 0, that.width, that.height);
    cb && cb();
  });
}

Clipping.prototype.clearImgByPath = function () {
  this.painterContext.globalCompositeOperation = 'destination-out';

  var layer = this.createLayer();
  this.pathCanvas = layer.canvas;
  this.pathContext = layer.context;
  //TODO: 使用鼠标绘制路径
  this.drawRect(this.pathContext, 'rgba(0,0,0,1)', 500, 500, 300, 300);
  this.painterContext.drawImage(this.pathCanvas, 0, 0, this.width, this.height);

  this.context.drawImage(this.painterCanvas, 0, 0, this.width, this.height);
}

var clip = new Clipping();

clip.init();