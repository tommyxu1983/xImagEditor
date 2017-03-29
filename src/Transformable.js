/**
 *
 * Transformable module（模块） is to prepare the matrix for transformation of canvas
 *
 */

(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Transform module need utils module');}

    var matrix= XIE.matrix;
    if(! matrix) {throw new Error('Transform module need matrix module');}

    var Transformable = function(config){

        // this = element;
        this.transform={};
        //m[1]，m[4]: 水平，垂直缩放;  m[2],m[3]: 水平垂直倾斜;  m[5],m[6] 水平，垂直平移;

        _setToInit.call(this,config)
        //  todo: 想想要不要缓存 M


    }

    Transformable.prototype= {

        /**
         * get/set offSet for transform
         * @name offSet
         * @param {Object} scale
         * @param {Number} scale.x
         * @param {Number} scale.y
         * @method
         * @memberof Transformable.prototype
         * @returns {Object}
         * @example
         * // get scale
         * var offSet = element.offSet();
         *
         * // set scale
         * shape.offSet({x:2,y:2});
         */

        offSet:function(){
            var a =  arguments, offsetX= this.transform.offsetX, offsetY = this.transform.offsetY;
            if(a.length===0){
                return {x:offsetX, y:offsetY}
            }
            else if (a.length===1 && utils.isObject(a[0]) && utils.isNumber(a[0].x) && utils.isNumber(a[0].y)){
                this.transform.offsetX = a[0].x;
                this.transform.offsetY = a[0].y;
            }else{
                throw new Error('please pass correct arguments for offSet method');
            }
        },


        /**
         * get/set scale for transform
         * @name scale
         * @param {Object} scale
         * @param {Number} scale.x
         * @param {Number} scale.y
         * @method
         * @memberof Transformable.prototype
         * @returns {Object}
         * @example
         * // get scale
         * var scale = element.scale();
         *
         * // set scale
         * shape.scale({x:2,y:2});  or shape.scale(2);
         */
        scale:function(){
            var a = arguments, scaleX=this.transform.scaleX, scaleY=this.transform.scaleY;

            if(a.length===0){
                return {x:scaleX, y:scaleY}
            }
            else if( a.length===1 && utils.isNumber(a[0]) ){
                this.transform.scaleX = a[0];
                this.transform.scaleY = a[0];
            }else if( a.length===1 && utils.isObject(a[0]) && utils.isNumber(a[0].x) && utils.isNumber(a[0].y) ){
                this.transform.scaleX = a[0].x;
                this.transform.scaleY = a[0].y;
            }else{
                throw new Error('please pass correct arguments for scale method')
            }
            return this;
        },

        /**
         * get/set roate degree for transformation
         * @name rotate
         * @param {Number}
         * @method
         * @memberof Transformable.prototype
         * @returns {Object}
         * @example
         * // get rotate
         * var rotate = element.rotate();
         *
         * // set scale
         * shape.rotate(90);
         */
        rotate: function(){
            var a = arguments, rotate=this.transform.rotate;

            if(a.length===0){
                return rotate;
            }
            else if( a.length===1 && utils.isNumber(a[0]) ){
                this.transform.rotate = a[0];
            }else{
                throw new Error('please pass correct arguments for rotate method')
            }
            return this;
        },


        // transform matrix including ancestor's transform matrix
        getAncestorsM: function(){
            var ancestorsM = [1,0,0,1,0,0],
                parent = this.parent;

            while(parent){
                ancestorsM = matrix.mul(ancestorsM, parent.getSelfM() );
                parent = parent.parent;
            }
            return ancestorsM;
        },

        getAbsoluteOrigin:function(){
            var position = {x:0, y:0}, finalM;

           /* while(parent){
                position.x += parent.attr.x +parent.attr.offsetX+parent.transform.offsetX+ parent.transform.x;
                position.y += parent.attr.y +parent.attr.offsetY +parent.transform.offsetY+parent.transform.y;
                parent = parent.parent;
            }*/
            finalM = matrix.mul(this.getAncestorsM(),this.getSelfM());

            return matrix.transformXY(finalM, position);

        },

 /*       getAbsoluteM: function(){
            var  m = this.getSelfM(),
                ancestorM = this.getAncestorsM();
            m= matrix.mul(m, ancestorM );
            return m;
        },*/

        // self's transform
        getSelfM: function(){

            var finalM;

            /* var shiftM = _getShiftM.call(this),
                rotateM =_getRotationM.call(this),
                scaleM = _getScaleM.call(this);*/
          //  var shiftM = [1,0,0,1,(this.transform.x + this.attr.x +this.transform.offsetX + this.attr.offsetX),(this.transform.y +this.attr.y + this.transform.offsetY +this.attr.offsetY)];

            var radian = (this.transform.rotate + this.attr.rotate)*Math.PI/180,
            rotateM = [Math.cos(radian), Math.sin(radian),-Math.sin(radian),Math.cos(radian),0,0];

           // var scaleM =[( this.transform.scaleX * this.attr.scaleX),0,0,(this.transform.scaleY * this.attr.scaleY),0,0];

            var shiftM_x_scaleM = [( this.transform.scaleX * this.attr.scaleX),0,0,(this.transform.scaleY * this.attr.scaleY),(this.transform.x + this.attr.x +this.transform.offsetX + this.attr.offsetX),(this.transform.y +this.attr.y + this.transform.offsetY +this.attr.offsetY)];


            //console.time('getSelfM');


            finalM = matrix.mul(shiftM_x_scaleM,rotateM);
          //  console.timeEnd('getSelfM');
            return finalM;
        },




        /**
         *
         * @param x: {number} stage's x
         * @param y: {number} stage's y
         */
        translate2LocalXY: function(x, y){
            var originM = this.getAncestorsM(),
                transformM =this.getSelfM(), invertM;
            transformM = matrix.mul(originM, transformM);

            invertM = matrix.invert([],transformM);

            return matrix.transformXY(invertM, {x:x,y:y});
        },

    };


    function _setToInit(){
        // this = element;
        this.transform.x = 0;
        this.transform.y =0;
        this.transform.offsetX=0;
        this.transform.offsetY=0;
        this.transform.scaleX=1;
        this.transform.scaleY=1;
        this.transform.rotate=0;
    }

/*    function _getShiftM(){
        var x = this.transform.x + this.attr.x +this.transform.offsetX + this.attr.offsetX;
        var y =  this.transform.y +this.attr.y + this.transform.offsetY +this.attr.offsetY;
        return [1,0,0,1,x,y];
    }




    function _getRotationM(){

        var cos=Math.cos,
            sin=Math.sin,
            rotation =this.transform.rotate + this.attr.rotate,
            radian = rotation*Math.PI/180;
            return [cos(radian), sin(radian),-sin(radian),cos(radian),0,0];

    }

    function _getScaleM() {
        var x = this.transform.scaleX * this.attr.scaleX,
            y = this.transform.scaleY * this.attr.scaleY;
        return [x,0,0,y,0,0];
    }*/

    //private function End

    XIE.Transformable = Transformable;


})(XIE);