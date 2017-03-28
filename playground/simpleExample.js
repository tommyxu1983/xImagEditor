/**
 * Created by Administrator on 2016/8/15.
 */
/*
document.onload=function(){
    var imgEditor= new ImgEditorExp();

}*/


/*require.config({

    baseUrl:'..',

    paths:{
        'jquery':'exLibs/jquery-1.12.3', //'../exLibs/jquery-1.12.3'
        'PUMsg':'ui/popUpMsg/popUpMsg',
        'XImgEditor': '_src/xImgEditor'
    }

});*/


/*require(['jquery','XImgEditor'],function($,ImgEditor){});*/
$(document).ready(function(){

    var img= document.getElementById('img4Test');
    var iEditor= new XImgEditor({imgDom:img,
        onClickAddComment:function(event,data){
            $('#result').append('x:'+data.x + ' y:'+ data.y);
            iEditor.drawCircle(data.x,data.y, 10);
        }

    });


    var c=document.getElementById('draw2');
    var ctx=c.getContext("2d");

    var gradient=ctx.createLinearGradient(0,0,170,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");

    ctx.strokeStyle=gradient;
    ctx.beginPath();
    ctx.arc(100,100,10,0,2*Math.PI);



    ctx.closePath();
    ctx.stroke();

    ctx.strokeRect(50, 10, 100, 100);


    var a={name:'a',isMy : isMyOffSpring}, b ={name:'b',isMy : isMyOffSpring},c ={name:'c',isMy : isMyOffSpring},
        d={name:'d',isMy : isMyOffSpring},e ={name:'e',isMy : isMyOffSpring}, f ={name:'f',isMy : isMyOffSpring},
        g ={name:'g',isMy : isMyOffSpring},h ={name:'h',isMy : isMyOffSpring}, i ={name:'i',isMy : isMyOffSpring},l={name:'l',isMy : isMyOffSpring}, m={name:'m',isMy : isMyOffSpring}, n={name:'n',isMy : isMyOffSpring};



    a.children=[b,c,d];
    c.children= [e,f];
    d.children=[g,h];

    e.children =[l,m];
    f.children =[n];

    n.children = [i];

   console.log( c.isMy(a) );






    function isMyOffSpring (child){
        var children = this.children;
        var findOffSpring = false;

        for(var i= 0, l = children.length; i<l; i++){
            if(! findOffSpring){


                if( children[i] === child){
                    console.log(children[i].name);
                    return true;
                }else{
                    if(children[i].children){
                        findOffSpring = isMyOffSpring.call(children[i],child);
                    }
                }
            }else{
                return true;
            }

        }

        return findOffSpring;
    }




});










