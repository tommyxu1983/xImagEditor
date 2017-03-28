

/**
 *  Animation 可以被实例化， 也提供了一些实例属性和方法。
 *
 * Animation 的管理类就不重写了
 *
 * */



(function(XIE){


    var now = (function(){
        return function() {
            return new Date().getTime();
        };
    })();
    var window = window || {};
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = now();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    })();

    function Animation (func, layers){
        this.func = func;
        this.layers=null;
        this.setLayers(layers);
        this.id = Animation.animIDCounter++;

        this.frame = {
            time:0,
            timeDiff: 0,
            lastTime: now()
        }

    }

    Animation.prototype ={
        setLayers: function(layers){
            var lays = layers || [];
            this.layers=lays.length>0? lays : [lays];
            return this;

        },

        getLayers: function(){
            return this.layers;
        },

        addLayer: function(layer){
            var layers = this.layers,
                l = layer.length, n;
            for(n=0; n<l; n++){
                if(layers[n].guid = layer.guid){
                    return false;
                }
                this.layers.push(layer);
                return true;
            }
        },

        isRunning: function(){
            var anims = Animation.animations,
                l = anims.length,
                n;

            for(n =0; n<l; n++){
                if(anims[n].id === this.id){
                    return true;
                }
            }
            return false;
        },

        start: function(){
            var Anim = Animation;
            this.stop();
            this.frame.timeDiff =0;
            this.frame.lastTime = 0;
            this.frame.lastTime = now();
            Anim._addAnimation(this);
            return this;
        },

        stop: function(){
            Animation._removeAnimation(this);
            return this;
        },

        _updateFrameObject: function(time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }


    };


    //animation static start: property and method to manage the animation instance.
    Animation.animations = [];
    Animation.animIDCounter = 0;
    Animation.animRunning =false;

    Animation._addAnimation = function(anim){
        //这里 的this 指向 Animation function(){}, 不是实例。
        this.animations.push(anim);
        this._handleAnimation();
    };

    Animation._removeAnimation = function(anim) {
        var id = anim.id,
            animations = this.animations,
            l = animations.length, n;
        for(n =0; n<l; n++){
            if(animations[n].id == id){
                this.animations.splice(n,1);
                break;
            }
        }

    };
    //animation static End






    Animation._runFrames = function() {
        var layerHash = {},
            animations = this.animations,
            anim, layers, func, n, i, layersLen, layer, key, needRedraw;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */

        for(n = 0; n < animations.length; n++) {
            anim = animations[n];
            layers = anim.layers;
            func = anim.func;


            anim._updateFrameObject(now());
            layersLen = layers.length;

            // if animation object has a function, execute it
            if (func) {
                // allow anim bypassing drawing
                needRedraw = (func.call(anim, anim.frame) !== false);
            } else {
                needRedraw = true;
            }
            if (!needRedraw) {
                continue;
            }
            for (i = 0; i < layersLen; i++) {
                layer = layers[i];

                if (layer.guid !== undefined) {
                    layerHash[layer.guid] = layer;
                }
            }
        }

        for (key in layerHash) {
            if (!layerHash.hasOwnProperty(key)) {
                continue;
            }
            layerHash[key].draw();
        }
    };

    Animation._animationLoop = function() {
        var Anim = Animation;
        if(Anim.animations.length) {
            Anim._runFrames();
            requestAnimationFrame(Anim._animationLoop);
        }
        else {
            Anim.animRunning = false;
        }
    };

    Animation._handleAnimation = function() {
        if(!this.animRunning) {
            this.animRunning = true;
            requestAnimationFrame(this._animationLoop);
        }
    };


    XIE.Animation = Animation;


})(XIE);