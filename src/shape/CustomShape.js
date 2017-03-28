/**
 * 模块: Rect 继承于 Shape
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Rect module need utils module');}

    var Shape = XIE.Shape;
    if(! Shape) {throw new Error('Rect module need Shape module');}



    var CustomShape = function(config){
        config = config || {};

        this.points = [];

        this.isClosePath=false;

        Shape.call(this, config);
    };

    CustomShape.prototype = {
        constructor:CustomShape,
        type: 'shape',
        className:'customShape',

        //todo: addToDD documentation
        addPoints: function(x,y){
            if(utils.isNumber(x) && utils.isNumber(y)){
                this.points.push({x:x, y:y})
            }
        },
        //todo: addToDD documentation
        removeLastPoint: function(){
            if(this.points.length>0){
                this.points.splice( (this.points.length-1),1 );
                this.isClosePath = false;
            }

        },

        //重写父类 Shape drawFunc
        drawFunc: function(xContext){

            var points = this.points,
                noOfPoints = this.points.length;

            xContext.beginPath();
            if(noOfPoints==1){
                xContext.arc(points[0].x,points[0].y,5,0,2*Math.PI);
                xContext.fill(this.attr.fill || 'black');//画小圆圈
            }else if(noOfPoints>1){
                //第一个点
                xContext.moveTo(points[0].x,points[0].y);
                //第二个 到倒数第二的点
                for(var i=1; i<noOfPoints-1; i++ ){
                    xContext.lineTo(points[i].x,points[i].y);
                }

                //最后一个点
                if(this.isClosePath){
                    xContext.lineTo(points[noOfPoints-1].x,points[noOfPoints-1].y);
                    xContext.closePath();
                    xContext.fillStrokeShape(this);
                }else{
                    xContext.lineTo(points[noOfPoints-1].x,points[noOfPoints-1].y);
                    xContext.fillStrokeShape(this);

                    xContext.save();
                    //画小圆圈
                    xContext.beginPath();
                    xContext.arc(points[noOfPoints-1].x,points[noOfPoints-1].y,5,0,2*Math.PI);
                    xContext.fill(this.attr.fill || 'black');
                    xContext.closePath();
                    //画小圆圈
                    xContext.restore();
                }

            }


        },

        closeMyPath: function(){
            this.isClosePath = true;
        },


        /**
         * 获得多边形的面积
         *  @return {number} area of polygon's area
         */
        getS: function(){
            var points = this.points,
                noOfPoints = this.points.length,
                area =0
            if(noOfPoints <3) return area;
            for(var i=0; i<noOfPoints; i++){
                area += 0.5* ( points[i].x * points[(i+1)%noOfPoints].y - points[i].y * points[(i+1)% noOfPoints].x);
            }
            return area;
        },
        /**
         * 获得多边形的 周长
         *  @return {number} area of polygon's perimeter（ circumference ）
         */
        getC : function(){
            var points = this.points,
                noOfPoints = this.points.length,
                cirF =0
            if(noOfPoints <1) return cirF;
            for(var i=0; i<noOfPoints; i++){

                cirF += Math.sqrt( Math.pow( (points[(i+1)%noOfPoints].x - points[i].x),2 ) + Math.pow( (points[(i+1)%noOfPoints].y - points[i].y),2 )  );
            }
            return cirF;
        },


    };

            utils.inheritProto(CustomShape, Shape);

    XIE.CustomShape = CustomShape;

})(XIE);
