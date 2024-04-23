let magnetX = innerWidth / 2, magnetY = innerHeight / 2, 
    r = Math.floor(255 * Math.random()), rDir = Math.ceil(Math.random() * 5), 
    g = Math.floor(255 * Math.random()), gDir = Math.ceil(Math.random() * 5), 
    b = Math.floor(255 * Math.random()), bDir = Math.ceil(Math.random() * 5), 
    controlScale = 0;		//control point distance from the mouse position
    frozen = 0, 				//0 or 1, determining if the grid is locked
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
document.addEventListener('mousedown', toggleMagnetLock);

function moveMagnet(e) {
  if (e.changedTouches) {
    e.preventDefault();
    e = e.touches[0];
  }

  if (!frozen) {
    magnetX = e.touches ? e.touches[0].clientX : e.clientX;
    magnetY = e.touches ? e.touches[0].clientY : e.clientY;
  }
}

function toggleMagnetLock() {
  if (frozen) {
    frozen = 0;
  } else {
    frozen = 1;
  }
}

let currentTime = Date.now();

function draw(){
  let frameTime = Date.now();

  if (frameTime - currentTime < 16) {
    window.requestAnimationFrame(draw);
    return;
  }

  frameTime = currentTime;

  ctx.clearRect(0,0,innerWidth,innerHeight);
  
  let gridGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight);
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