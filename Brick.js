
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
                status: false,
                color: "",
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

    drawBrick(posInfo){        
        this.ctx.beginPath();
        this.ctx.rect(posInfo.x, posInfo.y, this.componentBrickWidth, this.componentBrickHeight);
        this.ctx.fillStyle=posInfo.color;
        this.ctx.fill();
        this.ctx.strokeStyle="black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    

}

class BrickShape extends Shape{    
    
    constructor(ctx, canvas){
        super(ctx);
        this.canvas = canvas;
        // this.shapeArr = create2DArray(this.rows, this.cols);
        this.shapeTypeIdx = ["shapeA", "shapeA2", "shapeB", "shapeC", "shapeD", "shapeD2", "shapeE"];
        this.posX = 0;
        this.posY = 0;
        this.rowCnt = 0;
        this.colCnt = 0;
        this.currentShape = this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)];        
        this.nextShape = this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)];        
    }

    initializeBrickInfo(posX, posY){
        this.posX = posX;
        this.posY = posY;

        this.colCnt = posX / this.componentBrickWidth;
        this.rowCnt = posY / this.componentBrickHeight;
    }
    initDrawBrickShape(){

        if(this.ctx != null){
            var max = 256;
            var red = Math.random() * max;
            var green = Math.random() * max;
            var blue = Math.random() * max;

            this.color = String.format("rgb({0}, {1}, {2})", red, green, blue);
            
            
            this.createShapeObj(this.currentShape);            
            
            this.drawInitBrickShape();
            
            
        }
    }

    createShapeObj(shapeType){        
        if(shapeType == "shapeA"){
            this.shape = new ShapeA();
        }else if(shapeType == "shapeA2"){
            this.shape = new ShapeA2();
        }else if(shapeType == "shapeB"){
            this.shape = new ShapeB();
        }else if(shapeType == "shapeC"){
            this.shape = new ShapeC();
        }else if(shapeType == "shapeD2"){
            this.shape = new ShapeD2();
        }else if(shapeType == "shapeD"){
            this.shape = new ShapeD();
        }else if(shapeType == "shapeE"){
            this.shape = new ShapeE();
        }
    }

    drawInitBrickShape(){
        
        var arr = this.shape.shapeIdx;
        var shapeInfo = this.shape.shapeArr;        
        
        for(var i=0; i<arr.length; i++){
            var row = parseInt((arr[i]) / this.shape.rows);
            var col =(arr[i]) % this.shape.rows;

            shapeInfo[row][col].x = col * this.componentBrickWidth + this.posX;
            shapeInfo[row][col].y = row * this.componentBrickHeight + this.posY;
            shapeInfo[row][col].status = true;
            shapeInfo[row][col].color = this.color;

            this.drawBrick(shapeInfo[row][col]);
            
        }
        
    }

    moveDownBrickShape(){
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].y += this.componentBrickHeight;                    
                }
            }
        }        
        this.rowCnt += 1;
        
    }

    moveLeftBrickShape(){
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].x -= this.componentBrickWidth;                    
                }
            }
        }
        this.colCnt -= 1;
    }

    moveRightBrickShape(){        
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].x += this.componentBrickWidth;                    
                }
            }
        }

        this.colCnt += 1;
    }

    drawBrickShape(){
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){                    
                    this.drawBrick(this.shape.shapeArr[r][c]);
                }
            }
        }
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
    }

    resetBrickShape(){
        this.currentShape = this.nextShape;
        this.nextShape = this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)];

        this.colCnt = this.posX / this.componentBrickWidth;
        this.rowCnt = this.posY / this.componentBrickHeight;
        
        this.createShapeObj(this.currentShape);
    }

    collisionDetection(fieldArr, command){

        for(var r=0; r<this.shape.rows; r++){
            var fieldRow = this.rowCnt;
            var fieldCol = this.colCnt;

            for(var c=0; c<this.shape.cols; c++){
                if( this.shape.shapeArr[r][c].status){
                    var realCol = fieldCol + c;                                        
                    var realRow = fieldRow + r;
                    if(command == "left"){                                
                        
                        if(realCol - 1 < 0 || fieldArr[realRow][realCol -1].status){                            
                            return true;
                        }
                    }else if(command == "right"){
                        if(realCol + 1 > fieldArr[0].length - 1 || fieldArr[realRow][realCol+1].status)
                            return true;
                    }else if(command == "down"){        
                        
                        if(realRow + 1 > fieldArr.length - 1 || fieldArr[realRow+1][realCol].status)
                            return true;
                    }else if(command == "rotate"){                                                
                        //미래의 좌표
                        if(this.shape.rows-1-r + this.colCnt <= -1){ //좌 충돌                            
                            if(-1 - (this.shape.rows-1-r + this.colCnt) > 1){
                                return true;
                            }
                            this.moveRightBrickShape();
                        }else if(this.shape.rows-1-r + this.colCnt >= fieldArr[0].length){ //우 충돌                            
                            if(this.shape.rows-1-r + this.colCnt -  fieldArr[0].length >= 1){
                                return true;
                            }
                            this.moveLeftBrickShape();
                        }else if(fieldRow + c > fieldArr.length - 1 || fieldArr[fieldRow + c][this.shape.rows-1-r + fieldCol].status){ //하단 충돌
                            return true;
                        }
                        
                    }
                }
            }
        }

        return false;        
    }

    getNextShape(){
        return this.nextShape;
    }
}

