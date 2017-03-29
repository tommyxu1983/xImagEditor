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
