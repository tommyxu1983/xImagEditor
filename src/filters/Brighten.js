/**
 * Brighten 亮度 模块
 */
(function(XIE){
    XIE.Filters = XIE.Filters || {};

    XIE.Filters.Brighten = function(imageData){
        var brightness = this.brightness()*255,
            data = imageData.data,
            len = data.length,
            i;
        for(i = 0; i<len; i+=4){
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    }

})(XIE);