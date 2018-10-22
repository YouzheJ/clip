import Base from './js/base';
import BG from './js/bg';
import Img from './js/image';
import Path from './js/path';
import Mask from './js/mask';

const Clipping = function (config) {
  if (!config) config = {};
  this.url = config.url || '';
  this.base = new Base();
  this.bg = new BG();
  this.img = new Img(this.url);
  this.path = new Path({
    update: function () {
      this.base.drawLayer([this.bg.layer, this.img.layer, this.path.layer])
    }.bind(this),
    close: function (pathList) {
      this.mask.draw({
        imgLayer: this.img.layer,
        pathList: pathList
      });
      this.base.drawLayer([this.bg.layer, this.mask.layer, this.path.layer]);
    }.bind(this)
  });
  this.mask = new Mask();
}

Clipping.prototype.init = function () {
  this.base.init();
  this.img.draw(function () {
    this.base.drawLayer([this.bg.layer, this.img.layer, this.path.layer]);
  }.bind(this));
}

export default Clipping;