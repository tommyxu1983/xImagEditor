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
