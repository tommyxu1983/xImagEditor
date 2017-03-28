/**
 * guid module
 */
(function(XIE){


     var idStart = 0;
     function guid(){
         return idStart++;
     }

    XIE.guid= guid;

})(XIE);