/**
 * Created by Administrator on 2016/10/12.
 */
/**
 * XContext 模块: 用于管理 封装 XContext 原生常用的一些方法
 *
 * ViewContext 模块
 *
 * HitContext 模块
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('XContext module need utils module');}


    // XContext start
    var XContext = function(xCanvas){
        this.xCanvas = xCanvas;
        this.$context = xCanvas.$canvas.getContext('2d');
    }


    XContext.prototype = {
        type:'XContext',
        className:'XContext',
        constructor : XContext,

        save: function(){
          this.$context.save();
        },

        beginPath:function(){
            this.$context.beginPath();
        },

        arc: function(){
            var a = arguments;
            this.$context.arc(a[0],a[1],a[2],a[3],a[4],a[5]);
        },
        lineTo: function() {
            var a = arguments;
            this.$context.lineTo(a[0], a[1]);
        },
        moveTo: function() {
            var a = arguments;
            this.$context.moveTo(a[0], a[1]);
        },
        rect: function(){
            var a = arguments;
            this.$context.rect(a[0],a[1],a[2],a[3]);
        },

        globalAlpha: function(value){
            this.$context.globalAlpha = value;
        },

        restore : function(){
            this.$context.restore()
        },

        closePath: function(){
           this.$context.closePath();
        },

        clearRect: function() {
            var a = arguments;
            this.$context.clearRect(a[0], a[1], a[2], a[3]);
        },

        setTransform: function() {
            var a = arguments;
            this.$context.setTransform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },
        transform: function() {
            var a = arguments;
            this.$context.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
        },



        drawShape: function(shape){
            var originM = shape.getAbsoluteOriginM(),
                transformM =shape.getSelfM();

            this.setTransform(originM[0],originM[1],originM[2],originM[3],originM[4],originM[5]);
            this.transform(transformM[0],transformM[1],transformM[2],transformM[3],transformM[4],transformM[5]);

            shape.drawFunc(this);
            this.applyFilter(shape);
            this.setTransform(1,0,0,1,0,0);

        },

        applyFilter:function(shape){

            //todo 有可能造成严重性能问题，做一个 image buffer？ 提高性能
            var imageData;
            if( utils.isArray(shape.filters) ){

                imageData = this.getImageData(0, 0,this.xCanvas.width() , this.xCanvas.height() );

                shape.filters.forEach(function(filter){
                    filter.call(shape,imageData)
                });
                this.putImageData(imageData, 0 , 0);
            }
        },


        getImageData: function() {
            var a = arguments;
            return this.$context.getImageData(a[0], a[1], a[2], a[3]);
        },

        putImageData: function(){
            var a = arguments;
            return this.$context.putImageData(a[0], a[1], a[2]);
        },

        drawImage: function() {
            var a = arguments,
                _context = this.$context;

            if(a.length === 3) {
                _context.drawImage(a[0], a[1], a[2]);
            }
            else if(a.length === 5) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            }
            else if(a.length === 9) {
                _context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        },



        /**
         * clear canvas
         * @method
         * @memberof XIE.Context.prototype
         * @param {Object} [bounds]
         * @param {Number} [bounds.x]
         * @param {Number} [bounds.y]
         * @param {Number} [bounds.width]
         * @param {Number} [bounds.height]
         */
        clear: function(bounds) {
            var xCanvas = this.xCanvas;

            if (bounds) {
                this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
            }
            else {
                //todo: pixel ratio for retain screen?
                //this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
                this.clearRect(0, 0, xCanvas.width(), xCanvas.height());
            }
        },

        /**
         * reset canvas context transform
         * @method
         * @memberof XIE.Context.prototype
         */
        reset: function() {
            //todo pixel ratio for transform
           /* var pixelRatio = this.getCanvas().getPixelRatio();
            this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);*/
            this.setTransform(1, 0, 0, 1, 0, 0);

        },

        /**
         * fill then stroke
         * @method
         * @memberof XIE.Context.prototype
         * @param {XIE.Shape} shape
         */
        fillStrokeShape: function(shape) {
            // shape 为超类， 传递进来的一般是子类的实例
            if(this.xCanvas.isHitCanvas){
               this.fill(shape.colorKey);

            }else{
                if( shape.fillEnabled() ) {
                    var fillStyle =  shape.getFillStyle();
                    this.fill(fillStyle);
                }
                if( shape.strokeEnabled() ) {
                    var strokeStyle= shape.getStrokeStyle();
                    this.stroke(strokeStyle);
                }
            }

        },
        //todo documentation
        fill:function(style){
            this.$context.fillStyle = style;
            this.$context.fill();
        },
        //todo documentation
        stroke: function(style){
            this.$context.strokeStyle = style;
            this.$context.stroke();
        }

    };
    // XContext End



    //ViewContext Start
    var ViewContext = function(canvas) {
        XContext.call(this, canvas);
    };

    ViewContext.prototype={
        constructor : ViewContext,
        className:'viewContext',
    };

    utils.inheritProto(ViewContext,XContext);
    //ViewContext End




    //HitContext start
    var HitContext = function(canvas) {
        className:'hitContext',
        XContext.call(this, canvas);
    };

    HitContext.prototype={
        constructor : HitContext,
    };

    utils.inheritProto(HitContext,XContext);
    //HitContext End



    // private function start
    // private function End


    XIE.XContext = XContext;
    XIE.ViewContext = ViewContext;
    XIE.HitContext = HitContext;

})(XIE);