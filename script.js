/*********************************/
/*                               */
/*            Globals            */
/*                               */
/*********************************/

let r = Math.floor(255 * Math.random()), // variables used to set random colors for gradients
    g = Math.floor(255 * Math.random()), // variables used to set random colors for gradients
    b = Math.floor(255 * Math.random()), // variables used to set random colors for gradients
    gridSize = 25,                       // the spacing of lines
    motionBlur = 1,                      // the speed with which the canvas clears every frame
    additionalAnimationCallbacks = 1 / motionBlur;    // allows for requestAnimationFrame to be run exactly until the screen is fully cleared

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// set up the initial canvas gradient
let gridGrad = ctx.createLinearGradient(0, 0, innerWidth, innerHeight); 

gridGrad.addColorStop(0, 'rgb(' + r + ',255,255)');
gridGrad.addColorStop(0.33, 'rgb(255,' + g + ',255)');
gridGrad.addColorStop(0.66, 'rgb(255,255,' + b + ')');
gridGrad.addColorStop(1, 'rgb(' + r + ',' + g + ',' + b + ')');

// control points
let cpLat1 = {fixed: false, x: innerWidth / 2, y: innerHeight / 2};
let cpLat2 = {fixed: false, x: innerWidth / 2, y: innerHeight / 2};
let cpLon1 = {fixed: false, x: innerWidth / 2, y: innerHeight / 2};
let cpLon2 = {fixed: false, x: innerWidth / 2, y: innerHeight / 2};

// this control point map makes for easier updating and point indicator drawing later
let cpMap = new Map();
cpMap.set('1', cpLat1);
cpMap.set('2', cpLat2);
cpMap.set('3', cpLon1);
cpMap.set('4', cpLon2);

// DOM elements
let gridSizeInput = document.getElementById('gridSizeInput');

/*********************************/
/*                               */
/*           Listeners           */
/*                               */
/*********************************/

window.onresize = function(){
  canvas.width = innerWidth;
	canvas.height = innerHeight;
};

document.addEventListener('mousemove', moveHandler);
document.addEventListener('touchmove', moveHandler, {passive: false});
document.addEventListener('click', clickHandler);
document.addEventListener('click', clickHandler, {passive: false});

/********************************/
/*                              */
/*           Handlers           */
/*                              */
/********************************/

// this function ensures that the event used by each handler is the correct one depending on the type of event that triggered the callback
// e.g., touch events automatically use event.changedTouches[0], while mouse events can just use the event
// all touch events also preventDefault() to avoid page scrolling
function getEvent(e) {
  let event;
  if (e.changedTouches) {
    event = e.changedTouches[0];
  } else {
    event = e;
  }
  return event;
}

// handle touch and mouse movement
function moveHandler(e) {
  let event = getEvent(e);
  if (e.target.tagName == 'INPUT') {
    handleInputChange(event);
  } else {
    updateControlPoints(event);
  }
}

function handleInputChange(e) {
  // the first conditional targets mouse events specifically
  if (e.buttons) {
    // if not holding down the primary mouse button, exit
    if (e.buttons != 1) {
      return;
    }
  }

  // at this point, anything left is either a touch or a mouse moving an input; update the input
  gridSize = Number(gridSizeInput.value);
}

function clickHandler(e) {
  let event = getEvent(e);
  if (event.target.tagName != 'CANVAS') {
    handleMenuInteraction(e);
    return;
  }
  // if clicking on the canvas, update the next fixed point and refresh the gradient  
  updateFixedControlPoints(event);
  updateControlPoints(event);
  refreshColors();
}

/*********************************/
/*                               */
/*           Functions           */
/*                               */
/*********************************/

// as on the tin: handles the user clicking the menu bar
function handleMenuInteraction(e) {
  let target = e.target;
  if (e.target.classList.contains('settings-header') || e.target.parentElement.classList.contains('settings-header')) {
    toggleMenu();
  }
}

// a more discrete version of classList.toggle()
function toggleMenu() {
  if (settingsDrawer.classList.contains('collapsed')) {
    settingsDrawer.classList.add('expanded');
    settingsDrawer.classList.remove('collapsed');
  } else {
    settingsDrawer.classList.remove('expanded');
    settingsDrawer.classList.add('collapsed');
  }
}

function updateFixedControlPoints(e) {
  for (let i = 1; i < 5; i++) {
    let p = cpMap.get(i.toString());
    // check if a control point is near the click destination, and remove it if so
    if (Math.abs(p.x - e.clientX) <= 8 && Math.abs(p.y - e.clientY) <= 8 && p.fixed) {
      console.log(`resetting anchor ${i}`);
      p.fixed = false;
      p.x = e.clientX;
      p.y = e.clientY;
      return;   // return immediately from here; no need to check other points in this case
    } else if (p.fixed) {
      // the current point is already fixed; continue to the next
      continue;
    } else {
      console.log(`setting anchor at ${e.clientX}, ${e.clientY}`);
      p.fixed = true;
      p.x = e.clientX;
      p.y = e.clientY;
      return;
    }
  }
  // at the end of the array and the user clicked off all points; reset them
  cpLat1.fixed = false;
  cpLat2.fixed = false;
  cpLon1.fixed = false;
  cpLon2.fixed = false;
  return;   // again, no need to continue the loop
}

function updateControlPoints(e) {
  // move only the control points that are not fixed
  cpLat1.x = cpLat1.fixed ? cpLat1.x : e.clientX;
  cpLat1.y = cpLat1.fixed ? cpLat1.y : e.clientY;
  cpLat2.x = cpLat2.fixed ? cpLat2.x : e.clientX;
  cpLat2.y = cpLat2.fixed ? cpLat2.y : e.clientY;

  cpLon1.x = cpLon1.fixed ? cpLon1.x : e.clientX;
  cpLon1.y = cpLon1.fixed ? cpLon1.y : e.clientY;
  cpLon2.x = cpLon2.fixed ? cpLon2.x : e.clientX;
  cpLon2.y = cpLon2.fixed ? cpLon2.y : e.clientY;
}

// creates a new gradient
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

// draws numbered circles at each bezier anchor point
function drawBezierAnchorPoints() {
  ctx.font = "12px sans-serif";
  cpMap.forEach((p, k) => {
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.beginPath();
    if (!p.fixed) { return; }
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText(k, p.x - 4, p.y + 4);
  });
}

function draw(){
  window.requestAnimationFrame(draw);

  ctx.clearRect(0,0,innerWidth,innerHeight);

  // load up the current gradient
  ctx.strokeStyle = gridGrad;

  // draw longitudinal (horizontal) curves
  ctx.beginPath();
  for (let i = 0 - innerWidth * 3; i < innerWidth * 4; i += gridSize) {
    ctx.moveTo(i,0);
    ctx.bezierCurveTo(cpLat1.x, cpLat1.y, cpLat2.x, cpLat2.y, i, innerHeight);
  }
  ctx.stroke();

  // draw latitudinal (vertical) curves
  ctx.beginPath();
  for (let j = 0 - innerHeight * 3; j < innerHeight * 4; j += gridSize) {
    ctx.moveTo(0,j);
    ctx.bezierCurveTo(cpLon1.x, cpLon1.y, cpLon2.x, cpLon2.y, innerWidth, j);
  }
  ctx.stroke();

  // draw any anchor points that have been fixed by the user
  drawBezierAnchorPoints();
}

window.addEventListener('load', ()=>{
  draw();
})