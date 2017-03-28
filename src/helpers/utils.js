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

