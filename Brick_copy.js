
String.format = function() { let args = arguments; return args[0].replace(/{(\d+)}/g, function(match, num) { num = Number(num) + 1; return typeof(args[num]) != undefined ? args[num] : match; }); }

function deepCopy(o) {
    var result = {};
    if (typeof o === "object" && o !== null)
        for (i in o) result[i] = deepCopy(o[i]);
    else result = o;

    return result;
}


const playerComponentWidth = 30;
const playerComponentHeight = 30;

const enemyComponentWidth = 10;
const enemyComponentHeight = 10;


function create2DArray(rows, columns, color) {
    arr = [];
    for(var r = 0; r < rows; r++){
        arr[r] = [];
        for (var i = 0; i < columns; i++) {            
            arr[r][i] = {
                x: 0,
                y: 0,
                color: color,
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

    
    
    

}

class BrickShape {    
    
    constructor(ctx, width, height){
        this.ctx = ctx;
        // this.shapeTypeIdx = ["shapeA", "shapeA2", "shapeB", "shapeC", "shapeD", "shapeD2", "shapeE"];
        this.shapeTypeIdx = ["shapeA"];

        this.componentWidth = width;
        this.componentHeight = height;

        this.shape = this.createBrickShape();       
        this.nextShape = this.createBrickShape(); 
        
        // this.currentShape = this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)];
    }
    
    initializeBrickShape(posX, posY){
        this.posX = posX;
        this.posY = posY;
        
        this.shape.initailizeShapeInfo(posX, posY);
    }
    
    
    

    drawBrickShape(startX, startY){
        this.shape.drawShape(this.ctx, startX, startY);        
    }

    moveDownBrickShape(){
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].y += this.shape.componentBrickHeight;                    
                }
            }
        }
    }

    moveLeftBrickShape(){
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].x -= this.shape.componentBrickWidth;                    
                }
            }
        }
        this.colCnt -= 1;
    }

    moveRightBrickShape(){        
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].x += this.shape.componentBrickWidth;                    
                }
            }
        }

        this.colCnt += 1;
    }

    rotate_90(m){
        var rc = this.rowCnt;
        var cc = this.colCnt;

        var N = m.length;
        var ret = new Array(N);
        for(var i=0; i<N; i++){            
            ret[i] = new Array(N);
        }  
    
        for(var r=0; r<N; r++){
            
            for(var i=0; i<N; i++){            
                ret[i][N-1-r] = deepCopy(m[r][i]);
                ret[i][N-1-r].x = (cc + (N-1-r)) * this.componentBrickWidth;
                ret[i][N-1-r].y = (rc + i) * this.componentBrickHeight;
            }
        }
        
        return ret
    }

    brickRoate(){
        this.shape.shapeArr = this.rotate_90(this.shape.shapeArr);
        console.log("Rotate", this.shape.shapeArr);
    }

    resetBrickShape(){
        this.shape = this.nextShape;
        this.nextShape = this.createBrickShape();
    }



    getNextShape(){
        return this.nextShape;
    }

    gotoEnd(fieldArr){
        while(!this.collisionDetection(fieldArr, "down")){
            this.moveDownBrickShape();
        }
        
        return true;
    }


    initailizeShapeInfo(startX, startY){
        this.startX = startX;
        this.startY = startY;
        for(var i=0; i<this.shapeIdx.length; i++){
            var row = parseInt((this.shapeIdx[i]) / this.rows);
            var col =(this.shapeIdx[i]) % this.rows;

            this.shapeArr[row][col].x = col * this.componentBrickWidth + this.startX;
            this.shapeArr[row][col].y = row * this.componentBrickHeight + this.startY;
            this.shapeArr[row][col].status = true;
            this.shapeArr[row][col].color = this.color;
        }
    }

    draw2DBrick(){

        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    this.ctx.beginPath();
                    this.ctx.rect(this.shapeArr[r][c].x, this.shapeArr[r][c].y, this.componentBrickWidth, this.componentBrickHeight);
                    this.ctx.fillStyle=this.color;
                    this.ctx.fill();
                    this.ctx.strokeStyle="black";
                    this.ctx.stroke();
                    this.ctx.closePath();            
                }
            }
        }        
    }

    createBrickShape(){
        var max = 256;
        var red = Math.random() * max;
        var green = Math.random() * max;
        var blue = Math.random() * max;

        var color = String.format("rgb({0}, {1}, {2})", red, green, blue);
        
        
        return this.createShapeObj(this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)], color);
    }

    createShapeObj(shapeType, color){        
        var playShape = null;
        if(shapeType == "shapeA"){            
            console.log("dfs",this.componentWidth);
            playShape = new ShapeA(color, this.componentWidth, this.componentHeight);

        }else if(shapeType == "shapeA2"){
            playShape = new ShapeA2(color, this.componentWidth, this.componentHeight);
        }else if(shapeType == "shapeB"){
            playShape = new ShapeB(color, this.componentWidth, this.componentHeight);
        }else if(shapeType == "shapeC"){
            playShape = new ShapeC(color, this.componentWidth, this.componentHeight);
        }else if(shapeType == "shapeD2"){
            playShape = new ShapeD2(color, this.componentWidth, this.componentHeight);
        }else if(shapeType == "shapeD"){
            playShape = new ShapeD(color, this.componentWidth, this.componentHeight);
        }else if(shapeType == "shapeE"){
            playShape = new ShapeE(color, this.componentWidth, this.componentHeight);
        }

        return playShape;
    }
    
}

