let optionsCont = document.querySelector(".options-cont");
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
    iconElem.classList.remove("fa-times")
    iconElem.classList.add("fa-bars")
}

function closeTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars")
    iconElem.classList.add("fa-times")
}
