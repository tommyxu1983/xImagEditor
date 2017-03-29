var expect = window.chai.expect;

Imports.LoadInOrder('../../', function(){
    var XIE = window.XIE;
    var stage = new  XIE.Stage({
        wrapper: 'XIEWrapper',
        width: 600,
        height: 400
    });

    var layer = new XIE.Layer({
        width: 600,
        height: 400
    });


    var circle = new XIE.Circle({
        x: 200,
        y: 200,
        radius: 50,
        fill: 'orange',
        stroke: 'red',
        draggable: true
    });

    stage.add(layer);

    layer.add(circle);

    // test case begin
    describe('unit_APIs', function(){
        // element.js api
        describe('Element',function(){
            it('isMyOffSpring', function(){
                expect(stage.isMyOffSpring(layer)).to.be.ok;
                expect(stage.isMyOffSpring(circle)).to.be.ok;
                expect(layer.isMyOffSpring(layer)).to.not.be.ok;
                expect(layer.isMyOffSpring(stage)).to.not.be.ok;
            });

            it('isMyAncestor', function(){
               expect(circle.isMyAncestor(layer)).to.be.ok;
              expect(circle.isMyAncestor(stage)).to.be.ok;
                expect(layer.isMyAncestor(stage)).to.be.ok;

              expect(layer.isMyAncestor(circle)).to.not.be.ok;
               expect(stage.isMyAncestor(circle)).to.not.be.ok;
              expect(stage.isMyAncestor(layer)).to.not.be.ok;
            });

            it('getLayer',function(){
             expect(circle.getLayer()).to.be.equal(layer);
             expect(stage.getLayer()).to.be.equal(undefined);
             expect(layer.getLayer()).to.be.equal(layer);

           });

            it('getStage',function(){
                expect(circle.getStage()).to.be.equal(stage);
                expect(stage.getStage()).to.be.equal(stage);
                expect(layer.getStage()).to.be.equal(stage);
            });

            it('brightness',function(){

                expect(circle.brightness()).to.be.equal(0);
                expect(stage.brightness()).to.be.equal(0);
                expect(layer.brightness()).to.be.equal(0);

                circle.brightness(1);
                stage.brightness(2);
                layer.brightness(3);
                expect(circle.brightness()).to.be.equal(1);
                expect(stage.brightness()).to.be.equal(2);
                expect(layer.brightness()).to.be.equal(3);
            });


            it('contrast',function(){

                expect(circle.contrast()).to.be.equal(1);
                expect(stage.contrast()).to.be.equal(1);
                expect(layer.contrast()).to.be.equal(1);

                circle.contrast(3);
                stage.contrast(4);
                layer.contrast(5);
                expect(circle.contrast()).to.be.equal(3);
                expect(stage.contrast()).to.be.equal(4);
                expect(layer.contrast()).to.be.equal(5);
            });

            it('addFilters',function(){
                expect( circle.addFilters.bind(circle) ).to.throw(Error,/addFilters expect a array, wrong argument/);
                var filter1 = function(imageData){};
                var filter2= function(imageData){};
                expect( circle.addFilters([filter1]).length).to.be.equal(1);
                expect( circle.addFilters([filter1]).length).to.be.equal(1);
                expect( circle.addFilters([filter2]).length).to.be.equal(2);
            });


        });

       // Container.js api
        describe('Container',function(){
           it('add',function(){
               expect(layer.children).to.include(circle);
               var rect = new XIE.Rect({});
               expect(layer.children).to.not.include(rect);
               layer.add(rect);
               expect(layer.children).to.include(rect);
               expect(stage.add.bind(stage,rect)).to.throw(Error,/you may only add layer to a stage/);
               expect(layer.add.bind(layer,stage)).to.throw(Error,/you may only add Shapes to a layer/);
           });

           it('remove',function(){
               expect(stage.remove(layer)).to.not.include(layer);
               expect(layer.parent).to.be.equal(null);
               expect(layer.remove(circle)).to.not.include(circle);
               expect(circle.parent).to.be.equal(null);
               //add back for further test case
               stage.add(layer);
               layer.add(circle);
           });


       });


        describe('Layer', function(){
           it('draw',function(){
               expect(layer.draw()).to.be.equal(layer);
              /* expect(stage.draw()).to.be.equal(stage);*/
          });

           it('getLayer',function(){
               expect(layer.getLayer()).to.be.equal(layer);
           });
           it('getStage',function(){
               expect(layer.getStage()).to.be.equal(stage);
           });
           it('isAddedToStage',function(){
               stage.remove(layer);
               expect(layer.isAddedToStage()).to.not.be.ok;
               stage.add(layer);
               expect(layer.isAddedToStage()).to.be.ok;

           });
            it('getViewCanvas',function(){
                expect(layer.getViewCanvas()).to.be.instanceOf(XIE.ViewCanvas);
            });
            it('getHitCanvas',function(){
                expect(layer.getHitCanvas()).to.be.instanceOf(XIE.HitCanvas);
            });

            it('setCanvasSize',function(){
            });

            it('setCanvasStyle',function(){
            });

        });

        describe('stage', function(){

           it('draw',function(){
               stage.remove(layer);
               layer.remove(circle);
               expect(circle.draw.bind(circle)).to.throw(Error,/shape needed to add in to a layer before draw/);
               stage.add(layer);
               layer.add(circle); //add back for further test case

           });


           it('add',function(){
               expect(stage.children).to.include(layer);
               var rect1 = new XIE.Rect({});
               expect(stage.add.bind(stage,rect1)).to.throw(Error,/you may only add layer to a stage/);
           });

           it('remove',function(){
               expect(stage.remove(layer)).to.not.include(layer);
               //add back for further test case
               stage.add(layer);
           });
           it('getIntersection',function(){

               expect(stage.isMyOffSpring(circle)).to.be.ok;
               stage.draw();
               expect(stage.getIntersection({x:200, y:200})).to.be.equal(circle);
           });
        });

        describe('shape', function(){
           it('draw',function(){
              expect(circle.draw()).to.be.equal(circle);
               layer.remove(circle);
               expect(circle.draw.bind(circle)).to.throw(Error,/shape needed to add in to a layer before draw/);
               layer.add(circle); //add back for further test case
           });






        });

    });

    //test case end


    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }

});