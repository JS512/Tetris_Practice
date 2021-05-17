String.format = function() { let args = arguments; return args[0].replace(/{(\d+)}/g, function(match, num) { num = Number(num) + 1; return typeof(args[num]) != undefined ? args[num] : match; }); }

function deepCopy(o) {
    var result = {};
    if (typeof o === "object" && o !== null)
        for (i in o) result[i] = deepCopy(o[i]);
    else result = o;

    return result;
}

var controlEnum = {
    rotate : 0,
    down    : 1,
    left : 2,    
    right : 3
};

class Shape{    

    constructor(color, shapeIdx, cols, rows){
        this.shapeIdx = shapeIdx;
        this.color = color;
        this.cols = cols;
        this.rows = rows;        
        this.shapeArr = this.create2DArray(rows, cols, color);
        this.setArrayFill();
    }

    draw(ctx, startX, startY){
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                if(this.shapeArr[r][c].status){
                    ctx.beginPath();
                    ctx.rect(startX + c * this.comWidth, startY + r * this.comHeight, this.comWidth, this.comHeight);
                    ctx.fillStyle=this.shapeArr[r][c].color;
                    ctx.fill();
                    ctx.strokeStyle="black";
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    setComponentInfo(width, height){
        this.comWidth = width;
        this.comHeight = height;
    }

    create2DArray(rows, columns, color) {
        var arr = [];
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

    setArrayFill(){
        for(var i=0; i<this.shapeIdx.length; i++){
            var row = parseInt((this.shapeIdx[i]) / this.rows);
            var col =(this.shapeIdx[i]) % this.rows;
            this.shapeArr[row][col].status = true;
        }
    }
}
class ShapeA extends Shape{
    constructor(color, comWidth, comHeight){        
        super(color, [1, 3, 4, 5], 3, 3);
        this.setComponentInfo(comWidth, comHeight);
    }
}

class ShapeContoller{

    constructor(ctx, shape){
        this.ctx = ctx;
        this.shape = shape;
    }

    drawShape(startX, startY){
        this.shape.draw(this.ctx, startX, startY);
    }

    getShape(){
        return this.shape;
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
        
    }

    moveRightBrickShape(){        
        for(var r=0; r<this.shape.rows; r++){
            for(var c=0; c<this.shape.cols; c++){
                if(this.shape.shapeArr[r][c].status){
                    this.shape.shapeArr[r][c].x += this.shape.componentBrickWidth;                    
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

    rotateBrickShape(){
        this.shape.shapeArr = this.rotate_90(this.shape.shapeArr);
    }

    setShape(shape){
        this.shape = shape;
    }

    
}

class PlayField extends Shape{
    constructor(ctx, startX, startY, comWidth, comHeight, shapeController){
        super("white", [], 10, 20);
        this.startX = startX;
        this.startY = startY;
        this.ctx = ctx;
        this.shapeController = shapeController;
        this.rowCnt = -1;
        this.colCnt = parseInt(this.cols / 2) - 1;
        this.setComponentInfo(comWidth, comHeight);
    }

    drawPlayField(){
        
        for(var r=0; r<this.rows; r++){
            for(var c=0; c<this.cols; c++){
                
                this.ctx.beginPath();
                this.ctx.rect(this.startX + c * this.comWidth, this.startY + r * this.comHeight, this.comWidth, this.comHeight);
                this.ctx.fillStyle=this.shapeArr[r][c].color;
                this.ctx.fill();
                this.ctx.strokeStyle="black";
                this.ctx.stroke();
                this.ctx.closePath();
                
            }
        }        
        this.shapeController.drawShape(this.startX + (this.colCnt * this.comWidth), this.startY + (this.rowCnt * this.comHeight));
        
    }

    collisionDetection(command){
        var shape = this.shapeController.getShape();

        for(var r=0; r<shape.rows; r++){
            var fieldRow = this.rowCnt;
            var fieldCol = this.colCnt;

            for(var c=0; c<shape.cols; c++){
                if( shape.shapeArr[r][c].status){
                    var realCol = fieldCol + c;                                        
                    var realRow = fieldRow + r;
                    if(command == controlEnum.left){                                
                        
                        if(realCol - 1 < 0 || this.shapeArr[realRow][realCol -1].status){                            
                            return true;
                        }
                    }else if(command == controlEnum.right){
                        if(realCol + 1 > this.shapeArr[0].length - 1 || this.shapeArr[realRow][realCol+1].status)
                            return true;
                    }else if(command == controlEnum.down){
                        
                        if(realRow + 1 > this.shapeArr.length - 1 || this.shapeArr[realRow+1][realCol].status)
                            return true;
                    }else if(command == controlEnum.rotate){
                        //미래의 좌표
                        
                        if(shape.rows-1-r + this.colCnt <= -1){ //좌 충돌                             
                            if(-1 - (shape.rows-1-r + this.colCnt) > 1){
                                return true;
                            }
                            
                            this.sendCMD(controlEnum.right);
                        }else if(shape.rows-1-r + this.colCnt >= this.shapeArr[0].length){ //우 충돌                            
                            
                            if(shape.rows-1-r + this.colCnt -  this.shapeArr[0].length >= 1){
                                return true;
                            }
                            
                            this.sendCMD(controlEnum.left);
                        }else if(fieldRow + c > this.shapeArr.length - 1 || this.shapeArr[fieldRow + c][shape.rows-1-r + this.colCnt].status){ //하단 충돌
                            return true;
                        }
                        
                    }
                }
            }
        }

        return false;        
    }

    update(){
        
        this.updating = true;
        

        var fillCnt = [];
        var shape = this.shapeController.getShape();
        for(var r=0; r<shape.rows; r++){
            
            for(var c=0; c<shape.cols; c++){
                var row = this.rowCnt + r;
                var col = this.colCnt + c;
                if(row >= 0 && row < this.rows
                        && col >=0 && col < this.cols
                        && shape.shapeArr[r][c].status)
                    this.shapeArr[row][col] = deepCopy(shape.shapeArr[r][c]);
            }
            
        }        

        for(var r=0; r<this.rows; r++){
            var rowFill = true;
            for(var c=0; c<this.cols; c++){                
                if(!this.shapeArr[r][c].status){
                    rowFill = rowFill && false;
                }
            }
            if(rowFill){
                fillCnt.push(r);
            }
        }
        console.log(fillCnt);
        if(fillCnt.length > 0){
            
            this.fillField(fillCnt);
        }
        
        this.updating = false;
    }

    fillField(fillCnt){
        var moveCnt = 0;
        for(var r= this.rows - 1; r >= 0; r--){
            if(fillCnt.includes(r)){
                moveCnt += 1;
                continue;
            }

            if(moveCnt > 0){
                for(var c=0; c<this.cols; c++){                    
                    this.shapeArr[r + moveCnt][c].status = this.shapeArr[r][c].status;
                    this.shapeArr[r + moveCnt][c].color = this.shapeArr[r][c].color;

                    this.shapeArr[r][c].status = false;
                    this.shapeArr[r][c].color = this.color;
                }
            }
        }
    }

    sendCMD(cmd){
        if(!this.collisionDetection(cmd)){
            if(cmd == controlEnum.down){            
                this.shapeController.moveDownBrickShape();
                this.rowCnt += 1;
            }else if(cmd == controlEnum.left){
                this.shapeController.moveLeftBrickShape();
                this.colCnt -= 1;
            }else if(cmd == controlEnum.right){
                this.shapeController.moveRightBrickShape();
                this.colCnt += 1;
            }else if(cmd == controlEnum.rotate){
                this.shapeController.rotateBrickShape();
            }
            return true;
        }else{
            return false;
        }


    }

    clearArea(){
        this.ctx.clearRect(this.startX, this.startY, this.rows * this.comHeight, this.cols * this.comWidth);
    }

    resetShape(shape){
        this.rowCnt = 0;
        this.colCnt = parseInt(this.cols / 2) - 1;
        this.shapeController.setShape(shape);
    }

    gotoEnd(){
        while(this.sendCMD(controlEnum.down)){
            this.shapeController.moveDownBrickShape();
        }
    }
}

class WaitingField extends Shape{
    constructor(ctx){
        this.shapes = [];
    }
}


class PlayContainer{
    constructor(ctx){
        this.shapeTypeIdx = ["shapeA"];
        this.ctx = ctx;
        this.comWidth = 30;
        this.comHeight = 30;

        this.playFieldStartX = 0;
        this.playFieldStartY = 0;

        this.InitializePlayField();
        this.InitializeWaitingField();
    }

    start(){
        this.PlayFieldProcess();
    }

    PlayFieldProcess(){
        this.playField.clearArea();
        

        if(this.playField.collisionDetection(controlEnum.down)){ //충돌감지.
            this.playField.update();
            this.playField.resetShape(this.createRandomShape());
        }else{//충돌 감지 X
            this.playField.sendCMD(controlEnum.down);
        }

        this.playField.drawPlayField();
        setTimeout(function(){game.PlayFieldProcess()}, 1000);
    }

    InitializePlayField(){
        var shape = this.createRandomShape();
        var shapeController = new ShapeContoller(this.ctx, shape);
        this.playField = new PlayField(this.ctx, this.playFieldStartX, this.playFieldStartY, this.comWidth, this.comHeight, shapeController);
    }

    InitializeWaitingField(){

    }

    InputKeyDownConverter(e){
        if (e.keyCode == '38') {
            // up arrow
            
        }
        else if (e.keyCode == '40') {
            // down arrow            
            this.playField.clearArea();

            if(this.playField.collisionDetection(controlEnum.down)){ //충돌감지.
                this.playField.update();
                this.playField.resetShape(this.createRandomShape());
            }else{//충돌 감지 X
                this.playField.sendCMD(controlEnum.down);
            }

            this.playField.drawPlayField();
        }
        else if (e.keyCode == '37') {
            // left arrow
            this.playField.clearArea();
            
            this.playField.sendCMD(controlEnum.left);

            this.playField.drawPlayField();
        }
        else if (e.keyCode == '39') {
            // right arrow                
            this.playField.clearArea();

            this.playField.sendCMD(controlEnum.right);

            this.playField.drawPlayField();
        }
    }

    InputKeyUpConverter(e){
        if (e.keyCode == '38') {
            this.playField.clearArea();
            
            this.playField.sendCMD(controlEnum.rotate);
            
            this.playField.drawPlayField();
        }else if(e.keyCode == '82'){
            //r
            this.playField.gotoEnd();
            this.playField.clearArea();
            
            this.playField.update();
            this.playField.resetShape(this.createRandomShape());

            this.playField.drawPlayField();
        }
    }

    draw(){
        this.playField.drawPlayField();
    }

    sendCommand(cmd){
        this.playField.sendCMD(cmd);
    }

    createRandomShape(){        
        var max = 256;
        var red = Math.random() * max;
        var green = Math.random() * max;
        var blue = Math.random() * max;

        var color = String.format("rgb({0}, {1}, {2})", red, green, blue);

        var playShape = null;
        var shapeType = this.shapeTypeIdx[parseInt(Math.random() * this.shapeTypeIdx.length)]

        if(shapeType == "shapeA"){                        
            playShape = new ShapeA(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeA2"){
            playShape = new ShapeA2(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeB"){
            playShape = new ShapeB(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeC"){
            playShape = new ShapeC(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeD2"){
            playShape = new ShapeD2(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeD"){
            playShape = new ShapeD(color, this.comWidth, this.comHeight);
        }else if(shapeType == "shapeE"){
            playShape = new ShapeE(color, this.comWidth, this.comHeight);
        }

        return playShape;
    }


}