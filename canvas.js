let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth; //Set Canvas Height and width
canvas.height = window.innerHeight;

//Canvas Basics
// let tool = canvas.getContext("2d");//Canvas API to draw the graphics in our canvas/page, it includes lot of of functions related to canvas
// tool.beginPath();//Start writing on the canvas
// tool.moveTo(10,10);//Start point from where you will start writing
// tool.lineTo(100,150);//End point till where you will start writing from the start point
// tool.strokeStyle = "red";//line color
// tool.lineWidth = "8";//Width of thr line
// tool.stroke();//It will make a line from startpoint to endpoint

// //Continue with the existing path
// tool.moveTo(100,150);
// tool.lineTo(257,210);
// tool.lineWidth = "8";
// tool.stroke();

// // To make a new Path
// tool.beginPath();
// tool.moveTo(5,90);
// tool.lineTo(100,550);
// tool.strokeStyle = "blue";
// tool.lineWidth = "8";
// tool.stroke();

let tool = canvas.getContext("2d"); //Canvas API to draw the graphics in our canvas/page, it includes lot of of functions related to canvas
tool.strokeStyle = "red"; //line color
tool.lineWidth = "3"; //Width of thr line
let mousedown = false;

//Mousedown -> Start a new path from where the user clicks on the canvas
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  /*
        clientX -> Means the current point where a user pointed his cursor in X axis
        clientY -> Means the current point where a user pointed his cursor in Y axis
    */
  beginPath({ x: e.clientX, y: e.clientY });
});

canvas.addEventListener("mousemove", (e) => {
  /*
        mousemove -> Fill the graphics/page with line color till where the user is moving its cursor
    */

  //Only color in your canvas/ perfrom mousemovement when your mouse is down
  if (mousedown) {
    drawStroke({ x: e.clientX, y: e.clientY });
  }
});

canvas.addEventListener("mouseup", (e) => {
  mousedown = false;
});

function beginPath(strokeObj) {
  tool.beginPath();
  /*
        clientX -> Means the current point where a user pointed his cursor in X axis
        clientY -> Means the current point where a user pointed his cursor in Y axis
    */
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj){
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}