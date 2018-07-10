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
  this.pattern = this.getBGPattern(this.context);
  this.drawBG();
  this.getPainter();
  var that = this;
  this.drawImg(function () {
    that.painterContext.globalCompositeOperation = 'destination-out';
  
    that.drawRect(that.painterContext, 'rgba(0,0,0,1)', 500, 500, 300, 300);
    that.context.drawImage(that.painterCanvas, 0, 0, that.width, that.height);
  });

}

Clipping.prototype.drawRect = function (context, color, startX, startY, width, height) {
  context.fillStyle = color;
  context.fillRect(startX, startY, width, height);
}

// 绘制栅格化背景
Clipping.prototype.getBGPattern = function (context) {
  var bgItemWidth =10, bgItemHeight = 10;
  var colorGray = '#d6d6d6', colorWihte = '#fff';
  var bgItemCanvas = document.createElement('canvas');
  bgItemCanvas.width = 2 * bgItemWidth;
  bgItemCanvas.height = 2 * bgItemHeight;
  bgItemContext = bgItemCanvas.getContext('2d');

  this.drawRect(bgItemContext, colorGray, 0, 0, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorWihte, bgItemWidth, 0, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorWihte, 0, bgItemHeight, bgItemWidth, bgItemHeight);
  this.drawRect(bgItemContext, colorGray, bgItemWidth, bgItemHeight, bgItemWidth, bgItemHeight);
  return context.createPattern(bgItemCanvas, 'repeat');
}

Clipping.prototype.drawBG = function () {
  this.drawRect(this.context, this.pattern, 0, 0, this.width, this.height)
}

Clipping.prototype.getPainter = function () {
  this.painterCanvas = document.createElement('canvas');
  this.painterCanvas.width = this.width;
  this.painterCanvas.height = this.height;
  this.painterContext = this.painterCanvas.getContext('2d');
}

Clipping.prototype.getImg = function (url, cb) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    cb && cb(img);
  }
}

// TODO: 根据图片大小显示，超大按最大显示
Clipping.prototype.drawImg = function (cb) {
  var that = this;
  this.getImg('./images/IMGP3122.jpg', function (img) {
    that.painterContext.drawImage(img, 0, 0, that.width, that.height);
    cb && cb();
  });
}

var clip = new Clipping();

clip.init();