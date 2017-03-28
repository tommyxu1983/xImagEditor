/**
 * Xcanvas 模块: 用于管理 封装canvas 常用的一些方法
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('XCanvas module need utils module');}

    var XContext = XIE.XContext,
        ViewContext = XIE.ViewContext,
        HitContext = XIE.HitContext;
    if(! (XContext && ViewContext && HitContext)) {throw new Error('XCanvas, ViewCanvas, HitCanvas modules need XContext, ViewContext, HitContext modules');}

    var XCanvas = function(config){
        config = config || {};
        var _width = config.width ||  0,
            _height = config.height || 0;
        // this.$canvas is a actual html element <canvas></canvas>
        this.$canvas = _createCanvasDom(config);
    }

    XCanvas.prototype = {
        constructor: XCanvas,

        /**
         * get/set size
         * @method
         * @memberof XIE.Canvas.prototype
         * @param {Number} width
         * @param {Number} height
         */
        size: function(width, height) {
            var a = arguments;
            if(a.length ===0){
                return {
                    width:this.width(),
                    height: this.height(),
                }
            } else if(a.length===2){
                this.width(width);
                this.height(height);
            }

        },
        //todo 想个机制怎么实现具体的 style，比如 globalAlpha, 在 element 上就设置？ 怎么考虑父子间的关系
        style:function(attr){
            var xContext= this.getXContext();

            if(attr.alpha){
                xContext.globalAlpha(attr.alpha);
            }


        },

        /**
         * get/set width
         * @method
         * @memberof XIE.Canvas.prototype
         * @param {Number} width
         */
        width: function(width) {
            //todo take into account pixel ratio
            if(arguments.length===0){
                return this._width;
            }
            this._width = this.$canvas.width = width;
            this.$canvas.style.width = width + 'px';
        },

        /**
         * get/set height
         * @method
         * @memberof Konva.Canvas.prototype
         * @param {Number} height
         */
        height: function(height) {
            // todo take into account pixel ratio
            if(arguments.length===0){
                return this._height;
            }
            this._height = this.$canvas.height = height;
            this.$canvas.style.height = height + 'px';
        },

        getCanvas:function(){
          return this.$canvas;
        },
        getXContext: function(){
            return this.xContext;
        }



    };


    // ViewCanvas start
    var ViewCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        XCanvas.call(this, conf);
        this.xContext = new ViewContext(this);
        this.size(width, height);
    };
    ViewCanvas.prototype = {
        constructor: ViewCanvas,
    };
    utils.inheritProto(ViewCanvas,XCanvas);
    // ViewCanvas End

    //HitCanvas Start
    var HitCanvas = function(config) {
        var conf = config || {};
        var width = conf.width || 0,
            height = conf.height || 0;

        XCanvas.call(this, conf);
        this.xContext = new HitContext(this);

        this.size(width, height);
        this.isHitCanvas = true;
    };

    HitCanvas.prototype={
        constructor: HitCanvas
    };

    utils.inheritProto(HitCanvas,XCanvas);
    //HitCanvas End

    // private function Start
    function _createCanvasDom(conf){
          //set inline styles
          var canvas = document.createElement('canvas');
          canvas.style.padding = 0;
          canvas.style.margin = 0;
          canvas.style.border = 0;
          canvas.style.background = 'transparent';
          canvas.style.position = 'absolute';
          canvas.style.top = 0;
          canvas.style.left = 0;
          return canvas;
      }
    // private function End


    XIE.XCanvas = XCanvas;
    XIE.ViewCanvas = ViewCanvas;
    XIE.HitCanvas = HitCanvas;

})(XIE);
