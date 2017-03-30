/**
 XIE eXpress Image Editor framework

 */





(function (global, factory) {
    // CMD, AMD, browser
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.XIE = factory());

})(this, function () {

    var XIE = {};
    XIE.Filters={};



    /**
 * guid module
 */
(function(XIE){


     var idStart = 0;
     function guid(){
         return idStart++;
     }

    XIE.guid= guid;

})(XIE);
/**
*  utils module(模块)
*
*/

(function(XIE,undefined){

   var utils =  XIE.utils = {

        // isXXX 系列
        isDomElement: function(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        isObject: function(obj) {
            return (!!obj && obj.constructor === Object);
        },
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isNumber: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Number]';
        },
        isString: function(obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },
        isUndefined: function(obj) {
            return obj === undefined;
        },



       inheritProto: function(child, parent) {
             var oldChildProto = child.prototype;
             function F() {}
             F.prototype = parent.prototype;

             child.prototype = new F();
             for (var key in oldChildProto) {
                 if (oldChildProto.hasOwnProperty(key)) {
                     child.prototype[key] = oldChildProto[key];
                 }
             }
             child.prototype.constructor = child;
             // create reference to parent
             child.super = parent;
             child.__super__ = parent.prototype;
         },




        extend: function(target, source, overlay) {
            for (var key in source) {
                if (source.hasOwnProperty(key)
                    && (overlay ? source[key] != null : target[key] == null)
                ) {
                    target[key] = source[key];
                }
            }
            return target;
        },


        extendProto:function (target, source, overlay) {
            target = 'prototype' in target ? target.prototype : target;
            source = 'prototype' in source ? source.prototype : source;

            utils.extend(target, source, overlay);
        },


       curry: function(context, fn){
           return function(){
               return fn.apply(context, arguments);
           }
       },

       addGetSet: function(context, propertyName, readOnly){
           var me = context;
           if(me[propertyName]!= undefined && me[propertyName] != null ){
               return function(){
                   if(arguments.length==1 && ! readOnly){
                       me[propertyName] = arguments[0];
                   }else{
                       return me[propertyName]
                   }
               }
           }else{
                throw new Error(me.toString() + 'don\'t have such property' + propertyName );
           }

       },

       debounce:function(fn, delay){
            var timerID;
            return function(){
               var context = this,
                   args = arguments;
                clearTimeout(timerID)
                timerID = setTimeout(function(){
                   fn.apply(context,args);
               },delay)
            }
        },

       throttle: function(fn, threshold ){
           var last ,now, timerID,context,args;

           threshold || (threshold=250);

            return function(){
                context = this;
                args = arguments;
                now = +new Date();
                if(last && now<last+threshold){
                    clearTimeout(timerID);
                    timerID = setTimeout(function(){
                        last =now;
                        fn.apply(context,args);
                    },threshold);

                }else{
                    last = now;
                    fn.apply(context,args);
                }
            }
       },


       /**
        * return random hex color
        * @method
        * @memberof XIE.Util.prototype
        */
       getRandomColor: function() {
           var rand = Math.random();
           var randColor = (rand * 0xFFFFFF << 0).toString(16);
           while (randColor.length < 6) {
               randColor = '0' + randColor;
           }
           return '#' + randColor;
       },

       _rgbToHex: function(r, g, b) {
           return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
       },
       _hexToRgb: function(hex) {
           hex = hex.replace(HASH, EMPTY_STRING);
           var bigint = parseInt(hex, 16);
           return {
               r: (bigint >> 16) & 255,
               g: (bigint >> 8) & 255,
               b: bigint & 255
           };
       },

/*
        /!**
         * Keeps track of the current mouse position, relative to an element.
         * 监视鼠标相对于页面上一个元素体内的位置（ 相当于 width, height 矩形里的位置。原点始于内容开始的左上角），返回x,y
         * @param {HTMLElement} element
         * @return {object} Contains properties: x, y, event
         *
         * todo: how to remove 'mousemove' event after this method has been called, pass a callback fn?
         *!/
        captureMouse : function(element){

            var mouse = {x:0, y:0, event: null},
                html_scrollLeft = document.documentElement.scrollLeft,
                body_scrollLeft = document.body.scrollLeft,
                html_scrollTop = document.documentElement.scrollTop,
                body_scrollTop = document.scrollTop,

                offsetLeft = element.offsetLeft,
                offsetTop = element.offsetTop;

            element.addEventListener('mousemove',mouseMoveHandler, false);


            function mouseMoveHandler(event){
                var x,y;
                //兼容性处理
                if(event.pageX || event.pageY){
                    x = event.pageX;
                    y = event.pageY;
                } else{
                    x = event.clientX + body_scrollLeft + html_scrollLeft;
                    y = event.clientY + body_scrollTop + html_scrollTop;
                }

                x -= offsetLeft;
                y -= offsetTop;

                mouse.x = x;
                mouse.y = y;
                mouse.event = event;
            }
            return mouse;
        },*/

        /**
         * Keeps track of the current mouse position, relative to an element.
         * 监视鼠标相对于页面上一个元素体内的位置（ 相当于 width, height 矩形里的位置。原点始于内容开始的左上角），返回x,y
         * @param {HTMLElement} element
         * @param {event} event
         * @return {object} Contains properties: x, y, event, but if can't find the event then return null;
         *
         */

        captureMouseFromEvt : function(element,event){

            if( ! utils.isDomElement(element) ){ return null; }

            var mouse = {x:0, y:0, event: null},
                html_scrollLeft = document.documentElement.scrollLeft,
                body_scrollLeft = document.body.scrollLeft,
                html_scrollTop = document.documentElement.scrollTop,
                body_scrollTop = document.body.scrollTop;



            //兼容性处理
            if(event.pageX || event.pageY){
                mouse.x = event.pageX;
                mouse.y = event.pageY;
            } else if(event.clientX || event.clientY){
                mouse.x = event.clientX + body_scrollLeft + html_scrollLeft;
                mouse.y = event.clientY + body_scrollTop + html_scrollTop;
            } else{
                /*mouse.x = null;
                 mouse.y = null;*/
                return null;
            }

            mouse.x = mouse.x - element.getBoundingClientRect().left - body_scrollLeft- html_scrollLeft;
            mouse.y = mouse.y - element.getBoundingClientRect().top - body_scrollTop - html_scrollTop;
            /*mouse.event = event;*/
            /*console.log('x: '+mouse.x + 'y: '+ mouse.y);*/
            return mouse;
        },


        /**
         * todo:  implementing x, y coordinates of  mobile device's touch event
         * todo:  捕获移动设备上的 touch  位置
         */
        captureTouch: function(){
        },




    }



})(XIE);


/**
 * 事件 代理 模块
 *
 */

(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('EventProxy need utils module');}

    var EventProxy=function(){
        this._events = {};
    }

    EventProxy.prototype = {

        constructor: EventProxy,

        /**
         * bind event
         * 绑定事件
         * @param {string} evtType 事件名
         *  @param {string} selector 过滤名称
         *  @param {Object} data 绑定数据
         * @param {Function} handler 事件处理函数
         * @param {Object} [context] 事件上下文
         *
         * @example stage.on('click', 'shape', data, onclick, layer);
         */

        on: function(){
            var evtType, selector, data, handler, handleObj, context;

            evtType = arguments[0];

            if(  utils.isFunction(arguments[1])){
                handler = arguments[1];
                context = arguments[2] || this;
            }else if( utils.isString(arguments[1]) && utils.isFunction(arguments[2]) ){
                selector = arguments[1];
                handler = arguments[2];
                context = arguments[3] || this;
            }else if(utils.isString(arguments[1]) && utils.isObject(arguments[2]) && utils.isFunction(arguments[3]) ){
                selector = arguments[1];
                data =  arguments[2];
                handler = arguments[3];
                context = arguments[4] || this;
            }




            var _h = this._events;


            if( !handler || !evtType){
                return this;
            }

            if(!_h[evtType]){
                _h[evtType] = [];
            }

            for(var i = 0, l=_h[evtType].length; i<l ;i++){
                if(_h[evtType][i].h === handler){
                    return this;
                }
            }

            handleObj={
                h: handler,
                one:false,
                ctx: context
            }

            selector && (handleObj.selector = selector);
            data && (handleObj.data = data);

            _h[evtType].push(handleObj);

            return this;
        },

        /**
         *  bind event: only trigger once
         *  绑定事件： 只触发一次，触发后销毁
         *  @param {string} evtType 事件名
         *  @param {Function} handler 事件处理函数
         *  @param {Object} [context] 事件上下文
         */
        one: function(evtType, handler, context){
            var _h = this._events;

            if( !handler || !evtType){
                return this;
            }

            if(!_h[evtType]){
                _h[evtType] = [];
            }

            for(var i = 0, l=_h[evtType].length; i<l ;i++){
                if(_h[evtType][i].h === handler){
                    return this;
                }
            }

            _h[evtType].push({
                h: handler,
                one:true,
                ctx: context || this
            });

            return this;
        },


        /**
         * 是否绑定了事件, true 有绑定， false 没有绑定。
         * @param  {string}  event
         * @return {boolean}
         */
        isListenTo: function(evtType){
            var _h = this._events;
            return _h[evtType] && _h[evtType].length;
        },


        /**
         * 解绑事件
         * @param {string} event 事件名
         * @param {Function} [handler] 事件处理函数
         */
        off: function(evtType, handler){
            var _h = this._events;

            //1. 没有传入 evtType, 直接移除所有事件
            if(!evtType){
                this._events = {};
                return this;
            }
            //2. 如果传入evtType 和 handler ，移除该 evtType里的 handler
            if(handler){
                  if(_h[evtType]){
                      var newHandlerList=[];
                      for (var i= 0, l = _h[evtType].length; i<l; i++){
                          if(_h[evtType][i].h != handler ){
                              newHandlerList.push(_h[evtType][i]);
                          }
                      }
                      _h[evtType] = newHandlerList;
                  }

                 if(_h[evtType] && _h[evtType].length===0){
                     delete _h[evtType];
                 }
            }
            //3. 如果传入 evtType 但没传入 handler, 移除该事件（及事件所有的处理函数）
            else {
                delete _h[evtType];
            }
            return this;
        },



        /**
         * 事件分发
         *
         * @param {string} type 事件类型
         */
        trigger: function(evtType){
            if( this._events[evtType]){
                var args = arguments,
                    argLen = args.length,
                    _h = this._events[evtType],
                    l=_h.length;

                //触发所有在 evenType 里的 handler
                for(var i = 0; i<l; ){

                    switch (argLen){
                        case 1 :
                            _h[i].h.call(_h[i].ctx,_h[i].data);
                            break;
                        case 2 :

                            _h[i].h.call(_h[i].ctx, args[1],_h[i].data);
                            break;
                        case 3 :
                            _h[i].h.call(_h[i].ctx, args[1],args[2],_h[i].data);
                            break;
                        default :
                            if(argLen>3){
                                args = [].slice.call(args, 1);
                                args.push(_h[i].data);
                                _h[i].h.apply(_h[i].ctx, args);
                            }
                            break;
                    }
                    //如果只触发一次，那就从 handler数组中移除
                    if (_h[i]['one']) {
                        _h.splice(i, 1);
                        l--;
                    }
                    else {
                        i++;
                    }

                }
            }
            return this;
        },

    }



    XIE.EvtProxy = EventProxy;



})(XIE);
/**
 * matrix module (模块) matrix calculation
 */


