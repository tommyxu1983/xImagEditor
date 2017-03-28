/**
 * 模块: Rect 继承于 Shape
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Rect module need utils module');}

    var Shape = XIE.Shape;
    if(! Shape) {throw new Error('Rect module need Shape module');}



    var Rect = function(config){
        config = config || {};



        Shape.call(this, config);
    };

    Rect.prototype = {
        constructor: Rect,
        type: 'shape',
        className:'rect',

        //重写父类 Shape drawFunc
        drawFunc: function(xContext){
            var width = this.attr.width || 0,
                height = this.attr.height || 0;
            //不用考虑 起点 (x,y)，  用画布的 transform 来平移起点位置，
            //这里画的都是 绝对起点，（0，0）
            xContext.beginPath();
            xContext.rect(0, 0, width,height);
            xContext.closePath();
            xContext.fillStrokeShape(this);
        }


    };

    utils.inheritProto(Rect, Shape);

    XIE.Rect = Rect;

})(XIE);
