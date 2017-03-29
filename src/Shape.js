/**
 *Shape(容器基础) 模块: circle , rectangular ,所有的形状都继承此模块 将继承此模块
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Shape module need utils module');}

    var Element = XIE.Element;
    if(! Element) {throw new Error('Shape module need Element module');}

    var globalCache = XIE.cache;
    if(! globalCache) {throw new Error('Shape module need instance of Storage module');}


    var Shape = function(config){
        config = config || {};

        this.children = [];

        // set colorKey
        this.colorKey = _getColorKey();
        globalCache.shapes[this.colorKey] = this;

        Element.call(this, config);
    };

    Shape.prototype = {
        constructor: Shape,
        type: 'shape',
        className:'shape',

        drawView:function(xCanvas){
            var xContext =  xCanvas.getXContext();
            xContext.save();
            // this 是Shape子类的实例， xContext.drawShape 里一般调用的是子类的 drawFunc

            xContext.drawShape(this);

            xContext.restore();
            return this;
        },

        drawHit:function(xCanvas){

            var xContext =  xCanvas.getXContext();
            xContext.save();
            xContext.drawShape(this);
            xContext.restore();

            return this;

        },

        draw: function(){
            var parent = this.parent;
            while(parent){
                if(parent instanceof XIE.Layer){
                    parent.draw();
                    return this;
                }else{
                    parent = parent.parent;
                }
            }

            throw new Error('shape needed to add in to a layer before draw');

        },

        //抽象接口，子类强制实现, 一般在 xContext里被调用
        drawFunc: function(){
            throw new Error ('draw Function need to be implement in Shape\'s sub-class' );
        },

        fillEnabled: function(){
           return  utils.isUndefined(this.attr.fill)? false : true;
        },

        strokeEnabled: function(){
            return utils.isUndefined(this.attr.stroke)? false : true;
        },

        getFillStyle: function(){
            return this.attr.fill;
        },

        getStrokeStyle: function(){
            return this.attr.stroke;
        },

        getStage:function(){
            var parent = this.parent;
            while(parent){
                if(parent instanceof XIE.Stage){
                    return parent;
                }else{
                    parent = parent.parent
                }
            }
        },

        // todo: add documentation
        isAtEdge: function(position){
            var layer = this.getLayer();
            if(layer){
             return  layer.isAtEdge(position,this);
            }
            return false;
        },






    }

    utils.inheritProto(Shape, Element);

    XIE.Shape = Shape;

    //private Function start
    function _getColorKey(){
        var key;
        while(true) {
            key = utils.getRandomColor();
            if( key && !(globalCache.shapes.hasOwnProperty(key)) ) {
                break;
            }
        }
        return key;
    }
    //private Function End

}(XIE));
