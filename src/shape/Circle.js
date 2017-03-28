/**
 * 模块: circle 继承于 Shape
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Circle module need utils module');}

    var Shape = XIE.Shape;
    if(! Shape) {throw new Error('Circle module need Shape module');}

    // the 0.0001 offset fixes a bug in Chrome 27
    var PIx2 = (Math.PI * 2) - 0.0001;

    var Circle = function(config){
        config = config || {};



        Shape.call(this, config);
    };

    Circle.prototype = {
        constructor: Circle,
        type: 'shape',
        className:'circle',

        //重写父类 Shape drawFunc
        drawFunc: function(xContext){
            var radius = this.attr.radius;
            //不用考虑 起点 (x,y)，  用画布的 transform 来平移起点位置，
            //这里画的都是 绝对起点，（0，0）
            xContext.beginPath();
            xContext.arc(0, 0, radius, 0, PIx2);
            xContext.closePath();
            xContext.fillStrokeShape(this);
        }


    };

    utils.inheritProto(Circle, Shape);

    XIE.Circle = Circle;

})(XIE);