class ShapeA extends Shape{ //L
    
    
    constructor(color){
        super();
        this.color = color;
        this.rows = 3;
        this.cols = 3;
        this.shapeIdx = [0, 3, 4, 5];
        this.shapeType = "ShapeA";
        this.shapeArr = create2DArray(this.rows, this.cols, this.color);
        this.setShapeInfo();
    }

    getShape(){
        return "L";
    }

    setShapeInfo(){
        for(var i=0; i<this.shapeIdx.length; i++){
            var row = parseInt((this.shapeIdx[i]) / this.rows);
            var col =(this.shapeIdx[i]) % this.rows;

            this.shapeArr[row][col].status = true;
            this.shapeArr[row][col].color = this.color;
        }
    }

    drawShape(ctx, startX, startY){
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    console.log("zzz", startX , c, this.width);
                    ctx.beginPath();
                    ctx.rect(startX + c * this.width, startY + r * this.height, this.width, this.height);
                    ctx.fillStyle=this.color;
                    ctx.fill();
                    ctx.strokeStyle="black";
                    ctx.stroke();
                    ctx.closePath();            
                }
            }
        }    
    }
}

// class ShapeA2 extends Shape{ //L 반대
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;
//         this.color = color;
//         this.rows = 3;
//         this.cols = 3;
//         this.shapeIdx = [2, 3, 4, 5];
//         this.shapeType = "ShapeA2";        
//         this.shapeArr = create2DArray(this.rows, this.cols, color);
//     }

//     getShape(){
//         return "L 반대";
//     }
// }

// class ShapeB extends Shape{ //ㅗ
//     rows = 3;
//     cols = 3;
    
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;
        
//         this.color = color;
//         this.rows = 3;
//         this.cols = 3;
//         this.shapeIdx = [1, 3, 4, 5];
//         this.shapeType = "ShapeB";        
//         this.shapeArr = create2DArray(this.rows, this.cols, this.color);
//     }

//     getShape(){
//         return "ㅗ";
//     }
    

    
// }

// class ShapeC extends Shape{ //ㅁ
    
    
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;
//         this.color = color;
//         this.rows = 2;
//         this.cols = 2;
//         this.shapeIdx = [0, 1, 2, 3];
//         this.shapeType = "ShapeC";        
//         this.shapeArr = create2DArray(this.rows, this.cols, this.color);
//     }

//     getShape(){
//         return "ㅁ";
//     }
// }

// class ShapeD extends Shape{ //z
    
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;
//         this.color = color;    
//         this.rows = 3;
//         this.cols = 3;
//         this.shapeIdx = [0, 1, 4, 5];
//         this.shapeType = "ShapeD";        
//         this.shapeArr = create2DArray(this.rows, this.cols, this.color);
//     }

//     getShape(){
//         return "z";
//     }
    


    
// }

