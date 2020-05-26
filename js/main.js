const width = 800;
const height = 450;
const length =width*height;

const appOptions = {  
  width: width,
  height: height,
  resolution: window.devicePixelRatio,
  roundPixels: true,
  transparent: false,
  backgroundColor: 0xdbe4c5,
};

var app; 
var colors = [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba]; //массив цветов
var gravity = 4;
var figuresAmount = 0; //количество созданных фигур
var figure = []; //массив хранящий нашу фигуру
var NumberOfShapesPesSec = 1;

document.getElementById("GravityValue").innerHTML = gravity;
document.getElementById("NumberShapesPesSec").innerHTML = NumberOfShapesPesSec;


var model = {
    createCanvas: function() {
        app = new PIXI.Application(appOptions); //создае холст
        document.getElementById("showPixi").appendChild(app.view); //выводим его в тело страницы 
    },

    requestInterval: function (fn, delay) {
        var requestAnimFrame = (function () {
          return window.requestAnimationFrame || function (callback) {
            window.setInterval(callback, 1000);
          };
        })(),
        start = new Date().getTime(),
        handle = {};
        function loop() {
          handle.value = requestAnimFrame(loop);
          var current = new Date().getTime(),
          delta = current - start;
          if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
          }
        }
        handle.value = requestAnimFrame(loop);
        return handle;
    },

    drawShapes: function(x=0,y=0) {
        let areaShapes = 0;
        
        rand = Math.floor(Math.random() * colors.length);
        var inAreaX = width - 100; 
        var shapesY = y || -100; 
        var shapesX = x || Math.floor(Math.random() * inAreaX);

        var shapes = new PIXI.Graphics(); //создаем новый графический элемент

        shapes.beginFill(colors[rand], 1);
        let diffrendShapes = ['Triangle','Rect', 'Pentagon', 'Hexagon', 'Circle', 'Ellipse', 'Random'];
        let randShapes = controller.randomRange(0, diffrendShapes.length);//Math.floor(Math.random() * diffrendShapes.length);
        let type = diffrendShapes[randShapes];
        switch (type) {
            case 'Triangle':
                shapes.moveTo(shapesX, shapesY);
                shapes.lineTo(shapesX+100, shapesY);
                shapes.lineTo(shapesX+50, shapesY + 50);
                shapes.lineTo(shapesX, shapesY);
                shapes.closePath();
                break;
            
            case 'Rect':
                let a = controller.randomRange(30, 100);
                let b = controller.randomRange(30, 100);
                shapes.drawRect(shapesX, shapesY,  a, b); //рисуем квадрат
                break;
            case 'Pentagon':
                const pathPentagon = [shapesX+50, shapesY, shapesX+100, shapesY+50, shapesX+100, shapesY+100, shapesX, shapesY+100, shapesX, shapesY+50];
                shapes.drawPolygon(pathPentagon);
                break;
            case 'Hexagon':
                const pathHexagon = [shapesX+50, shapesY,
                                     shapesX+100, shapesY+33, 
                                     shapesX+100, shapesY+66,
                                     shapesX+50, shapesY+99,  
                                     shapesX, shapesY+66, 
                                    shapesX, shapesY+33];
                shapes.drawPolygon(pathHexagon);
                break;
            case 'Circle':
                var radius = controller.randomRange(30, 50); //радиус круга
                shapes.drawCircle(shapesX, shapesY, radius); //рисуем круг
                break;
            case 'Ellipse':
                let aEllipse = controller.randomRange(20, 30)
                let bEllipse = controller.randomRange(35, 50)
                shapes.drawEllipse(shapesX, shapesY, bEllipse,aEllipse); //рисуем овал
                break;
            default:
                shapes.drawStar(shapesX, shapesY, controller.randomRange(5, 20), controller.randomRange(5, 50));       
        }
        
        shapes.endFill();

        shapes.interactive = true; //делаем круг интерактивным
        shapes.buttonMode = true; //меняем курсор при наведении
        pixels = app.renderer.extract.pixels(shapes);
        shapes.areaShapes = pixels.length;
        shapes.live = true; //указываем что наш шарик жив :)
        shapes.type = type;
        figuresAmount++;
        shapes.num = figuresAmount; //даем нашей фигуре порядковый номер
        figure.push(shapes); //обратиться на прямую к объекту shapes мы не можем, поэтому отправляем его в массив
        app.stage.addChild(shapes); //выводим фигуру на холст
        shapes.on('click', controller.clearFigure); //добавляем возможность при клике на фигуру удалить её            
                
    }
}
var view = {
    loadGame: function() {
        model.createCanvas();

        controller.increasGravityValue();
        controller.decreaseGravityValue();
        controller.increasNumberOfFigure();
        controller.decreaseNumberOfFigure();
        controller.addShapesWithDbclick();

        model.requestInterval(controller.drawCirclePerSec,1000);

        app.ticker.add(function() { //постоянное обновление холста
            
            for (var i = 0; i < figuresAmount; i++) {
                figure[i].position.y += gravity; 
                if (figure[i].position.y > (height+110) && figure[i].live == true) {
                    figure[i].clear();
                    figure[i].live = false;
                    let countShapesInArea = figure.filter(i => i.live === true).length;
                    let countSurfaceArea = figure.filter(i => i.live === true).reduce((total, i) => total+i.areaShapes, 0);
                    document.getElementById("NumberOfShapes").innerHTML = countShapesInArea;
                    document.getElementById("surfaceArea").innerHTML = countSurfaceArea;
                }
            }
        });
    }
}


