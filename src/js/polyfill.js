(function() {
  /**
   * 遍历用的方法
   * @param {array} list 
   * @param {function} func 
   */
  if (!Array.prototype.map) {
    Array.prototype.map = function (func) {
      var newList = [], list = this;
      for (var i = 0, len = list.length; i < len; i++) {
        newList.push(func(list[i], i));
      }
      return newList;
    }
  }
})();