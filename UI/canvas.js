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
let mousedown = false;
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let penColor = "red";
let eraserColor = "white";
// let eraserFlag=false;
let penWidth = pencilWidthElem.ariaValueMax;
let eraserWidth = eraserWidthElem.value;
let tool = canvas.getContext("2d"); //Canvas API to draw the graphics in our canvas/page, it includes lot of of functions related to canvas
tool.strokeStyle = penColor; //line color
tool.lineWidth = penWidth; //Width of thr line
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let undoRedoTracker = [];
let track = 0; //1-> redo, 0->undo

//Mousedown -> Start a new path from where the user clicks on the canvas
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  /*
        clientX -> Means the current point where a user pointed his cursor in X axis
        clientY -> Means the current point where a user pointed his cursor in Y axis
    */
  // beginPath({ x: e.clientX, y: e.clientY });
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  /*
        mousemove -> Fill the graphics/page with line color till where the user is moving its cursor
    */

  //Only color in your canvas/ perfrom mousemovement when your mouse is down
  if (mousedown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : penWidth,
    };

    socket.emit("drawStroke", data);
  }
  // drawStroke({
  //   x: e.clientX,
  //   y: e.clientY,
  //   color: eraserFlag ? eraserColor : penColor,
  //   width: eraserFlag ? eraserWidth : penWidth,
  // });
});

canvas.addEventListener("mouseup", (e) => {
  mousedown = false;

  //UndoRedo
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  /*
        clientX -> Means the current point where a user pointed his cursor in X axis
        clientY -> Means the current point where a user pointed his cursor in Y axis
    */
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((color) => {
  color.addEventListener("click", (e) => {
    let colorValue = color.classList[0];
    penColor = colorValue;
    tool.strokeStyle = penColor; //line color
  });
});

pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth; //Width of thr line
});

eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", (e) => {
  eraserFlag!=eraserFlag;
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

// ---------- DOWNLOAD -----------//
download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

// ---------- UNDO REDO -----------//
undo.addEventListener("click", (e) => {
  //For undo do -- in track
  if (track >= 1) track--;

  let data = {
    trackValue: track,
    undoRedoTracker,
  };

  socket.emit("redoUndo",data);
  // undoRedoCanvas(trackObj);
});

redo.addEventListener("click", (e) => {
  //For redo do ++ in track
  if (track < undoRedoTracker.length - 1) track++;

  let trackObj = {
    trackValue: track,
    undoRedoTracker,
  };
  undoRedoCanvas(trackObj);
});

function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image(); // new image reference element
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height); //draw previous data image on the canvas
  };
}

socket.on("beginPath", (data) => {
  //data -> the data coming from serever
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  //data -> the data coming from serever
  drawStroke(data);
});
