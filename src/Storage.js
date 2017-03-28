
/**
 *
 *  Storage 模块， globe cache
 *
 */

(function(XIE){

    var utils= XIE.utils;
    if(! utils) {throw new Error('Storage module need utils module');}



    function Storage(){
       /* this.cache = [];*/
        this.stages={};
        this.shapes = {};
    }

    Storage.prototype={
       /* addToDD: function(stage){
            if(this.has(stage.id)){
                return this.cache;
            }
            return this.cache.push(stage);
        },

        remove: function(stage){
           for(var i= 0 ; i<this.cache.length; i++ ){
               if(this.cache[i].id === stage.id){
                   this.cache = this.cache.splice(i,1);
                   return this.cache;
               }
            }

        },

        has: function(stage){
           return this.cache.some(function(item){
                item.id === stage.id;
            });
        }*/

    };




    XIE.cache = new Storage();


})(XIE);
