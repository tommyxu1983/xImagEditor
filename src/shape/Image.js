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