// class ShapeD2 extends Shape{ //z    
    
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;        
//         this.color = color;
//         this.rows = 3;
//         this.cols = 3;
//         this.shapeIdx = [1, 2, 3, 4];
//         this.shapeType = "ShapeD2";        
//         this.shapeArr = create2DArray(this.rows, this.cols, this.color);
//     }

//     getShape(){
//         return "z 반대";
//     }
    


    
// }

// class ShapeE extends Shape{ //l
    
    
//     constructor(color, width, height){
//         this.width = width;
//         this.height = height;
//         this.color = color;
//         this.rows = 4;
//         this.cols = 4;
//         this.shapeIdx = [1, 5, 9, 13];
//         this.shapeType = "ShapeE";
//         this.shapeArr = create2DArray(this.rows, this.cols, this.color);
//     }

//     getShape(){
//         return "l";
//     }
// }


class FieldShape {
    
    constructor(ctx, brickShape, width, height){
        this.ctx = ctx;
        this.baseBgColor = "white";
        this.componentWidth = width;
        this.componentHeight = height;
        this.widthCnt = 11;
        this.heightCnt = 25;
        this.brickShape = brickShape;

        this.shapeArr = create2DArray(this.heightCnt, this.widthCnt, this.baseBgColor);        
        this.updating = false;

        this.originCnt = {colCnt : parseInt(this.widthCnt / 2), rowCnt: 0};
        this.colCnt = this.originCnt.colCnt;
        this.rowCnt = this.originCnt.rowCnt;

        this.initFieldArr();
    }

    
    drawBrick(posInfo){
        this.ctx.beginPath();
        this.ctx.rect(posInfo.x, posInfo.y, this.componentBrickWidth, this.componentBrickHeight);
        this.ctx.fillStyle=posInfo.color;
        this.ctx.fill();
        this.ctx.strokeStyle="black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    initializeBrickInfo(posX, posY){
        this.drawPosX = posX;
        this.drawPosY = posY;

        this.width = this.componentBrickWidth * this.widthCnt;
        this.height = this.componentBrickHeight * this.heightCnt;
    }

    initFieldArr(){
        for(var r=0; r<this.heightCnt; r++){
            for(var c=0; c<this.widthCnt; c++){
                // this.shapeArr[r][c].x = c * this.brick.shape.componentBrickWidth + this.drawPosX;
                // this.shapeArr[r][c].y = r * this.brick.shape.componentBrickHeight + this.drawPosY;
                this.shapeArr[r][c].status = false;
                this.shapeArr[r][c].color = this.baseBgColor;
            }
        }
    }

    drawField(){        
        for(var r=0; r<this.heightCnt; r++){            
            for(var c=0; c<this.widthCnt; c++){
                ctx.beginPath();
                ctx.rect(this.drawPosX + c * this.componentWidth, this.drawPosY + r * this.componentHeight, this.componentWidth, this.componentHeight);
                ctx.fillStyle=this.shapeArr[r][c].color;
                ctx.fill();
                ctx.strokeStyle="black";
                ctx.stroke();
                ctx.closePath(); 
            }
        }
    }

    drawMoveShape(){
        this.brickShape.drawBrickShape(this.drawPosX + this.colCnt * this.componentWidth,
                                    this.drawPosY  + this.rowCnt * this.componentHeight);
    }

    update(){
        
        this.updating = true;
        

        var fillCnt = [];
        for(var r=0; r<this.brickShape.shape.rows; r++){
            
            for(var c=0; c<this.brickShape.shape.cols; c++){
                var row = this.rowCnt + r;
                var col = this.colCnt + c;
                if(row >= 0 && row < this.heightCnt
                        && col >=0 && col < this.widthCnt
                        && this.brickShape.shape.shapeArr[r][c].status)
                    this.shapeArr[row][col] = deepCopy(this.brickShape.shape.shapeArr[r][c]);
            }
            
        }        

        // for(var r=0; r<this.heightCnt; r++){
        //     var rowFill = true;
        //     for(var c=0; c<this.widthCnt; c++){                
        //         if(!this.shapeArr[r][c].status){
        //             rowFill = rowFill && false;
        //         }
        //     }
        //     if(rowFill){
        //         fillCnt.push(r);
        //     }
        // }
        // console.log(fillCnt);
        // if(fillCnt.length > 0){
            
        //     this.fillField(fillCnt);
        // }
        
        // this.updating = false;
    }

