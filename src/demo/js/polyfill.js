(function() {
  /**
   * 遍历用的方法
   * @param {array} list 
   * @param {function} func 
   */
  if (!Array.prototype.map) {
    Array.prototype.map = function (list, func) {
      for (var i = 0, len = list.length; i < len; i++) {
        func(list[i], i);
      }
    }
  }
})();