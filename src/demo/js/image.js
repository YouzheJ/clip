/**
 * 绘制图片层
 * @param {string} url 
 */
 var Img = function (url) {
   this.url = url;
  this.layer = this.createLayer();
 }

 Img.prototype = new Base();

 Img.prototype.getImg = function (url, cb) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    cb && cb(img);
  }
  img.onerror = function () {
    throw new Error('获取图片失败，请更换图片');
  }
}

//TODO: 根据图片大小显示，超大按最大显示
Img.prototype.draw = function (cb) {
  if (!this.url) return false;
  this.getImg(this.url, function (img) {
    // 等比显示
    var w = img.width, h = img.height;
    var rate = w / h;
    if (w > this.width || h > this.height) {
      if (rate >= this.width / this.height) {
        // 图片的宽较大, 宽100%， 高等比缩放
        h = this.width / rate;
        w = this.width;
      } else {
        // 图片的高较大, 高100%， 宽等比缩放
        w = this.height * rate;
        h = this.height;
      }
    }
    // 居中
    this.layer.context.drawImage(img, (this.width - w) / 2, (this.height - h) / 2, w, h);
    console.log('image is laoded');
    cb && cb();
  }.bind(this));
}