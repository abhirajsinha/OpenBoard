let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let pencilFlag = false;
let eraserFlag = false;
let optionsFlag = true;

optionsCont.addEventListener("click", (e) => {
  //Modify UI
  optionsFlag = !optionsFlag;

  if (optionsFlag) {
    openTools();
  } else {
    closeTools();
  }
});

function openTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  pencilFlag = !pencilFlag;
  //true - show pencil tools
  //false - hide

  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    eraserToolCont.style.display = "flex";
  } else {
    eraserToolCont.style.display = "none";
  }
});

sticky.addEventListener("click", (e) => {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = `   
    <div class="header-cont">
    <div class="minimize"></div>
    <div class="remove"></div>
  </div>
  <div class="note-cont">
    <textarea ></textarea>
  </div> 
    `;

  document.body.append(stickyCont);
  //Drag and drop feature
  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
});

function dragAndDrop(stickyCont, event) {
  let shiftX = event.clientX - stickyCont.getBoundingClientRect().left;
  let shiftY = event.clientY - stickyCont.getBoundingClientRect().top;

  stickyCont.style.position = "absolute";
  stickyCont.style.zIndex = 1000;
  document.body.append(stickyCont);

  moveAt(event.pageX, event.pageY);

  // moves the stickyCont at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    stickyCont.style.left = pageX - shiftX + "px";
    stickyCont.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the stickyCont on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the stickyCont, remove unneeded handlers
  stickyCont.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    stickyCont.onmouseup = null;
  };
}
