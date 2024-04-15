var mouseX = innerWidth / 2, mouseY = innerHeight / 2, 
    r = Math.floor(255 * Math.random()), rDir = Math.ceil(Math.random() * 5), 
    g = Math.floor(255 * Math.random()), gDir = Math.ceil(Math.random() * 5), 
    b = Math.floor(255 * Math.random()), bDir = Math.ceil(Math.random() * 5), 
    controlScale = 0;		//control point distance from the mouse position
    frozen = 0, 				//0 or 1, determining if the grid is locked
    gridSize = 10;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = function(){
  canvas.width = innerWidth;
	canvas.height = innerHeight;
  mouseX = innerWidth / 2; 
  mouseY = innerHeight / 2
};

document.addEventListener('mousemove', function(e){
  if (!frozen) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

document.addEventListener('click', function(){
  if (frozen) {
    frozen = 0;
  } else {
    frozen = 1;
  }
});

function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  
  var gridGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight);
  gridGrad.addColorStop(0, 'rgb(' + r + ',255,255)');
  gridGrad.addColorStop(0.33, 'rgb(255,' + g + ',255)');
  gridGrad.addColorStop(0.66, 'rgb(255,255,' + b + ')');
  gridGrad.addColorStop(1, 'rgb(' + r + ',' + g + ',' + b + ')');
  
  if (r + rDir <= 255 && r + rDir >= 0) {
    r += rDir;
  } else {
    rDir *= -1;
  }
  if (g + gDir <= 255 && g + gDir >= 0) {
    g += gDir;
  } else {
    gDir *= -1;
  }
  if (b + bDir <= 255 && b + bDir >= 0) {
    b += bDir;
  } else {
    bDir *= -1;
  }
  
  ctx.strokeStyle = gridGrad;
  for (var i = 0 - innerWidth * 3; i < innerWidth * 4; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.bezierCurveTo(mouseX - controlScale, mouseY, mouseX + controlScale, mouseY, i, innerHeight);
    ctx.stroke();
  }
  for (var j = 0 - innerHeight * 3; j < innerHeight * 4; j += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0,j);
    ctx.bezierCurveTo(mouseX, mouseY - controlScale, mouseX, mouseY + controlScale, innerWidth, j);
    ctx.stroke();
  }
  window.requestAnimationFrame(draw);
}

draw();