(function(XIE){

    var matrix = {
        /**
         * 创建一个单位矩阵
         * @return {Float32Array|Array.<number>}
         */
        create : function() {
            var out = matrix.identity();

            return out;
        },
        /**
         * 设置矩阵为单位矩阵
         * @param {Float32Array|Array.<number>} out
         */
        identity : function() {
            var out = [];
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        },
        /**
         * 复制矩阵
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} m
         */
        copy: function(m) {
            var out = [];
            out[0] = m[0];
            out[1] = m[1];
            out[2] = m[2];
            out[3] = m[3];
            out[4] = m[4];
            out[5] = m[5];
            return out;
        },
        /**
         * 矩阵相乘
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} m1
         * @param {Float32Array|Array.<number>} m2
         */
        mul : function ( m1, m2) {
            // Consider matrix.mul(m, m2, m);
            // where out is the same as m2.
            // So use temp variable to escape error.
            var out = [];
            var out0 = m1[0] * m2[0] + m1[2] * m2[1];
            var out1 = m1[1] * m2[0] + m1[3] * m2[1];
            var out2 = m1[0] * m2[2] + m1[2] * m2[3];
            var out3 = m1[1] * m2[2] + m1[3] * m2[3];
            var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
            var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
            out[0] = out0;
            out[1] = out1;
            out[2] = out2;
            out[3] = out3;
            out[4] = out4;
            out[5] = out5;
            return out;
        },
        /**
         * 平移变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {Float32Array|Array.<number>} v
         */
        translate : function(out, a, v) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4] + v[0];
            out[5] = a[5] + v[1];
            return out;
        },
        /**
         * 旋转变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {number} rad
         */
        rotate : function(out, a, rad) {
            var aa = a[0];
            var ac = a[2];
            var atx = a[4];
            var ab = a[1];
            var ad = a[3];
            var aty = a[5];
            var st = Math.sin(rad);
            var ct = Math.cos(rad);

            out[0] = aa * ct + ab * st;
            out[1] = -aa * st + ab * ct;
            out[2] = ac * ct + ad * st;
            out[3] = -ac * st + ct * ad;
            out[4] = ct * atx + st * aty;
            out[5] = ct * aty - st * atx;
            return out;
        },
        /**
         * 缩放变换
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         * @param {Float32Array|Array.<number>} v
         */
        scale : function(out, a, v) {
            var vx = v[0];
            var vy = v[1];
            out[0] = a[0] * vx;
            out[1] = a[1] * vy;
            out[2] = a[2] * vx;
            out[3] = a[3] * vy;
            out[4] = a[4] * vx;
            out[5] = a[5] * vy;
            return out;
        },
        /**
         * 求逆矩阵
         * @param {Float32Array|Array.<number>} out
         * @param {Float32Array|Array.<number>} a
         */
        invert : function(out, a) {

            var aa = a[0];
            var ac = a[2];
            var atx = a[4];
            var ab = a[1];
            var ad = a[3];
            var aty = a[5];

            var det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        },

        /**
         * 通过 matrix 求像素点位移变换
         * @param {Float32Array|Array.<number>} a
         * @param {object} p  position = {x:number,y:number}
         *
         */
        transformXY: function(a, p){
            var newP ={};
            newP.x=a[0]* p.x + a[2]* p.y + a[4];
            newP.y=a[1]* p.x + a[3]*p.y +a[5];
                return newP

        },

    };

    XIE.matrix= matrix;


})(XIE);

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
            var ancestorsM = matrix.identity(),
                parent = this.parent;
            while(parent){
                ancestorsM = matrix.mul(ancestorsM, parent.getSelfM() );
                parent = parent.parent;
            }
            return ancestorsM;
        },

        getAbsoluteOriginM: function(){

            return this.getAncestorsM();

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


        // self's transform
        getSelfM: function(){
            var /*scaleM = this.getM(_getScale),
                offsetM = this.getM(_getOffset),
                rotateM = this.getM(_getRotation),
                originM = this.getM(_getOrigin),*/
                finalM = matrix.identity();

            finalM = matrix.mul(finalM,_getOrigin.call(this));
            finalM = matrix.mul(finalM,_getScale.call(this));
            finalM = matrix.mul(finalM,_getRotation.call(this));
            finalM = matrix.mul(finalM,_getOffset.call(this));
            return finalM;
        },



        /**
         *
         * @param x: {number} stage's x
         * @param y: {number} stage's y
         */
        translate2LocalXY: function(x, y){
            var originM = this.getAbsoluteOriginM(),
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

    function _getOrigin(){
        var oX= this.transform.x + this.attr.x,
            oY= this.transform.y +this.attr.y;
        return [1,0,0,1,oX,oY];

    }
    function _getOffset(){
        var oX= this.transform.offsetX + this.attr.offsetX,
            oY= this.transform.offsetY +this.attr.offsetY;
        return [1,0,0,1,oX,oY];
    }
    function _getRotation(){
        var radian = (this.transform.rotate + this.attr.rotate)*Math.PI/180;
        return  [Math.cos(radian), Math.sin(radian),-Math.sin(radian),Math.cos(radian),0,0];

    }

    function _getScale() {
        var oX= this.transform.scaleX * this.attr.scaleX,
            oY= this.transform.scaleY * this.attr.scaleY;
       return [oX,0,0,oY,0,0];
    }

    //private function End

    XIE.Transformable = Transformable;


})(XIE);


