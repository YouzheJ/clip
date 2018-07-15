/**
 * 最基础的类
 * 提供绘制的方法、事件的绑定、图层创建等
 */
var Base = (function () {
  // 私有变量
  var layerIdLevelMap = {}; // 记录各图层的id和层级顺序
  var layerIdList = []; // 记录各图层的id列表，用于新增层时判断id是否重复
  var layerLevelIterator = 0; // 当前绘制层的id迭代器
  var eventQueue = {
    // 事件队列对象，key为各种事件
    // 图层的层级大的在前面
    'click': [],
    'dbclick': [],
    'rightclick': [],
    'mouseup': [],
    'mousedown': [],
    'mousemove': [],
    'mouseover': [],
    'mouseout': [],
    'mousewheel': [],
  };

  /**
   * 生成图层id
   */
  function getLayerId () {
    var id = parseInt(Math.random() * Math.pow(10, 10));
    if (!~layerIdList.indexOf(id)) return id;
    return getLayerId();
  }

  /**
   * 执行事件队列
   * @param {string} type 
   */
  function executeQueue (type) {
    return function (e) {
      var queue = eventQueue[type];
      if (!queue || !queue.length) return;
      for (var i = 0, len = queue.length; i < len; i++) {
        //根据每个事件的返回值决定是否要往下执行
        // 返回true停止往下走，即阻止冒泡
        var func = queue[i];
        if (func && func({
          x: e.offsetX,
          y: e.offsetY,
          originEvent: e
        })) return;
      }
    }
  }

  var _Base = function (config) {
    if (!config) config = {};
    var clientWidth = document.body.clientWidth;
    var clientHeight = document.body.clientHeight;
    this.width = config.width || clientWidth;
    this.height = config.height || clientHeight;
    this.id = config.id || 'canvas';
  }
  
  _Base.prototype.init = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.id = this.id;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (!this.canvas.getContext) {
      throw new Error('您的浏览器不支持canvas！');
      // return false;
    }

    this.context = this.canvas.getContext('2d');
  
    // 绘制到真实canvas前，先绘制到虚拟canvas
    this.preDrawLayer = this.createLayer();

    document.body.appendChild(this.canvas);
  }

  /**
   * 清除所有层，重新绘制前要执行
   */
  _Base.prototype.clearLayer = function () {
    this.canvas.clearRect(0, 0, this.width, this.height);
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
  _Base.prototype.drawRect = function (context, color, startX, startY, width, height) {
    context.fillStyle = color;
    context.fillRect(startX, startY, width, height);
  }

  /**
   * 绘制直线
   * @param {context} context 
   * @param {number} startX 
   * @param {number} startY 
   * @param {number} endX 
   * @param {number} endY 
   */
  _Base.prototype.drwaLine = function (context, startX, startY, endX, endY) {
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
  }

  /**
   * 创建图层
   * @param {?number} width 
   * @param {?number} height 
   */
  _Base.prototype.createLayer = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width || this.width;
    canvas.height = height || this.height;
    var context = canvas.getContext('2d');
    var layerId = getLayerId();
    layerIdList.push(layerId);
    return {
      canvas: canvas,
      context: context,
      id: layerId,
    }
  }

  /**
   * 
   * @param {array} layerObjs 创建图层时获得的对象数组
   */
  _Base.prototype.drawLayer = function (layerObjs) {
    if (!layerObjs || !layerObjs.length) return;
    layerLevelIterator = 0;
    for (var i = 0, len = layerObjs.length; i < len; i++) {
      layerItem = layerObjs[i];
      if (!layerItem) continue;
      layerLevelIterator++;
      layerIdLevelMap[layerItem.id] = layerLevelIterator;
      !~layerIdList.indexOf(layerItem.id) && layerIdList.push(layerItem.id);
      this.preDrawLayer.context.drawImage(layerItem.canvas, 0, 0, this.width, this.height);
    }
    this.context.drawImage(this.preDrawLayer.canvas, 0, 0, this.width, this.height);
  }

  // 添加各种鼠标事件
  _Base.prototype.addMouseEvent = function () {
    var element = document.getElementById(this.canvas.id);
    element.onclick = this.click;
    // element.onmousedown = this.mouseDown;
    // element.onmouseup = this.mouseUp;
    // element.onmousemove = this.mouseMove;
  }

  /**
   * 添加事件
   * @param {object} layerObj 
   * @param {string} eventType 
   * @param {function} eventfunc 
   */
  _Base.prototype.addListener = function (layerObj, eventType, eventfunc) {
    var queue = eventQueue[eventType];
    var level = layerObj.level;
    var eventItem = {
      'level': layerObj.level,
      'id': layerObj.id,
      'func': eventfunc
    };
    // 根据level按序插入
    if (!queue.length) {
      queue.push(eventItem);
      return;
    }
    for (var i = 0, len = queue.length; i < len; i++) {
      if (!queue[i] || queue[i].level < level) {
        queue.splice(i, 0, eventItem);
        return;
      }
    }
  }

  /**
   * 
   * @param {*} e 
   */
  _Base.prototype.click = executeQueue('click');

  return _Base;
})();
