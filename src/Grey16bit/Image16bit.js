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
