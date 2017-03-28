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