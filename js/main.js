const width = 800;
const height = 450;

const appOptions = {  
  width: width,
  height: height,
  resolution: window.devicePixelRatio,
  roundPixels: true,
  transparent: false,
  backgroundColor: 0xdbe4c5,
};

var app; //создаем глобальную переменную нашей игры
var colors = [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba]; //массив цветов
var gravity = 4;
var figuresAmount = 0; //количество созданных фигур
var figure = []; //массив хранящий нашу фигуру
var NumberOfShapesPesSec = 1;//количество  фигур за с

document.getElementById("GravityValue").innerHTML = gravity;
document.getElementById("NumberShapesPesSec").innerHTML = NumberOfShapesPesSec;

[].forEach.call(document.querySelectorAll('.btnPlusGravity'), function(item) {
    item.addEventListener('click', function() {
         gravity++;
         document.getElementById("GravityValue").innerHTML = gravity;

    });
});

[].forEach.call(document.querySelectorAll('.btnMinusGravity'), function(item) {
    item.addEventListener('click', function() {
        if(gravity > 1) {
            gravity--;
        }
         document.getElementById("GravityValue").innerHTML = gravity;

    });
});

var model = {
    createCanvas: function() {
        app = new PIXI.Application(appOptions); //создае холст
        document.getElementById("showPixi").appendChild(app.view); //выводим его в тело страницы
    },
    drawShapes: function(x=0,y=0) {
        let areaShapes = 0;
        
        rand = Math.floor(Math.random() * colors.length);
        var inAreaX = width - 100; //возможные координаты по оси X, которые может занимать круг, ширина страницы минус его диаметр
        var shapesY = y || -100; //круг должен создаваться за пределами холста
        var shapesX = x || Math.floor(Math.random() * inAreaX);

        var shapes = new PIXI.Graphics(); //создаем новый графический элемент

        shapes.beginFill(colors[rand], 1);
        let diffrendShapes = ['Triangle','Rect', 'Pentagon', 'Hexagon', 'Circle', 'Ellipse', 'Random'];
        let randShapes = Math.floor(Math.random() * diffrendShapes.length);

        switch (diffrendShapes[randShapes]) {
            case 'Triangle':
                shapes.moveTo(shapesX, shapesY);
                shapes.lineTo(shapesX+100, shapesY);
                shapes.lineTo(shapesX+50, shapesY + 50);
                shapes.lineTo(shapesX, shapesY);
                shapes.closePath();
                areaShapes = 0.5*(100*50);
                break;
            
            case 'Rect':
                shapes.drawRect(shapesX, shapesY, 100, 100); //рисуем квадрат
                areaShapes = 100*100;
                break;
            case 'Pentagon':
                const pathPentagon = [shapesX+50, shapesY, shapesX+100, shapesY+50, shapesX+100, shapesY+100, shapesX, shapesY+100, shapesX, shapesY+50];
                areaShapes = 100*100+0.5*(100*50);
                shapes.drawPolygon(pathPentagon);
                break;
            case 'Hexagon':
                const pathHexagon = [shapesX+50, shapesY,
                                     shapesX+100, shapesY+33, 
                                     shapesX+100, shapesY+66,
                                     shapesX+50, shapesY+99,  
                                     shapesX, shapesY+66, 
                                    shapesX, shapesY+33];
                areaShapes = 100*66+(100*33);
                shapes.drawPolygon(pathHexagon);
                break;
            case 'Circle':
                var radius = 50; //радиус круга
                areaShapes = Math.PI*(radius**2);
                shapes.drawCircle(shapesX, shapesY, radius); //рисуем круг
                break;
            case 'Ellipse':
                //shapes.drawEllipse(shapesX, shapesY, 50,30); //рисуем овал
                areaShapes = Math.PI* 50*30;
                shapes.drawEllipse(shapesX, shapesY, 50,30); //рисуем овал
                break;
            default:
                shapes.drawStar(shapesX, shapesY, 5, 50);       
        }
        
        shapes.endFill();

        shapes.interactive = true; //делаем круг интерактивным
        shapes.buttonMode = true; //меняем курсор при наведении
        shapes.areaShapes = Math.floor(areaShapes);
        shapes.live = true; //указываем что наш шарик жив и не пал жертвой выстрела
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

             [].forEach.call(document.querySelectorAll('#showPixi'), function(item) {
                item.addEventListener('dblclick', function(e) {
                    model.drawShapes(e.layerX, e.layerY);
                });
               
            });  

            const drawCirclePerSec = function() {
            let n = 1;
                while(n<=NumberOfShapesPesSec){
                    model.drawShapes();
                    ++n;
                    let countShapesInArea = figure.filter(i => i.live === true).length;
                    document.getElementById("NumberOfShapes").innerHTML = countShapesInArea;
                    let countSurfaceArea = figure.filter(i => i.live === true).reduce((total, i) => total+i.areaShapes, 0);
                    document.getElementById("surfaceArea").innerHTML = countSurfaceArea;
                }}

            setInterval(drawCirclePerSec,1000);
        
            [].forEach.call(document.querySelectorAll('.btnPlusNumber'), function(item) {
                item.addEventListener('click', function() {
                    NumberOfShapesPesSec++;
                     document.getElementById("NumberShapesPesSec").innerHTML = NumberOfShapesPesSec;    
                });
            });
            
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
        this.clear();
        figure[this.num].live = false;
    }
}


view.loadGame();