var controller = {
    clearFigure: function() {
        figure.filter(i => i.type === this.type).map(i => i.tint = colors[Math.floor(Math.random() * colors.length)]);
        figure[this.num].live = false;
        this.clear();
    },
    increasNumberOfFigure: function() {
        [].forEach.call(document.querySelectorAll('.btnPlusNumber'), function(item) {
            item.addEventListener('click', function() {
                NumberOfShapesPesSec++;
                 document.getElementById("NumberShapesPesSec").innerHTML = NumberOfShapesPesSec;    
            });
        });
    },
    decreaseNumberOfFigure: function() {
        [].forEach.call(document.querySelectorAll('.btnMinusNumber'), function(item) {
            item.addEventListener('click', function() {
                if(NumberOfShapesPesSec === 0) {
                    NumberOfShapesPesSec = 0;
                } else {
                    NumberOfShapesPesSec--;
                }
                 document.getElementById("NumberShapesPesSec").innerHTML = NumberOfShapesPesSec;
            });
        });
    },
    increasGravityValue: function() {
        [].forEach.call(document.querySelectorAll('.btnPlusGravity'), function(item) {
            item.addEventListener('click', function() {
                 gravity++;
                 document.getElementById("GravityValue").innerHTML = gravity;
        
            });
        });
    },
    decreaseGravityValue: function() {
        [].forEach.call(document.querySelectorAll('.btnMinusGravity'), function(item) {
            item.addEventListener('click', function() {
                if(gravity > 1) {
                    gravity--;
                }
                 document.getElementById("GravityValue").innerHTML = gravity;
        
            });
        });
    },
    addShapesWithDbclick: function() {
        [].forEach.call(document.querySelectorAll('#showPixi'), function(item) {
            item.addEventListener('dblclick', function(e) {
                model.drawShapes(e.layerX, e.layerY);
            });
        });  
    },
    drawCirclePerSec: function() {
        let n = 1;
            while(n<=NumberOfShapesPesSec){
                model.drawShapes();
                ++n;
                let countShapesInArea = figure.filter(i => i.live === true).length;
                document.getElementById("NumberOfShapes").innerHTML = countShapesInArea;
                let countSurfaceArea = figure.filter(i => i.live === true).reduce((total, i) => total+i.areaShapes, 0);
                document.getElementById("surfaceArea").innerHTML = countSurfaceArea;
            }
    },
    randomRange: function(start, finish) {
      return  start + Math.floor(Math.random() * finish);
    }
}


view.loadGame();