/**
 *  Animation 可以被实例化， 也提供了一些实例属性和方法。
 *
 * Animation 的管理类就不重写了
 *
 * */



(function(XIE){


    var now = (function(){
        return function() {
            return new Date().getTime();
        };
    })();
    var window = window || {};
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = now();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    })();

    function Animation (func, layers){
        this.func = func;
        this.layers=null;
        this.setLayers(layers);
        this.id = Animation.animIDCounter++;

        this.frame = {
            time:0,
            timeDiff: 0,
            lastTime: now()
        }

    }

    Animation.prototype ={
        setLayers: function(layers){
            var lays = layers || [];
            this.layers=lays.length>0? lays : [lays];
            return this;

        },

        getLayers: function(){
            return this.layers;
        },

        addLayer: function(layer){
            var layers = this.layers,
                l = layer.length, n;
            for(n=0; n<l; n++){
                if(layers[n].guid = layer.guid){
                    return false;
                }
                this.layers.push(layer);
                return true;
            }
        },

        isRunning: function(){
            var anims = Animation.animations,
                l = anims.length,
                n;

            for(n =0; n<l; n++){
                if(anims[n].id === this.id){
                    return true;
                }
            }
            return false;
        },

        start: function(){
            var Anim = Animation;
            this.stop();
            this.frame.timeDiff =0;
            this.frame.lastTime = 0;
            this.frame.lastTime = now();
            Anim._addAnimation(this);
            return this;
        },

        stop: function(){
            Animation._removeAnimation(this);
            return this;
        },

        _updateFrameObject: function(time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }


    };


    //animation static start: property and method to manage the animation instance.
    Animation.animations = [];
    Animation.animIDCounter = 0;
    Animation.animRunning =false;

    Animation._addAnimation = function(anim){
        //这里 的this 指向 Animation function(){}, 不是实例。
        this.animations.push(anim);
        this._handleAnimation();
    };

    Animation._removeAnimation = function(anim) {
        var id = anim.id,
            animations = this.animations,
            l = animations.length, n;
        for(n =0; n<l; n++){
            if(animations[n].id == id){
                this.animations.splice(n,1);
                break;
            }
        }

    };
    //animation static End






    Animation._runFrames = function() {
        var layerHash = {},
            animations = this.animations,
            anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */

        for(n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;


            anim._updateFrameObject(now());
            layersLen = layers.length;

            // if animation object has a function, execute it
            if (func) {
                // allow anim bypassing drawing
                needRedraw = (func.call(anim, anim.frame) !== false);
            } else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];

                if (layer.guid !== undefined) {
                    layerHash[layer.guid] = layer;
                }
            }
        }

        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].draw();
        }
    };

    Animation._animationLoop = function() {
        var Anim = Animation;
        if(Anim.animations.length) {
            Anim._runFrames();
            requestAnimationFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    };

    Animation._handleAnimation = function() {
        if(!this.animRunning) {
            this.animRunning = true;
            requestAnimationFrame(this._animationLoop);
        }
    };


    XIE.Animation = Animation;


})(XIE);
/**
 *  Drag module(模块)  Drag & drop  Drag & Enlarge
 *
 *
 * */
