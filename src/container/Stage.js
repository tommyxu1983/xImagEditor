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
