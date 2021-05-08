var smallBrickWidth = 20;
var smallBrickheight = 20;

var fieldWidth = 200;
var fieldHeight = 200;

var x = 0;
var y = 0;

var ctx = null;

function settingVar(){
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    x = canvas.width / 2 - fieldWidth / 2;
    y = fieldHeight;
    
    drawGameField();
}

function drawGameField(){
    
    // ctx.beginPath();
    // ctx.lineWidth = 3;
    // ctx.rect(x, y, fieldWidth, fieldHeight);    
    
    // ctx.strokeStyle = 'rgb(0,0, 0)';
    // ctx.stroke();
    // ctx.closePath();

    // ctx.beginPath();
    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    // ctx.stroke();
    // ctx.closePath();
}

settingVar();