(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Transform module need utils module');}


    var Animation = XIE.Animation;
    if(!Animation) {throw new Error('Element module need Animation module');}

    var matrix= XIE.matrix;
    if(! matrix) {throw new Error('Transform module need matrix module');}

    var DragDrop='DragDrop';
    var DragEnlarge ='DragEnlarge'

    function Drag(host){
        if(!host){
            throw new Error('please pass in a host(e.g. Stage\'s instance) for drag and drop');
            return;
        }

        /*        this.animation = new Animation();*/
        this.DDObjs = []; // container for Drag & Drop Objects
        this.DEObjs = []; // container for Drag & Enlarge Objects
        this.host = host; // the host here is the stage

        //the profile to record each drag happens
        this.dragProfile={
            isDragging : false,
            draggingObj : null,
            DDorDE: null,  //string 'DragDrop' or 'DragEnlarge'
            oldScale: null,
            origin2DragStart:null
        };
        this.listenToDrag();

    }

    Drag.prototype={
        // add dragDop and dragEnlarge object to stage.drag
        add:function(element){

          if(Drag.isDDEnable(element) && Drag.isDEEnable(element)){
              this.addToDD(element);
              this.addToDE(element);
          }
          else if(Drag.isDDEnable(element)){
              this.addToDD(element);
          }
          else if(Drag.isDEEnable(element)){
              this.addToDE(element);
          }
        },

        addToDD: function(element){
            if( ! this.hasDDObj(element) ){
                this.DDObjs.push(element);
             //   console.log(element.className + ' add to Drag&Drop ');
            }

        },

        addToDE: function(element){
            if( ! this.hasDEObj(element) ){
                this.DEObjs.push(element);
              //  console.log(element.className + ' add to Drag&Enlarge ');
            }
        },

        hasDDObj:function(element){
           for(var i= 0, l=this.DDObjs.length; i<l; i++){
               if(element===this.DDObjs[i]){
                   return true;
               }
           }
            return false;
        },

        hasDEObj: function(element){
            for(var i= 0, l=this.DEObjs.length; i<l; i++){
                if(element===this.DEObjs[i]){
                    return true;
                }
            }
            return false;
        },

        listenToDrag: function(){
            var me = this, host = this.host;
            this.clearListenToDrag();
            host.on('mousedown', _mouseDown4Drag, me);
            host.on('mouseup',_mouseUp4Drag, me);
        },

        clearListenToDrag: function(){

            this.host.off('mousedown',_mouseDown4Drag);
            //todo: addToDD touch events
            /*this.host.off('touchstart',_touchstartDD);*/
            this.host.off('mousemove',_mouseMove4Drag);
            this.host.off('mouseout',_mouseOut4Drag);
            this.host.off('mouseup', _mouseUp4Drag);

        },

        setDDorDE:function(position, element){
            var dProfile = this.dragProfile= this.dragProfile || {};
            if(this.hasDEObj(element) && element.isAtEdge(position)){
                dProfile.DDorDE = DragEnlarge;
            }else if(this.hasDDObj(element)){
                dProfile.DDorDE = DragDrop;
            }
        },



        startDrag: function(evt, target){

            console.log('start Drag');
            var host = this.host,
                dProfile= this.dragProfile= this.dragProfile || {} ,
                dObj=dProfile.draggingObj = target;
                var origin = dObj.getAbsoluteOrigin(),
                dStartXY = dProfile.dragStartXY ={x:evt.x, y:evt.y}; //记住被拖拉 鼠标点下的坐标
            console.log('x: ' +evt.x+ '  y: ' + evt.y );
            dProfile.isDragging=true;
            dProfile.dragingObjOrigin = {x:dObj.transform.x,y:dObj.transform.y};
            dProfile.oldScale = dObj.scale();
            dProfile.origin2DragStart = Math.sqrt( Math.pow((dStartXY.x - origin.x),2) + Math.pow((dStartXY.y - origin.y),2));

            this.setDDorDE(dStartXY, dObj);
            host.on('mousemove',_mouseMove4Drag, this);
            host.on('mouseout',_mouseOut4Drag,this);
            typeof dObj.attr['onDragStart']==='function' && dObj.attr['onDragStart'].call(dObj,evt);
        },

        onDrag: function(evt){
            var position= {x:evt.x,y:evt.y},
                dProfile = this.dragProfile,
                dObj = dProfile.draggingObj,
                DEorDE = dProfile.DDorDE;
            if(dProfile.isDragging && dObj){
                if(DEorDE===DragDrop){
                    this.setDDObjOrigin(dObj, position);
                }else if(DEorDE ===DragEnlarge){
                    this.setDEObjScale(dObj, position);
                }
                typeof dObj.attr.onDragging==='function' && dObj.attr.onDragging.call(dObj,evt);
                dObj.draw();
            }
        },

        endDrag: function(evt){

            var host = this.host;
            var dProfile = this.dragProfile;
            dProfile.isDragging = false;

            typeof dProfile.draggingObj.attr['onDragEnd']==='function' && dProfile.draggingObj.attr['onDragEnd'].call(this,evt);

            delete dProfile.draggingObj;
            delete dProfile.dragStartXY;
            delete dProfile.dragingObjOrigin;
            delete dProfile.DDorDE;
            delete dProfile.origin2DragStart;
            delete dProfile.oldScale;

            host.off('mousemove',_mouseMove4Drag);
            host.off('mouseout',_mouseOut4Drag);
            console.log('end Drag');
        },

        setDDObjOrigin:function(element, mouseXY){
            var dProfile = this.dragProfile, invertM, currentPosition, startPosition;
            if(dProfile.dragStartXY && utils.isNumber(dProfile.dragStartXY.x) &&  utils.isNumber(dProfile.dragStartXY.y) ){

                invertM = matrix.invert([],element.getAncestorsM());

                currentPosition=  matrix.transformXY(invertM, {x:mouseXY.x,y:mouseXY.y});
                startPosition = matrix.transformXY(invertM, {x:dProfile.dragStartXY.x, y:dProfile.dragStartXY.y} )

                element.transform.x = dProfile.dragingObjOrigin.x + (currentPosition.x - startPosition.x);
                element.transform.y = dProfile.dragingObjOrigin.y + (currentPosition.y - startPosition.y);
                /*element.transform.x = dProfile.dragingObjOrigin.x + (mouseXY.x-dProfile.dragStartXY.x);
                element.transform.y = dProfile.dragingObjOrigin.y +(mouseXY.y-dProfile.dragStartXY.y);*/
            }
        },

        setDEObjScale:function(element, mouseXY){
            var origin = element.getAbsoluteOrigin(),
                dProfile = this.dragProfile,
                o2mouseXY = Math.sqrt( Math.pow((mouseXY.x - origin.x),2) + Math.pow((mouseXY.y - origin.y),2)),
                scale;
            console.log('oX: ' +origin.x + ' oY: ' + origin.y);
            if(dProfile.dragStartXY && utils.isNumber(dProfile.dragStartXY.x) &&  utils.isNumber(dProfile.dragStartXY.y) ){
                scale = o2mouseXY/dProfile.origin2DragStart;
                element.scale({x: scale * dProfile.oldScale.x, y: scale * dProfile.oldScale.y });

            }
        },



    };

    Drag.isDragEnable = function(element){
       return (element.attr.draggable  || element.attr.enlargeable )? true: false;
    };

    Drag.isDDEnable = function(element){
        return element.attr.draggable? true : false;
    };

    Drag.isDEEnable = function(element){
        return element.attr.enlargeable? true : false;
    };


    XIE.Drag=Drag;



    //private function start

    function _mouseDown4Drag(evt){
        // this is DD's instance
        if( evt.originalEvent.button===0 ){
            if(   this.hasDDObj(evt.target) || this.hasDEObj(evt.target) ){
                this.startDrag(evt,evt.target);
            }else if( this.hasDDObj(evt.target.parent) || this.hasDEObj(evt.target.parent)){
                this.startDrag(evt, evt.target.parent);
            }
            else{
                return;
            }

        }

    }

    function _mouseUp4Drag(evt){
        //ignore right and middle buttons
        var dProfile = this.dragProfile;
        if(evt.originalEvent.button===1|| evt.originalEvent.button===2){
            return;
        }
        if(dProfile.isDragging){
            this.endDrag(evt);
        }

    }


    function _mouseMove4Drag(evt){
        //todo: throttle!!!!

        this.onDrag(evt)

        /*  me.animation.loop(function(){});*/
    }

    function _mouseOut4Drag(evt){
        this.endDrag(evt);
    }

    //private function end

})(XIE);

/**
 *基础 模块， container, shape, 将继承此模块
 *
 */

(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Element module need utils module');}

    var evtProxy = XIE.EvtProxy;
    if(! evtProxy) {throw new Error('Element module need utils module');}

    var Transformable = XIE.Transformable;
    if(! Transformable) {throw new Error('Element module need Transform module');}

    var guid = XIE.guid;
    if(! evtProxy) {throw new Error('Element module need utils module');}



    function Element(config){
        /*var me= this;*/
        this.guid = (config && config.guid) || guid();
        //以后继承类，会动态加入 index
        this.index;
        this.parent;

        this.attr={
            x:0,
            y:0,
            scaleX:1,
            scaleY:1,
            offsetX:0,
            offsetY:0,
            rotate:0

        };

        this.filters =[];
        this._brightness=0;
        this._contrast =1;


        _setAttributes.call(this,config);
        evtProxy.call(this);
        Transformable.call(this,this.attr);

    }



    Element.prototype={

        /**
         * 元素类型
         * Element type
         * @type {string}
         */
        type: 'element',

        /**
         * 元素名字
         * Element name
         * @type {string}
         */
        className: 'element',

        /**
         * check is this element's ancestor
         * @method
         * @param {object}
         * @memberof XIE.Element.prototype
         * @returns {XIE.Layer} layer
         */
        getLayer: function(){
            //in Layer this method is overwritten, most time this method is invoked by Shape
            var parent = this.parent;
            while(parent){
                if (parent instanceof XIE.Layer){
                    return parent;
                }else{
                    parent= parent.parent;
                }
            }
            //if this == stage, return undefined;
        },

        /**
         * check is this element's ancestor
         * @method
         * @param {object}
         * @memberof XIE.Element.prototype
         * @returns {XIE.Layer} layer
         */
        getStage: function(){
            // stage在最顶端
            var parent = this.parent;
            while(parent){
                if(parent.parent){
                    parent= parent.parent;
                }else{
                    return parent;
                }

            }
        },


        /**
         * check is this element's ancestor
         * @method
         * @param {object}
         * @memberof XIE.Element.prototype
         * @returns {boolean}
         */
        isMyAncestor: function(ancestor){
            var parent = this.parent;
            while(parent){
                if(parent === ancestor){
                    return true;
                }else{
                    parent = parent.parent;
                }

            }

            return false;
        },

        /**
         * check is this element's ancestor
         * @method
         * @param {object}
         * @memberof XIE.Element.prototype
         * @returns {boolean}
         */
        isMyOffSpring: function(child){
         return _isMyOffSpring.call(this,child);
        },


        /**
         * draw both view and hit graphs.  If the Element being drawn is the stage, all of the layers will be cleared and redrawn
         * @method
         * @memberof XIE.Element.prototype
         * @returns {XIE.Element}
         */
        draw: function(){
            throw new Error('Element.prototype.draw  need to be implement in sub class')
        },



        /**
         *  set/get brightness of element.
         * @method
         * @memberof XIE.Element.prototype
         * @returns {number} brightness
         */
        brightness: function(){
            if(arguments.length===0){
                return this._brightness;
            }else if(arguments.length===1){
                this._brightness= arguments[0];
            }

        },

        /**
         *  set/get contrast of element.
         * @method
         * @memberof XIE.Element.prototype
         * @returns {number} contrast
         */
        contrast: function(){
            if(arguments.length===0){
                return this._contrast;
            }else if(arguments.length===1){
                this._contrast= arguments[0];
            }

        },

        /**
         * laod filters into elements.
         * @method
         * @param {Array} array of filter function
         * @memberof XIE.Element
         * @returns {Element}
         * @example addFilters([XIE.Filters.Brighten, XIE.Filters.Blur])
         */

        addFilters:function(arrFilters){
            if(utils.isArray(arrFilters)){
                for(var i = 0, l= arrFilters.length; i<l; i++){
                   /* if(utils.isFunction(arrFilters[i]) && ! this.filters.hasOwnProperty(arrFilters[i].name) ){

                        this.filters[arrFilters[i].name]=utils.curry(this,arrFilters[i]);
                    }*/
                    if( utils.isFunction(arrFilters[i]) ){
                        var hasIt = this.filters.some(function(item){return item === arrFilters[i]; });
                       if(! hasIt){
                           this.filters.push(arrFilters[i]);
                       }

                    }

                }
            }else{
                throw new Error('addFilters expect a array, wrong argument')
            }

            return this.filters;
        },

      /*  getStage:function(){
            throw new Error('abstract method need to be implement be use');
        },
*/
    };

    utils.extendProto(Element,evtProxy);
    utils.extendProto(Element,Transformable);


    //private function Begin
    function _setAttributes(config){
        var propName;
        for (propName in config){
                this.attr[propName] = config[propName];

        }

    }


    function _isMyOffSpring(child){
        var children = this.children;
        if( ! children ) {return false;}

        var findOffSpring = false;
        for(var i= 0, l = children.length; i<l; i++){
            if(! findOffSpring){


                if( children[i] === child){
                  /*  console.log(children[i].name);*/
                    return true;
                }else{
                    if(children[i].children){
                        findOffSpring = _isMyOffSpring.call(children[i],child);
                    }
                }
            }else{
                return true;
            }

        }

        return findOffSpring;
    }


    //private function End



    XIE.Element = Element;


})(XIE);


