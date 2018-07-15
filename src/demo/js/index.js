var Clipping = function () {
  this.base = new Base();
  this.bg = new BG();
}

Clipping.prototype.init = function () {
  this.base.init();
  this.base.drawLayer([this.bg.layer]);
}

var clip = new Clipping();

clip.init();