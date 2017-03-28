/**
 * Created by Administrator on 2016/8/16.
 */





var XI={};
var utils = XI.utils=function(canvas){

    this.canvas=undefined;
    if(canvas &&  canvas.tagName.toUpperCase()==='CANVAS'){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        return {
            getEvtXY: this.getXY.bind(this),
            /*on: this.on.bind(this),*/
        }
    }else{
        throw new Error('it is not canvas dom, can\'t construct XI.utils ');
    }
}


utils.prototype={
        /**
        * 获取 事件，鼠标在画布上的位置
        *
        *
        * */
        getXY:function(evt){
            var x,y;
            if(evt.layerX || evt.layerX ==0){
                x= evt.layerX;
                y= evt.layerY;
            }else if(evt.offsetX || evt.offsetX==0){
                x=evt.offsetX;
                y=evt.offsetY;
            }
            return {x:x, y:y};
        },
}


/*var base=XImgEditor.base*/




+function(root, factory){

    var pluginName='XImgEditor';
    if(typeof define === 'function' && define.amd  ){
        define(pluginName,['jquery','PUMsg'],function($,PUMsg){
            return factory($,PUMsg);
        });
    }
    else if(typeof module !== 'undefined' && module.exports){
        module.exports= factory(require('core'));
    }
    else if (typeof window !=='undefined'){
        return root.XImgEditor=factory( root.jQuery, root.PUMsg );
    }


}(this, function(core,PUMsg,undefined){

    var defaultSettings={
        imgDom:undefined
    }

    var ImgEditor=function(options){
        this.settings= core.extend(true,defaultSettings,options);
        if(this.settings.imgDom){

            this.imgDom=this.settings.imgDom;
            this.container=undefined;
            this.canvasContianer=undefined;
            this.imgInfo=undefined;
            this.canvas=undefined;
            this.context=undefined;


            this.init();


        }else{
            throw new Error('XImgEditor can\'t not be initialise,didn\'t find image Dom element');
        }



    }

    ImgEditor.prototype={
        init:function(){
            var parent=this.imgDom.parentNode;


            this.container=document.createElement('div');
            this.container.className='XImgEditor-TextEdit';
            parent.insertBefore( this.container,this.imgDom );
            parent.removeChild(this.imgDom);
            this.container.appendChild(this.imgDom);

            ImgEditor.getImgNatureStyle(this.imgDom, this.onSetUpEditing.bind(this),this.imageError.bind(this))
            this.readyForEditing();



        },

        /**
         *  当 img（<img/>） 里的资源调用完成后，返回函数
         * 设置所有的 内置属性: this.imgInfo, this.canvas, this.context，会在 readyForEditing 里检查
         * 这些 内置属性，用来判断资源是否已经 加载好
         */
        onSetUpEditing:function(img){

            var imgInfo={
                width: img.width,
                height: img.height,
                top:  this.imgDom.offsetTop+ this.imgDom.clientTop,
                left: this.imgDom.offsetLeft + this.imgDom.clientLeft,
            };

            if(imgInfo.width && imgInfo.height){
                this.imgInfo=imgInfo;
                this.canvasContianer=document.createElement('div');
                this.canvasContianer.className='canvasContainer'
                this.container.appendChild(this.canvasContianer);

                this.canvas= document.createElement('canvas');

                this.canvasContianer.appendChild(this.canvas);
            }

        },


        //TODO: implement Error message
        imageError:function(){

        },


        /**
        * 每过 0.1 秒扫描一次，如果4秒之后图片资源还没有加载到位，则跳出error msg
        *
        */

        readyForEditing:function(){
            var me= this;
            var intervalID=null, timeOutID=null, isTimeout=false;
            var pMsg= new PUMsg({ container: this.container});
            pMsg.showOverLay();

            timeOutID=setTimeout(function(){
                isTimeout=true;
            },4000);

            intervalID=setInterval(function(){
                if(me.canvas.getContext || isTimeout ){
                    clearInterval(intervalID);
                    if(isTimeout){
                        pMsg.removeOverLay();
                        pMsg.setErrorMsg('XImgEditor get image resource failed');
                        pMsg.showErrorMsg();
                        throw new Error('XImgEditor get image resource failed');
                    }else{
                        clearTimeout(timeOutID);
                        pMsg.removeOverLay();

                        me.setUpCanvasXYSize.call(me);
                        me.subEvents();
                    }
                }

            },100);

        },


        /**
         * 用 canvas 覆盖 img
         *
         */
        setUpCanvasXYSize:function(){
            this.canvasContianer.style.position='absolute';
            this.canvasContianer.style.top=this.imgInfo.top + 'px';
            this.canvasContianer.style.left=this.imgInfo.left + 'px';
            this.canvas.setAttribute('width',this.imgInfo.width + 'px');
            this.canvas.setAttribute('height', this.imgInfo.height + 'px');
            this.canvas.className='canvas4Image';
        },

        subEvents:function(){
            var me=this;
            this.offevents();

            if(typeof this.settings.onClickAddComment ==='function'){
                core(this.canvas).on('ClickAddComment', this.settings.onClickAddComment);
            }
            core(this.canvas).on("click",function(event){

                core(me.canvas).trigger( 'ClickAddComment', [{canvas:me.canvas,context:me.context,x:event.offsetX,y:event.offsetY}] )
            });


        },

        offevents:function(){
            core(this.canvas).off("click");
        },

        drawCircle:function(x,y,radius){

           /*this.context.strokeStyle = "black";*/

            var ctx= this.canvas.getContext('2d');
            ctx.strokeStyle="red";
            ctx.beginPath();
            ctx.arc(parseInt(x), parseInt(y), parseInt(radius), 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();

        },


        /**
         * 获取 事件，鼠标在画布上的位置
         *
         *
         * */
        getXY:function(evt){
            var x,y;
            if(evt.layerX || evt.layerX ==0){
                x= evt.layerX;
                y= evt.layerY;
            }else if(evt.offsetX || evt.offsetX==0){
                x=evt.offsetX;
                y=evt.offsetY;
            }
            return {x:x, y:y};
        },

        isMouseOnEdge:function(x,y){

            return ID;
        },

        redraw:function(x,y,radius){
        },

        circleObject:function(){

        }



    }






    ImgEditor.getImgNatureStyle=function(imgDom,callBack,error){
        var image = new Image();
        image.src = imgDom.src;
        image.onload = callBack(image);
        image.onerror= error();
    }

    return ImgEditor;
});







