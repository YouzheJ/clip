import Base from './base';

/**
 * 栅格背景
 */
const BG = function () {
  this.layer = this.createLayer();
  this.draw();
}

BG.prototype = new Base();

// 绘制栅格化背景
BG.prototype.getPattern = function (context) {
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

BG.prototype.draw = function () {
  this.drawRect(this.layer.context, this.getPattern(this.layer.context), 0, 0, this.width, this.height)
}

export default BG;