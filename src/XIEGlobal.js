/**
 XIE eXpress Image Editor framework

 */


(function(global){
    /**
     * this file is for compile only
     */

    var XIE = {
        /* instance : {},*/
    };

    XIE.Filters={};


   @@include



    /*  if(window !=='undefined'){
     window.XIE=XIE;
     }

     else*/ if(typeof module !== 'undefined' && module.exports){
        module.exports = XIE;

    }else if(typeof define === 'function' && define.amd){
        define('XIE',function(){
            return XIE;
        });

    }else{
        global.XIE=XIE;
    }


})(this);