/**
 *
 *  Storage 模块， globe cache
 *
 */

(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Storage module need utils module');}



    function Storage(){
       /* this.cache = [];*/
        this.stages={};
        this.shapes = {};
    }

    Storage.prototype={
       /* addToDD: function(stage){
            if(this.has(stage.id)){
                return this.cache;
            }
            return this.cache.push(stage);
        },

        remove: function(stage){
           for(var i= 0 ; i<this.cache.length; i++ ){
               if(this.cache[i].id === stage.id){
                   this.cache = this.cache.splice(i,1);
                   return this.cache;
               }
            }

        },

        has: function(stage){
           return this.cache.some(function(item){
                item.id === stage.id;
            });
        }*/

    };




    XIE.cache = new Storage();


})(XIE);

/**
 *Container(容器基础) 模块: layer , stage , 将继承此模块
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Container module need utils module');}

    var Element = XIE.Element;
    if(! Element) {throw new Error('Container module need Element module');}

    // Drag and Drop
    var Drag= XIE.Drag;
    if(!Drag) {throw new Error('Element module need DragDrop(DD) module');}



    var Container = function(config){
        config = config || {};
        this.children = [];

        Element.call(this, config);
    }

    Container.prototype = {
        constructor: Container,
        type: 'container',
        className:'container',
        /**
         * Add Element or Elements to container.
         * @method
         * @memberof XIE.Container.prototype
         * @param {...XIE.Element} child
         * @returns {Container}
         * @example
         * layer.addToDD(shape1, shape2, shape3);
         */
        add : function(child){
            var children;
            if(arguments.length >1 ){

                for(var i = 0, l=arguments.length; i<l; i++){
                    // recursive calls to addToDD child one by one
                    this.add(arguments[i]);
                }

                return this;
            }
            /**
             * Todo: move exits element to this layer

                     if (child.getParent()){
                        child.moveTo(this);
                        return this;
                    }
             */

            // 调用子类的方法（多态）
            validateAdd(this, child);
            children = this.children;
            child.index = children.length;
            child.parent = this;
            children.push(child);

            // attach Drag & drop event to stage
            _addDragEvtToStage.call(this,child);
            return this.children;
            /**
             * Todo: trigger 'addToDD' events
             *  this.trigger('addToDD', {child:child});
             *
            * */



            function validateAdd(subInstance, child){
                if( subInstance && utils.isFunction(subInstance._validateAdd) ){
                   subInstance._validateAdd(child);
                }else{
                    throw new Error('you need to implement <' + subInstance.className + '>\'s _validateAdd for subclass of Container');
                }
            }

        },

        remove : function(child){
            var children = this.children;
            var childrenLen = this.children.length;
            for(var i =0; i<childrenLen; i++){
                if( child === children[i]){
                    this.children.splice(i,1); //第 i 个，向后删除1个
                    child.parent=null;
                }
            }
            return this.children;
        },

        drawView: function(canvas, top, caching){

            var layer = this.getLayer(),
                viewCanvas = canvas || ( layer && canvas.getViewCanvas() );

            //todo: isVisible
            this._drawChildren(viewCanvas, 'drawView');

        },

        drawHit: function(canvas, top, caching){
            var layer = this.getLayer(),
                hitCanvas = canvas || ( layer && canvas.getHitCanvas() );
            this._drawChildren(hitCanvas, 'drawHit');
        },

        _drawChildren: function(xCanvas, drawViewOrHit){
            this.children.forEach(function(child) {
                child[drawViewOrHit](xCanvas);
            });
        },
    };

    utils.inheritProto(Container, Element);

    XIE.Container = Container;

    //private function Start
    function _addDragEvtToStage(child){
        var stage;

        if(this instanceof XIE.Layer){


           /* if(!Drag.isDragEnable(child) && !Drag.isDragEnable(this)){
                return;
            }*/
            //when addToDD element to layer,
            // 1. if this layer is already added into stage, then call stage.DD.addToDD method
            // 2. if this layer is not added into stage, then addToDD an oneOff event to layer,
            // this oneOff event will be triggered after layer has been added into stage.

            if(  this.isAddedToStage() ){
                stage = this.parent;
                _addDraggableToStage(stage, child);
                _addDraggableToStage(stage,this);
            }else{
                this.one('hasDragChildren',_addDragChildren);
            }
        }
        else if( this instanceof XIE.Stage && child.isListenTo('hasDragChildren') ){
            child.trigger('hasDragChildren',this, Drag);
        }


        function _addDragChildren(stage){
            //这里的 this == Layer 实例。因为在 注册的时候（this.one ），上下文指向this.
            // add layer's children to stage
            for(var i= 0, l=this.children.length; i<l; i++){
                _addDraggableToStage(stage, this.children[i]);
            }

            //if layer(this) is draggable then add it to stage.Drag
            _addDraggableToStage(stage, this);
        }

        function _addDraggableToStage(stage, draggableObj){
            if(Drag.isDragEnable(draggableObj)){
                // stage has Drag object(Drag.js)? if not add new one
                stage.Drag = stage.Drag? stage.Drag : new Drag(stage);
                stage.Drag.add(draggableObj);
            }

        }
    }



    //private function End


})(XIE);

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
            var originM = shape.getAbsoluteOriginM();
            var transformM =shape.getSelfM();

            this.setTransform(originM[0],originM[1],originM[2],originM[3],originM[4],originM[5]);

            this.transform(transformM[0],transformM[1],transformM[2],transformM[3],transformM[4],transformM[5]);
            shape.drawFunc(this);
             //this.applyFilter(shape);
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

