
String.format = function() { let args = arguments; return args[0].replace(/{(\d+)}/g, function(match, num) { num = Number(num) + 1; return typeof(args[num]) != undefined ? args[num] : match; }); }

function deepCopy(o) {
    var result = {};
    if (typeof o === "object" && o !== null)
        for (i in o) result[i] = deepCopy(o[i]);
    else result = o;

    return result;
}


function create2DArray(rows, columns) {
    arr = [];
    for(var r = 0; r < rows; r++){
        arr[r] = [];
        for (var i = 0; i < columns; i++) {            
            arr[r][i] = {
                x: 0,
                y: 0,
                status: false
            };
        }
    }
    return arr;
}

class Shape{

    constructor(ctx){
        this.componentBrickWidth = 30;
        this.componentBrickHeight = 30;
        this.ctx = ctx;
    }

    drawBrick(posInfo, color){        
        this.ctx.beginPath();
        this.ctx.rect(posInfo.x, posInfo.y, this.componentBrickWidth, this.componentBrickHeight);
        this.ctx.fillStyle=color;
        this.ctx.fill();
        this.ctx.strokeStyle="black";
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

class BrickShape extends Shape{
    rows = 3;
    cols = 3;
    
    constructor(ctx, canvas, field){
        super(ctx);
        this.shapeA = [1, 4, 5, 6];
        this.canvas = canvas;
        this.shapeArr = create2DArray(this.rows, this.cols);
        this.posX = 0;
        this.posY = 0;
        this.rowCnt = 1;
    }

    drawBrickShape(posX, posY){
        this.posX = posX;
        this.posY = posY;

        if(this.ctx != null){
            var max = 256;
            var red = Math.random() * max;
            var green = Math.random() * max;
            var blue = Math.random() * max;

            this.color = String.format("rgb({0}, {1}, {2})", red, green, blue);

            this.drawBrickShapeA(posX, posY, this.color);
        }
    }

    drawBrickShapeA(posX, posY){
        for(var i=0; i<this.shapeA.length; i++){
            var row = parseInt((this.shapeA[i] - 1) / this.rows);
            var col =(this.shapeA[i] - 1) % this.rows;

            this.shapeArr[row][col].x = col * this.componentBrickWidth + posX;
            this.shapeArr[row][col].y = row * this.componentBrickHeight + posY;
            this.shapeArr[row][col].status = true;

            this.drawBrick(this.shapeArr[row][col], this.color);
        }
    }

    moveDownBrickShape(){
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    this.shapeArr[r][c].y += this.componentBrickHeight;
                    this.drawBrick(this.shapeArr[r][c], this.color);
                }
            }
        }
        this.rowCnt += 1;
        
    }

    moveLeftBrickShape(){
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    this.shapeArr[r][c].x -= this.componentBrickWidth;
                    this.drawBrick(this.shapeArr[r][c], this.color);
                }
            }
        }
    }

    moveRightBrickShape(){        
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    this.shapeArr[r][c].x += this.componentBrickWidth;
                    this.drawBrick(this.shapeArr[r][c], this.color);
                }
            }
        }
    }

    resetBrickShape(){
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                this.shapeArr[r][c].x = 0;
                this.shapeArr[r][c].y = 0;
                this.shapeArr[r][c].status = false;
            }
        }
    }

    collisionDetection(fieldArr){
        if(fieldArr.length <= this.rowCnt + 1){            
            return true;
        }else{
            return false;
        }        
    }
}


class FieldShape extends Shape{
    
    constructor(ctx, canvas){
        super(ctx);        
        this.canvas = canvas;
        this.widthCnt = 11;
        this.heightCnt = 10;
        this.width = this.componentBrickWidth * this.widthCnt;
        this.height = this.componentBrickHeight * this.heightCnt;
        this.drawPosX = 0;
        this.drawPosY = 0;
        this.shapeArr = create2DArray(this.heightCnt, this.widthCnt);
    }

    drawFieldBricks(){
        for(var r=0; r<this.heightCnt; r++){
            for(var c=0; c<this.widthCnt; c++){
                this.shapeArr[r][c].x = c * this.componentBrickWidth + this.drawPosX;
                this.shapeArr[r][c].y = r * this.componentBrickHeight + this.drawPosY;
                
                this.drawBrick(this.shapeArr[r][c], "white");
            }
        }
    }
}