/**
 * contrast 对比度 模块
 */
(function(XIE){
    XIE.Filters = XIE.Filters || {};

    XIE.Filters.ContrastTo = function(imageData){
        var contrast = this.contrast(),
            data = imageData.data,
            len = data.length,
            i;
        for(i = 0; i<len; i+=4){
            // red
            data[i] = (data[i] * contrast)>255?255:(data[i] *contrast);
            // green
            data[i + 1]=(data[i + 1] *contrast)>255?255:(data[i + 1] *contrast) ;
            // blue
            data[i + 2] =(data[i  +2] *contrast)>255?255:(data[i  +2] *contrast);
        }
    }

})(XIE);