/**
 *Layer(容器) 模块: 继承于 container
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Layer module need utils module');}

    var Container = XIE.Container;
    if(! Container) {throw new Error('Layer module need Container module');}

    var ViewCanvas = XIE.ViewCanvas,
        HitCanvas = XIE.HitCanvas;
    if(! (ViewCanvas && HitCanvas)) {throw new Error('Layer module need XCanvas module');}


    //local variable Start
    /*
     * 2 - 3 - 4
     * |       |
     * 1 - 0   5
     *         |
     * 8 - 7 - 6
     */
    var INTERSECTION_OFFSETS = [
        {x: 0, y: 0},  // 0
        {x: -1, y: 0}, // 1
        {x: -1, y: -1}, // 2
        {x: 0, y: -1}, // 3
        {x: 1, y: -1}, // 4
        {x: 1, y: 0}, // 5
        {x: 1, y: 1}, // 6
        {x: 0, y: 1}, // 7
        {x: -1, y: 1}  // 8
    ],

    INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length,
    EDGE_OFFSETS = [
        {x: 0, y: 0},  // 0
        {x: -1, y: 0}, // 1
        {x: -1, y: -1}, // 2
        {x: 0, y: -1}, // 3
        {x: 1, y: -1}, // 4
        {x: 1, y: 0}, // 5
        {x: 1, y: 1}, // 6
        {x: 0, y: 1}, // 7
        {x: -1, y: 1}  // 8
    ],
    EDGE_OFFSETS_LEN = EDGE_OFFSETS.length;
    //local variable End


    var Layer = function(config){

        this.viewCanvas = new ViewCanvas(config);
        this.hitCanvas = new HitCanvas(config);
        Container.call(this, config);
    }

    Layer.prototype = {
        type:'container',
        className: 'layer',


        draw:function(){
            this.drawView();
            this.drawHit();
            return this;
        },
        drawView: function(canvas, top){
                var layer = this.getLayer();
                var viewCanvas = canvas || (layer && layer.getViewCanvas() );
              /**
               * TODO : trigger a 'before draw' event?
              * */
              viewCanvas.getXContext().clear();
              Container.prototype.drawView.call(this,viewCanvas, top);
              return this;

        },

        drawHit: function(canvas, top){
            var layer = this.getLayer(),
                hitCanvas = canvas || (layer && layer.getHitCanvas() );


            hitCanvas.getXContext().clear();
            Container.prototype.drawHit.call(this, hitCanvas, top);
            return this;
        },


        getLayer:function(){
            return this;
        },

        getStage:function(){
            return this.parent;
        },

        isAddedToStage: function(){
            return this.parent instanceof XIE.Stage? true : false;
        },


        getViewCanvas: function(){
            return this.viewCanvas;
        },

        getHitCanvas: function(){
            return this.hitCanvas;
        },


        setCanvasSize: function(width, height){
            this.viewCanvas.size(width,height);
            this.hitCanvas.size(width,height);
        },



        setCanvasStyle: function(attr){
            // todo 考虑下这个怎样实现的更优雅
          this.viewCanvas.style(attr);
        },

        /**
         * get visible intersection shape. This is the preferred
         * method for determining if a point intersects a shape or not
         * also you may pass optional selector parametr to return ancestor of intersected shape
         * @method
         * @memberof XIE.Layer.prototype
         * @param {Object} position
         * @param {Number} position.x
         * @param {Number} position.y
         * @param {String} [selector]
         * @returns {XIE.element}
         * @example
         * var shape = layer.getIntersection({x: 50, y: 50});
         * // or if you interested in shape parent:
         * var group = layer.getIntersection({x: 50, y: 50}, 'Group');
         */

        getIntersection: function(position, selector){
            // todo: add if layer is invisible,  selectpr

            var obj, i, intersectionOffset, shape,
            spiralSearchDistance = 1, continueSearch = false;

            while (true) {
                for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                    intersectionOffset = INTERSECTION_OFFSETS[i];
                    obj = _getIntersection.call(this,{
                        x: position.x + intersectionOffset.x * spiralSearchDistance,
                        y: position.y + intersectionOffset.y * spiralSearchDistance
                    });
                    shape = obj.shape;
                    if(shape){
                        return shape;
                    }
                    // we should continue search if we found antialiased pixel
                    // that means our node somewhere very close
                    continueSearch = !!obj.antialiased;
                    // stop search if found empty pixel
                    if (!obj.antialiased) {
                        break;
                    }
                }
                // if no shape, and no antialiased pixel, we should end searching
                if (continueSearch) {
                    spiralSearchDistance += 1;
                } else {
                    return null;
                }
            }
        },

        isAtEdge:function(position, element){
            var i,obj,edgeSearchOffSet,
                spiralSearchDistance=3,
                colorKey = element.colorKey,
                sameColorKeyFlag=false,
                differentColorKeyFlag=false;


                for(i=0; i<EDGE_OFFSETS_LEN; i++){
                    edgeSearchOffSet = EDGE_OFFSETS[i];
                    obj = _getIntersection.call(this,{
                        x: position.x + edgeSearchOffSet.x * spiralSearchDistance,
                        y: position.y + edgeSearchOffSet.y * spiralSearchDistance
                    });

                    if(obj.shape){
                        if(!sameColorKeyFlag && obj.shape.colorKey === colorKey){
                            sameColorKeyFlag = true;
                           // console.log('Edge: same');
                        }
                        if(obj.shape.colorKey != colorKey){
                            differentColorKeyFlag = true;
                          //  console.log('Edge: other');
                        }
                    }else if(obj.antialiased){
                        differentColorKeyFlag = true;
                     //   console.log('Edge: antialiased');
                    }
                    else{
                        differentColorKeyFlag = true;
                    //    console.log('Edge: 00');
                    }

                    if(sameColorKeyFlag && differentColorKeyFlag){
                        return true;
                    }
                }

            return false;

        },



        _validateAdd: function(child) {
            var type = child.type;
            if (/*type !== 'Group' &&*/ type !== 'shape') {
                throw new Error('you may only add Shapes to a layer');
            }
        },


    };

    utils.inheritProto(Layer, Container);

    XIE.Layer = Layer;

    //private function Start
    function _getIntersection (position){
        var layer = this,
            ratio = layer.hitCanvas.pixelRatio|| 1,
            x = Math.round(position.x * ratio),
            y = Math.round(position.y * ratio),
            context_hitCanvas = layer.hitCanvas.xContext.$context,
            singlePixel, p3, colorKey, shape;

        //layer.parent.$content.appendChild(layer.hitCanvas.$canvas);
        singlePixel = context_hitCanvas.getImageData(x,y, 1,1).data;
        p3 = singlePixel[3];
        // fully opaque pixel
        if(p3 === 255) {
            colorKey = utils._rgbToHex(singlePixel[0], singlePixel[1], singlePixel[2]);
            shape = XIE.cache.shapes['#' + colorKey];
            if (shape) {
                return {
                    shape: shape
                };
            }
            return {
                antialiased: true
            };
        }
        else if(p3 > 0) { // antialiased pixel
            return {
                antialiased: true
            };
        }
        // empty pixel
        return {};
    }



    //private function End



})(XIE);

/**
 *Stage (容器) 模块: 继承于 container
 *
 */


