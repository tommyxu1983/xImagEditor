/**
    XIE eXpress Image Editor framework
**/

(function(global){

    var XIE = {
       /* instance : {},*/
    };

    XIE.Filters={};





    if(window !=='undefined'){
        window.XIE=XIE;
    }

    else if(typeof module !== 'undefined' && module.exports){
        module.exports = XIE;

    }else if(typeof define === 'function' && define.amd){
        define('XIE',function(){
           return XIE;
        });

    }else{
        global.XIE=XIE;
    }


})(this);

