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