    fillField(fillCnt){
        var moveCnt = 0;
        for(var r= this.heightCnt - 1; r >= 0; r--){
            if(fillCnt.includes(r)){
                moveCnt += 1;
                continue;
            }

            if(moveCnt > 0){
                for(var c=0; c<this.widthCnt; c++){                    
                    this.shapeArr[r + moveCnt][c].status = this.shapeArr[r][c].status;
                    this.shapeArr[r + moveCnt][c].color = this.shapeArr[r][c].color;

                    this.shapeArr[r][c].status = false;
                    this.shapeArr[r][c].color = this.baseBgColor;
                }
            }
        }
    }
    downMoveShape(){
        this.brickShape.moveDownBrickShape();
        this.rowCnt += 1;
    }

    getUpdateStatus(){
        return this.updating = 0;
    }

    resetBrickShape(){
        this.brickShape.resetBrickShape();
    }

    collisionDetection(command){
        console.log(this.shapeArr);
        for(var r=0; r<this.brickShape.shape.rows; r++){
            var fieldRow = this.rowCnt;
            var fieldCol = this.colCnt;

            for(var c=0; c<this.brickShape.shape.cols; c++){
                if( this.brickShape.shape.shapeArr[r][c].status){
                    var realCol = fieldCol + c;                                        
                    var realRow = fieldRow + r;
                    if(command == "left"){                                
                        
                        if(realCol - 1 < 0 || this.shapeArr[realRow][realCol -1].status){                            
                            return true;
                        }
                    }else if(command == "right"){
                        if(realCol + 1 > this.shapeArr[0].length - 1 || this.shapeArr[realRow][realCol+1].status)
                            return true;
                    }else if(command == "down"){
                        console.log(realRow+1, realCol);
                        if(realRow + 1 > this.shapeArr.length - 1 || this.shapeArr[realRow+1][realCol].status)
                            return true;
                    }else if(command == "rotate"){                                                
                        //미래의 좌표
                        
                        if(this.brickShape.shape.rows-1-r + this.colCnt <= -1){ //좌 충돌                             
                            if(-1 - (this.brickShape.shape.rows-1-r + this.colCnt) > 1){
                                return true;
                            }
                            
                            this.moveRightBrickShape();
                        }else if(this.brickShape.shape.rows-1-r + this.colCnt >= this.brickShape.shape.shapeArr[0].length){ //우 충돌                            
                            
                            if(this.brickShape.shape.rows-1-r + this.colCnt -  this.brickShape.shape.shapeArr[0].length >= 1){
                                return true;
                            }
                            
                            this.moveLeftBrickShape();
                        }else if(fieldRow + c > this.brickShape.shape.shapeArr.length - 1 || this.brickShape.shape.shapeArr[fieldRow + c][this.brickShape.shape.rows-1-r + this.colCnt].status){ //하단 충돌
                            return true;
                        }
                        
                    }
                }
            }
        }
        console.log("-------------------");

        return false;        
    }

    

    clearArea(){
        this.ctx.clearRect(this.drawPosX, this.drawPosY, this.width, this.height);
    }
}

class GameController{
    constructor(ctx){ 
        // this.shapeTypeIdx = ["shapeA", "shapeA2", "shapeB", "shapeC", "shapeD", "shapeD2", "shapeE"];
        
        this.playShapeComponentWidth = 30;
        this.playShapeComponentHeight = 30;        

        
        this.playBrickShape = new BrickShape(ctx, this.playShapeComponentWidth, this.playShapeComponentHeight);
        this.field = new FieldShape(ctx, this.playBrickShape, this.playShapeComponentWidth, this.playShapeComponentHeight);
        this.field.initializeBrickInfo(0, 0);
    }

    start(){
        game.update();
    }

    update(){
        this.field.clearArea();
        this.field.drawField();

        if(this.field.collisionDetection("down")){ //충돌감지.
            this.field.update();
            this.field.drawField();
            this.field.resetBrickShape();
        }else{//충돌 감지 X
            this.field.downMoveShape();
        }

        this.field.drawMoveShape();

        setTimeout(function(){game.update()}, 1000);
    }
}