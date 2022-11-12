// const { Socket } = require("socket.io");

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

//---------------------------------------START THE CODE FROM HERE-----------------------------------------------//
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// API
let tool = canvas.getContext("2d");

window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  redraw();
});

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //Data
let removedPoints=[];
let track = 0; // Represent which action from tracker array

let isPenDown = false;

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  let top = canvas.getBoundingClientRect();
  let x = e.clientX;
  let y = e.clientY - top;
  let data = {
    x: x,
    y: y,
    id: "md", //mouseDown,
    color: tool.strokeStyle(),
    width: tool.lineWidth(),
  };
  undoRedoTracker.push(data);
  tool.beginPath();
  tool.moveTo(x, y);
  // send data to server
  socket.emit("onmousedown", data);
});
canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let top = canvas.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY - top;
    let data = {
      x: x,
      y: y,
      id: mm, //mouseMove
      color: tool.strokeStyle,
      width: tool.lineWidth,
    };
    undoRedoTracker.push(data);
    tool.lineTo(x, y);
    tool.stroke();
    socket.emit("onmousemove", data);
  }
});
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
  tool.closePath();
  // let url = canvas.toDataURL();
  // undoRedoTracker.push(url);
  // track = undoRedoTracker.length - 1;
});

//undo
undo.addEventListener("click", function () {
  undoPoints();
});

//redo
redo.addEventListener("click", function () {
  redoPoints();
});

// function undoRedoCanvas(trackObj) {
//   track = trackObj.trackValue;
//   undoRedoTracker = trackObj.undoRedoTracker;

//   let url = undoRedoTracker[track];
//   let img = new Image(); // new image reference element
//   img.src = url;
//   img.onload = (e) => {
//     tool.drawImage(img, 0, 0, canvas.width, canvas.height);
//   };
// }

function redraw() {
  for (let i = 0; i < points.length; i++) {
    let point = undoRedoTracker[i];
    tool.lineWidth = point.width;
    tool.strokeStyle = point.color;
    if (point.id == "md") {
      tool.beginPath();
      tool.moveTo(point.x, point.y);
    } else {
      tool.lineTo(point.x, point.y);
      tool.stroke();
    }
  }
  tool.strokeStyle = penColor;
  tool.lineWidth = penWidth;

  console.log("calling redraw");
  socket.emit("redraw", points);
}

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth;
});
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});
eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

socket.on("onmousedown", function (point) {
  // logic
  let { x, y, width, color } = point;
  tool.lineWidth = width;
  tool.strokeStyle = color;
  tool.beginPath();
  tool.moveTo(x, y);
});

socket.on("onmousemove", function (point) {
  //logic
  let { x, y, width, color } = point;
  tool.lineWidth = width;
  tool.strokeStyle = color;
  tool.lineTo(x, y);
  tool.stroke();
});

socket.on("redraw", (points) => {
  console.log("redraw reached");
  tool.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < undoRedoTracker.length; i++) {
    let point = undoRedoTracker[i];
    tool.lineWidth = point.width;
    tool.strokeStyle = point.color;
    if (point.id == "md") {
      tool.beginPath();
      tool.moveTo(point.x, point.y);
    } else {
      tool.lineTo(point.x, point.y);
      tool.stroke();
    }
  }
  tool.strokeStyle = penColor;
  tool.lineWidth = penWidth;
});


function undoPoints() {
  //1. remove the last line from db
  let lastRemovedPoints = [];
  let i = undoRedoTracker.length - 1;
  while (i-- >= 0 && undoRedoTracker[i].id != "md") {
    lastRemovedPoints.unshift(undoRedoTracker.pop());
  }
  lastRemovedPoints.unshift(undoRedoTracker.pop()); //to remove the last md
  lastRemovedPoints.push(lastRemovedPoints);

  //2. clear canvas
  tool.clearRect(0, 0, canvas.width, canvas.height);

  //3. redraw the remaining lines
  redraw();
}

function redoPoints() {
  if (removedPoints.length >= 1) {
    //add the last removed points back into the db
    let removedPoint = removedPoints.pop();
    for (let i = 0; i < removedPoint.length; i++) {
      undoRedoTracker.push(removedPoint[i]);
    }
    // 2. clear canvas
    tool.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // 3. redraw points
    redraw();
  }
}