class ShapeA{ //L
    rows = 3;
    cols = 3;
    
    constructor(){        
        this.shapeIdx = [0, 3, 4, 5];
        this.shapeType = "ShapeA";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "L";
    }
}

class ShapeA2{ //L 반대
    rows = 3;
    cols = 3;
    
    constructor(){        
        this.shapeIdx = [2, 3, 4, 5];
        this.shapeType = "ShapeA2";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "L 반대";
    }
}

class ShapeB{ //ㅗ
    rows = 3;
    cols = 3;
    
    constructor(){        
        this.shapeIdx = [1, 3, 4, 5];
        this.shapeType = "ShapeB";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "ㅗ";
    }
}

class ShapeC{ //ㅁ
    rows = 2;
    cols = 2;
    
    constructor(){        
        this.shapeIdx = [0, 1, 2, 3];
        this.shapeType = "ShapeC";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "ㅁ";
    }
}

class ShapeD{ //z
    rows = 3;
    cols = 3;
    
    constructor(){
        this.shapeIdx = [0, 1, 4, 5];
        this.shapeType = "ShapeD";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "z";
    }
}

class ShapeD2{ //z
    rows = 3;
    cols = 3;
    
    constructor(){
        this.shapeIdx = [1, 2, 3, 4];
        this.shapeType = "ShapeD2";        
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "z";
    }
}

class ShapeE{ //l
    rows = 4;
    cols = 4;
    
    constructor(){        
        this.shapeIdx = [1, 5, 9, 13];
        this.shapeType = "ShapeE";
        this.shapeArr = create2DArray(this.rows, this.cols);
    }

    getShape(){
        return "l";
    }
}


class FieldShape extends Shape{
    baseBgColor = "white"
    constructor(ctx, canvas){
        super(ctx);        
        this.canvas = canvas;
        this.widthCnt = 11;
        this.heightCnt = 25;
        this.width = this.componentBrickWidth * this.widthCnt;
        this.height = this.componentBrickHeight * this.heightCnt;
        this.drawPosX = 0;
        this.drawPosY = 0;
        this.shapeArr = create2DArray(this.heightCnt, this.widthCnt);        
        this.updating = false;
    }

    drawFieldBricks(posX, posY){
        this.drawPosX = posX;
        this.drawPosY = posY;

        for(var r=0; r<this.heightCnt; r++){
            for(var c=0; c<this.widthCnt; c++){
                this.shapeArr[r][c].x = c * this.componentBrickWidth + this.drawPosX;
                this.shapeArr[r][c].y = r * this.componentBrickHeight + this.drawPosY;
                this.shapeArr[r][c].status = false;                
                this.shapeArr[r][c].color = this.baseBgColor;
                
                this.drawBrick(this.shapeArr[r][c], this.baseBgColor);
            }
        }
    }

    redrawFieldBricks(){
        
        for(var r=0; r<this.heightCnt; r++){            
            for(var c=0; c<this.widthCnt; c++){
                this.drawBrick(this.shapeArr[r][c]);
            }
        }
        
    }

    update(brickShapeArr, rowCnt, colCnt){
        this.updating = true;
        
        rowCnt = rowCnt;
        colCnt = colCnt;

        var fillCnt = [];
        for(var r=0; r<brickShapeArr.length; r++){
            
            for(var c=0; c<brickShapeArr[0].length; c++){
                var row = rowCnt + r;
                var col = colCnt + c;
                if(row >= 0 && row < this.shapeArr.length
                        && col >=0 && col < this.shapeArr[0].length
                        && brickShapeArr[r][c].status)
                    this.shapeArr[row][col] = deepCopy(brickShapeArr[r][c]);
            }
            
        }
        
        for(var r=0; r<this.heightCnt; r++){
            var rowFill = true;
            for(var c=0; c<this.widthCnt; c++){                
                if(!this.shapeArr[r][c].status){
                    rowFill = rowFill && false;
                }
            }
            if(rowFill){
                fillCnt.push(r);
            }
        }
        
        if(fillCnt.length > 0)
            this.fillField(fillCnt);
        
        this.updating = false;
    }

    fillField(fillCnt){
        var moveCnt = 0;
        for(var r=this.heightCnt - 1; r >= 0; r--){
            for(var r2=r; r2>=0; r2--){
                if(fillCnt.includes(r2)){
                    moveCnt += 1;
                }else{
                    break;
                }
            }

            if(moveCnt > 0 && r-moveCnt >= 0){
                for(var c=0; c<this.widthCnt; c++){                    
                    this.shapeArr[r][c].status = this.shapeArr[r- moveCnt][c].status;
                    this.shapeArr[r][c].color = this.shapeArr[r- moveCnt][c].color;

                    this.shapeArr[r- moveCnt][c].status = false;
                    this.shapeArr[r- moveCnt][c].color = this.baseBgColor;
                }
            }
        }
        
    }

    getUpdateStatus(){
        return this.updating = 0;
    }
}