(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Stage module need utils module');}

    var globalCache = XIE.cache;
    if(! (globalCache) ){throw new Error('Stage module need to be initialised after Storage has been initialised');}

    var Container = XIE.Container;
    if(! Container) {throw new Error('Stage module need Container module');}



    var EVENTS = ['click','mousedown',  'mouseup','mouseover','mousemove',  'mouseout', 'touchstart', 'touchmove', 'touchend', 'DOMMouseScroll', 'mousewheel', 'wheel'];

    var stageDefault = {
        width: 0,
        height: 0
    };

    var Stage = function(config){
        var settings = utils.extend(stageDefault, config, true);

        this.$wrapper; // 在祖类Element中被赋值
        this.$content; // 在Stage _initStage中被赋值
        Container.call(this,settings); // supper class most attributes are assigned in Container
        _initStage.call(this,settings); // set the attributes to wrapper Div and content Div, attach content Div to wrapper Div
        _bindEventToStage.call(this, EVENTS); //map content DIV's event(browser's event) to canvas's event
        globalCache.stages[this.guid]= this; // store this stage instance to globe cache

    };

    Stage.prototype = {

        constructor: Stage,

        type:'container',
        className: 'stage',

        /**
         * addToDD layer or layers to stage
         * @method
         * @memberof XIE.Stage.prototype
         * @param {...XIE.Layer} layer
         * @example
         * stage.addToDD(layer1, layer2, layer3);
         */

        add:function(layer){
            var contentDiv;
            if(arguments.length > 1){
                for(var i = 0; i <arguments.length; i++){
                    //invoke element.add
                    this.add.call(this,arguments[i]);
                }
                return this.children;
            }

            Container.prototype.add.call(this,layer);

            layer.setCanvasSize(this.attr.width,this.attr.height);
            layer.setCanvasStyle(layer.attr);
            /*layer.draw();*/
            contentDiv = this.getContentDiv();
            contentDiv.appendChild(layer.viewCanvas.$canvas);

            return this.children;

        },


        /**
         * set stage's size,  and also set layer(canvas) size
         * @method
         * @memberof XIE.Stage.prototype
         * @param {number} width,  {number} height
         * @return Stage's instance
         */

        setSize: function(width,height){
            var contentDiv =  this.getContentDiv(),
                children = this.children;
            utils.isNumber(width) && (this.attr.width = width);
            utils.isNumber(height) && (this.attr.height = height);

            for(var i=0, l = children.length; i<l; i++){
                if(children[i] instanceof XIE.Layer){
                    children[i].setCanvasSize(this.attr.width,this.attr.height);
                };
            }

            contentDiv.style.width = this.attr.width.toString() + 'px';
            contentDiv.style.height = this.attr.height.toString() + 'px';
        },

        /**
         * draw stage's children
         * @method
         * @memberof XIE.Stage.prototype

         * @return Stage's instance
         */

        draw: function(){
            var children = this.children;

            //todo 考虑一下 z-index
            for(var i=0, l = children.length; i<l; i++){
                children[i].draw();
            }
            return this;
        },

        /**
         * get stage's wrapper
         * @method
         * @memberof XIE.Stage.prototype
         * @param {...XIE.Layer} layer
         * @return html div element wrappers canvas(these canvas holds in layers)
         */

        getWrapper: function(){
              if(utils.isDomElement(this.$wrapper)){
                    return this.$wrapper;
              }else{
                  throw new Error('can\'t find wrapper\'s id or wrapper is not a dom element');
              }

        },

        /**
         * get stage's content's Wrapper
         * @method
         * @memberof XIE.Stage.prototype
         * @param {...XIE.Layer} layer
         * @return html div element wrappers canvas(these canvas holds in layers)
         */
        getContentDiv : function(){
            if(utils.isDomElement(this.$content)){
                return this.$content;
            }else{
                throw new Error('can\'t find wrapper\'s id or wrapper is not a dom element');
            }
        },

        /**
         * get visible intersection shape. This is the preferred
         *  method for determining if a point intersects a shape or not
         * @method
         * @memberof XIE.Stage.prototype
         * @param {Object} pos
         * @param {Number} pos.x
         * @param {Number} pos.y
         * @param {String} [selector]
         * @returns {XIE.Element}
         * @example
         * var shape = stage.getIntersection({x: 50, y: 50});
         * // or if you interested in shape parent:
         * var layer = stage.getIntersection({x: 50, y: 50}, 'layer');
         *
         * todo:  implement selector later
         */
        getIntersection: function(position, selector){
            var layers = this.children,
                length = layers.length,
                end = length - 1,
                n, shape;

            for(n = end; n>=0; n--){
                shape = layers[n].getIntersection(position, selector);
                if(shape){
                    return shape;
                }
            }

            return null;

        },

        /**
         * @method
         * @memberof XIE.Stage.prototype
         * @return {XIE.Stage} stage
        */
        getStage: function(){
          return this;
        },

        //被父类 Container.prototype.addToDD 里调用
        _validateAdd: function(child) {
            if ( child.className !== 'layer' ) {
                throw new Error('you may only add layer to a stage');
            }
        },


    };

    utils.inheritProto(Stage, Container);

    XIE.Stage = Stage;




    // private function
        // set the Stage this.wrapper = div(dom);
    function _initStage(config){
        var wrapper, contentDiv;

      /*  if(this.className==='stage' && propName === 'wrapper' ){
            this['$wrapper'] = config[propName];
        }*/


        if(this.attr.wrapper){
            wrapper = utils.isString(this.attr.wrapper) ? document.getElementById(this.attr.wrapper) : this.attr.wrapper;

            if(utils.isDomElement(wrapper)){
                contentDiv = document.createElement('div');
                contentDiv.setAttribute('class','XIE-content');
                contentDiv.setAttribute('role','presentation');
                contentDiv.style.position = 'relative';
                contentDiv.style.padding = 0;
                contentDiv.style.margin = 0;
                contentDiv.style.border = 0;
                contentDiv.style.backgroundColor= this.attr.backgroundColor || 'antiquewhite';
                contentDiv.style.width = this.attr.width.toString() + 'px';
                contentDiv.style.height = this.attr.height.toString() + 'px';
                wrapper.appendChild(contentDiv);

                this.$wrapper = wrapper;
                this.$content = contentDiv;

            }else{
                throw new Error('can\'t find wrapper\'s id or wrapper is not a dom element');
            }

        }else{
            throw new Error('you need to addToDD a wrapper for Stage\'s configuration');
        }
    }


    function _bindEventToStage(events){
        var context =this;
        var contentDiv = context.getContentDiv();
        for(var i = 0, l = events.length; i<l; i++){
            var eventName = events[i];
            mapEvent(contentDiv,eventName);
        }

        function mapEvent(contentDiv,eventType){
            contentDiv.addEventListener(eventType, function(event){
                //当游览器事件被触发时，检查 事件代理，有没有代理该事件。


                _fireAndBubble.call(context,eventType, contentDiv, event);

               /*if( context.isListenTo(eventType) ){
                    context['_'+eventType](contentDiv,event);
                }*/
            });
        }

        function _fireAndBubble(evtType, domElement, domEvent){
            var mouseXY = utils.captureMouseFromEvt(domElement,domEvent);
            var target = this.getIntersection({x:mouseXY.x, y:mouseXY.y}) || this;
            var currentTarget = target;
            var isBubbling =true;
            var eventPkg;


            //从被底部
            while( currentTarget ){

                if( currentTarget.isListenTo(evtType) && isBubbling ){

                    //console.log(evtType +': '+  currentTarget.className +  ' ' + !!currentTarget.isListenTo(evtType));
                    eventPkg = _buildEventPkg(evtType,target,currentTarget,mouseXY,domEvent);
                    _fireEvents(eventPkg);
                    //检查该元素有没有，取消冒泡,下一个while 就取消。
                    isBubbling = eventPkg.cancelBubble===false ? false : true;
                }
                currentTarget = currentTarget.parent;
            }

        }

    }

    //内部触发（与 trigger 类似。 但是，会检查有没有 选择器。）
    //比如在父类绑定 事件，来统一调度过滤哪些些子元素应该被触发。
    function _fireEvents(evtPKG){
        var target = evtPKG.target,
            currentTarget = evtPKG.currentTarget,
            evtType = evtPKG.type,
            selector,selectElement;


        if( currentTarget._events[evtType]){
            var _h = currentTarget._events[evtType],
                l=_h.length;

            //触发所有在 evenType 里的 handler
            for(var i = 0; i<l; ){
                selector =  _h[i].selector;
                selector && ( selectElement = getSelectElement(target,selector) );

                if( ! selector || (selectElement && currentTarget.isMyOffSpring(selectElement)) ){
                     _h[i].data && (evtPKG.data =_h[i].data);
                    selectElement && (evtPKG.selectTarget =selectElement);
                    _h[i].h.call(_h[i].ctx,evtPKG);
                    //如果只触发一次，那就从 handler数组中移除
                    if (_h[i]['one']) {
                        _h.splice(i, 1);
                        l--;
                    }
                    else {
                        i++;
                    }
                }else{
                    i++;
                }
            }
        }
        return this;

        function getSelectElement(target, selector){
            var parent = target;
            while(parent){
                if(parent instanceof XIE[selector]){
                    return parent;
                }else{
                    parent= parent.parent;
                }

            }
        }

    }

    function _buildEventPkg(eventType,target,currentTarget,mouseXY,domEvent){
        var eventPkg ={};
        eventPkg.x=mouseXY.x;
        eventPkg.y =mouseXY.y;
        eventPkg.type = eventType;
        eventPkg.currentTarget = currentTarget;
        eventPkg.target = target;
        eventPkg.originalEvent = domEvent;
        return eventPkg;
    }


    // private function End
})(XIE);

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

