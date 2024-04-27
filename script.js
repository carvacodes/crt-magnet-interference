let magnetX = innerWidth / 2, magnetY = innerHeight / 2, 
    r = Math.floor(255 * Math.random()), 
    g = Math.floor(255 * Math.random()), 
    b = Math.floor(255 * Math.random()), 
    controlScale = 0;		//control point distance from the mouse position
    gridSize = 10;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = function(){
  canvas.width = innerWidth;
	canvas.height = innerHeight;
  magnetX = innerWidth / 2; 
  magnetY = innerHeight / 2
};

document.addEventListener('mousemove', moveMagnet);
document.addEventListener('touchmove', moveMagnet, {passive: false});
document.addEventListener('click', refreshColors);

function moveMagnet(e) {
  if (e.changedTouches) {
    e.preventDefault();
    e = e.touches[0];
  }

  magnetX = e.touches ? e.touches[0].clientX : e.clientX;
  if (magnetX < 0) { magnetX = 0; }
  if (magnetX > canvas.width) { magnetX = canvas.width }
  magnetY = e.touches ? e.touches[0].clientY : e.clientY;
  if (magnetY < 0) { magnetY = 0; }
  if (magnetY > canvas.height) { magnetY = canvas.height }
}

function refreshColors() {
  let newGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight);

  r = Math.floor(255 * Math.random());
  g = Math.floor(255 * Math.random());
  b = Math.floor(255 * Math.random());

  newGrad.addColorStop(0, 'rgb(' + r + ',255,255)');
  newGrad.addColorStop(0.33, 'rgb(255,' + g + ',255)');
  newGrad.addColorStop(0.66, 'rgb(255,255,' + b + ')');
  newGrad.addColorStop(1, 'rgb(' + r + ',' + g + ',' + b + ')');

  gridGrad = newGrad;
}

let currentTime = Date.now();

let gridGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight); 

gridGrad.addColorStop(0, 'rgb(' + r + ',255,255)');
gridGrad.addColorStop(0.33, 'rgb(255,' + g + ',255)');
gridGrad.addColorStop(0.66, 'rgb(255,255,' + b + ')');
gridGrad.addColorStop(1, 'rgb(' + r + ',' + g + ',' + b + ')');

function draw(){
  let frameTime = Date.now();
  
  if (frameTime - currentTime < 16) {
    window.requestAnimationFrame(draw);
    return;
  }
  
  frameTime = currentTime;
  
  ctx.clearRect(0,0,innerWidth,innerHeight);
  
  ctx.strokeStyle = gridGrad;
  for (let i = 0 - innerWidth * 3; i < innerWidth * 4; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.bezierCurveTo(magnetX - controlScale, magnetY, magnetX + controlScale, magnetY, i, innerHeight);
    ctx.stroke();
  }
  for (let j = 0 - innerHeight * 3; j < innerHeight * 4; j += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0,j);
    ctx.bezierCurveTo(magnetX, magnetY - controlScale, magnetX, magnetY + controlScale, innerWidth, j);
    ctx.stroke();
  }
  window.requestAnimationFrame(draw);
}

window.addEventListener('load', function (){
  draw();
});