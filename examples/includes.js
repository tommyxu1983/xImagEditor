var Imports = (function(window){

    var imports={};
    var doc=window.document;
    var files = [
        'src/XIE.js',
        'src/helpers/guid.js',
        'src/helpers/utils.js',
        'src/helpers/EventProxy.js',
        'src/helpers/matrix.js',
        'src/Transformable.js',
        'src/Animation.js',
        'src/Drag.js',
        'src/Element.js',
        'src/Storage.js',
        'src/Container.js',
        'src/XContext.js',
        'src/XCanvas.js',
        'src/container/Layer.js',
        'src/container/Stage.js',
        'src/Shape.js',
        'src/shape/Circle.js',
        'src/shape/Rect.js',
        'src/shape/Image.js',
        'src/Grey16bit/Image16bit.js',
        'src/shape/CustomShape.js',
        'src/filters/Brighten.js',
        'src/filters/ContrastTo.js'
    ];




    function Includes(baseURL , cb){
        if(doc){
            var headTag = document.head || doc.getElementsByTagName('head')[0];
            if(headTag){

                var fLength=files.length;
                var loadedFlag = {};
                for(var i= 0,l=fLength; i<l; i++){
                    var script = doc.createElement('script');

                    script.setAttribute("type","text/javascript");

                    script.setAttribute("src", baseURL+files[i]);

                    script.setAttribute("charset","utf-8");
                    headTag.appendChild(script);
                    loadedFlag["script-"+i]=false;
                    script.onload = (function(count){

                            return function(){
                                loadedFlag["script-"+count]=true;
                            }

                    })(i);
                }

                var ID = setInterval(function(){
                    var isAllReady = true;
                    for(var j= 0, l=fLength; j<l; j++ ){
                       if( !loadedFlag["script-"+j]){
                           isAllReady = false;
                       }
                    }

                    if(isAllReady){
                        clearInterval(ID);
                        cb.call(window);
                    }

                },50);


            }else{
                throw new Error('missing head Tag for nest script');
            }
        }else{

            throw new Error('not in browser');
        }

    }


    function LoadInOrder(baseURL , cb){
        var headTag = document.head || doc.getElementsByTagName('head')[0];
        if(headTag){
            var orderOfScript= 0,increaseFlag = false;
            var ID = setInterval(function(){

                var isAllReady = false, script;

                script = doc.createElement('script');

                script.setAttribute("type","text/javascript");

                script.setAttribute("src", baseURL+files[orderOfScript]);

                script.setAttribute("charset","utf-8");
                headTag.appendChild(script);

                script.onload = (function() {
                    return function () {increaseFlag = true;}

                })();

                if(increaseFlag){
                    orderOfScript++;
                    increaseFlag=false;
                }

                if(orderOfScript==files.length){
                    isAllReady = true;
                }


                if(isAllReady){
                    clearInterval(ID);
                    cb.call(window);
                }

            },60);




        }

    }


    imports.Includes = Includes;
    imports.LoadInOrder = LoadInOrder;

    return imports;
})(window);