/**
 * 模块: XImage 继承于 Shape
 *
 */
(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Image module need utils module');}

    var Shape = XIE.Shape;
    if(! Shape) {throw new Error('Image module need Shape module');}



    var Image = function(config){
        var conf = config || {};
        Shape.call(this, conf);
    };

    Image.prototype = {
      constructor: Image,
        type: 'shape',
        className:'image',

        //重写父类 Shape drawFunc
        drawFunc: function(xContext){
            // todo: 直接提取 高宽，很不安全。
            var width = this.attr.width,
                height = this.attr.height,
                image = this.getImage(),
                cropWidth, cropHeight, params;

            if (image) {
                //todo: set cropImage
                /*cropWidth = this.getCropWidth();
                cropHeight = this.getCropHeight();
                if (cropWidth && cropHeight) {
                    params = [image, this.getCropX(), this.getCropY(), cropWidth, cropHeight, 0, 0, width, height];
                } else {
                    params = [image, 0, 0, width, height];
                }*/

                params = [image, 0, 0, width, height];
            }

            if(image){
                if(xContext.xCanvas.isHitCanvas){
                    xContext.beginPath();
                    xContext.rect(0, 0, width,height);
                    xContext.closePath();
                }else{
                    xContext.drawImage.apply(xContext,params);
                    this.cacheImg();
                }

                xContext.fillStrokeShape(this);
            }

        },

        cacheImg:function(){
            var width = this.attr.width,
                height = this.attr.height,
                image = this.getImage(),
                params;

            if(width && height && image){
                var viewCanvas = new XIE.ViewCanvas({width:width,height:height}),
                    rawCanvas = new XIE.ViewCanvas({width:width,height:height}),
                    rawContext =  rawCanvas.getXContext();

                params = [image,0,0,width, height];
                rawContext.drawImage.apply(rawContext,params);

                this._cachedImg={};
                this._cachedImg.viewCanvas =  viewCanvas;
                this._cachedImg.rawCanvas = rawCanvas;
                this._cachedImg.width=width;
                this._cachedImg.height=height;
                this._cachedImg.rawImgData = rawContext.getImageData(0,0,width,height);
            }else{
                throw new Error('you need to set image\'s attr includes width, height and image');
            }
        },



        getCachedImgData: function(){
           return this._cachedImg.rawImgData;
        },



        getImage: function(){
          if( this.attr.image instanceof window.Image){
               return this.attr.image;
            }else{
              throw new Error('invalid image object, dom image is required');
            }
        },
    };

    utils.inheritProto(Image,Shape);
    XIE.Image = Image;


})(XIE);

/**
 * 模块: Image16bit 继承于 Image
 *
 */
(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Image16bit module need utils module');}

    var Image = XIE.Image;
    if(! Image) {throw new Error('Image16bit module need Image module');}

    var Image16bit = function(config){
        var conf = config || {};
        Image.call(this, conf);
        this.cacheImg();
        this.initCachedImg();

/*        this.attr.winWidth= conf.winWidth || 50;
        this.attr.winHeight=conf.winHeight || 50;*/

    };

    Image16bit.prototype = {
        constructor: Image,
        type: 'shape',
        className:'Image16bit',

        initCachedImg: function(){
            var imgDataCached,imgData8bit;
            if(this._cachedImg){
                imgDataCached = this.getCachedImgData();
                this._cachedImg.viewCanvas.xContext.clearRect(0,0,this._cachedImg.width,this._cachedImg.height);
                imgData8bit = this.convert16To8(imgDataCached);
                this._cachedImg.viewCanvas.xContext.putImageData(imgData8bit,0,0);

            }else{
                throw new Error('16 bit grey image need cached image');
            }
        },

        convert16To8: function(imageData){
            var data = imageData.data,
                len = data.length,
                i, r, b, g, v,max=0,min=256*256-1;
            console.time('16 to 8 start');
            for(i = 0; i<len; i+=4){
                // red stores Higher bit
                r =data[i];
                // green stores Lower bit
                g=data[i + 1] ;
                // blue stores zero
                b = data[i + 2] ;

                v= r* 0xFF + g;

                max= max>v ? max:v;
                min= min<v ? min:v;
            }

            for(i = 0; i<len; i+=4){
                // red stores Higher Bit
                r =data[i];
                // green stores Lower bit
                g=data[i + 1] ;
                // blue stores always zero
                b = data[i + 2] ;

                v= r* 0xFF + g;

                data[i]=data[i+1]=data[i+2]=(v-min)/max*255;
            }

            return imageData;
        },

        wWwp: function(localX,localY,width,height){
            var x, w, y, h,imageData16bit, imageData8bit, newViewCanvas, newViewContext,
                cachedHeight = this._cachedImg.height,
                cachedWidth = this._cachedImg.width;

            if( (localX-width/2)>=0 && width <= (cachedWidth-localX) ){
                x=localX-width/2;
                w = width;
            }else if( (localX-width/2)<0) {
                x=0;
                w= localX + width/2;
            }else if( width > (cachedWidth-localX)){
                x=localX;
                w= cachedWidth-localX;
            }


            if( (localY-height/2)>=0 && height <= (cachedHeight-localY) ){
                y=localY-height/2;
                h = height;
            }else if( (localY-height/2)<0) {
                y=0;
                h= localY + height/2;
            }else if( height > (cachedHeight-localY)){
                y=localY;
                h= cachedHeight-localY;
            }


            imageData16bit =this._cachedImg.rawCanvas.xContext.getImageData(x,y,w,h);
            imageData8bit = this.convert16To8(imageData16bit);

            newViewCanvas = new XIE.ViewCanvas({width:w,height:h});
            newViewContext = newViewCanvas.xContext.putImageData(imageData8bit,0,0);

            return newViewCanvas;
        },






        //重写父类 Shape drawFunc
        drawFunc: function(xContext){
            // todo: 直接提取 高宽，很不安全。
            var width = this.attr.width,
                height = this.attr.height,
                image = this._cachedImg.viewCanvas.$canvas,
                cropWidth, cropHeight, params;



            if(image){
                if(xContext.xCanvas.isHitCanvas){
                    xContext.beginPath();
                    xContext.rect(0, 0, width,height);
                    xContext.closePath();
                }else{
                        params = [image,0,0,width, height];
                        xContext.drawImage.apply(xContext,params);
                }

                xContext.fillStrokeShape(this);
            }

        },

        getImage: function(){
            if( this.attr.image instanceof window.Image){
                return this.attr.image;
            }else{
                throw new Error('invalid image object, dom image is required');
            }
        },
    };

    utils.inheritProto(Image16bit,Image);
    XIE.Image16bit = Image16bit;


})(XIE);

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

/**
 * Brighten 亮度 模块
 */
(function(XIE){
    XIE.Filters = XIE.Filters || {};

    XIE.Filters.Brighten = function(imageData){
        var brightness = this.brightness()*255,
            data = imageData.data,
            len = data.length,
            i;
        for(i = 0; i<len; i+=4){
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    }

})(XIE);
/**
 * contrast 对比度 模块
 */
(function(XIE){
    XIE.Filters = XIE.Filters || {};

    XIE.Filters.ContrastTo = function(imageData){
        var contrast = this.contrast(),
            data = imageData.data,
            len = data.length,
            i;
        for(i = 0; i<len; i+=4){
            // red
            data[i] = (data[i] * contrast)>255?255:(data[i] *contrast);
            // green
            data[i + 1]=(data[i + 1] *contrast)>255?255:(data[i + 1] *contrast) ;
            // blue
            data[i + 2] =(data[i  +2] *contrast)>255?255:(data[i  +2] *contrast);
        }
    }

})(XIE);


    return XIE;
});