let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;//Set Canvas Height and width
canvas.height = window.innerHeight;

//Canvas Basics
let tool = canvas.getContext("2d");//Canvas API to draw the graphics in our canvas/page, it includes lot of of functions related to canvas
tool.beginPath();//Start writing on the canvas
tool.moveTo(10,10);//Start point from where you will start writing
tool.lineTo(100,150);//End point till where you will start writing from the start point
tool.strokeStyle = "red";//line color
tool.lineWidth = "8";//Width of thr line
tool.stroke();//It will make a line from startpoint to endpoint

//Continue with the existing path
tool.moveTo(100,150);
tool.lineTo(257,210);
tool.lineWidth = "8";
tool.stroke();

// To make a new Path
tool.beginPath();
tool.moveTo(5,90);
tool.lineTo(100,550);
tool.strokeStyle = "blue";
tool.lineWidth = "8";
tool.stroke();