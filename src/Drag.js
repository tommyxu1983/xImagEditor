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
