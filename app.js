/* TO ADD:
    # of Intersections
*/


const svgCanvas = document.getElementById("svg-canvas")
const points = document.querySelectorAll(".point")
const container = document.querySelector(".container")
const containerWidth = container.getBoundingClientRect().width;
const containerHeight = container.getBoundingClientRect().height;

const root = document.documentElement;
const styles = getComputedStyle(root);

const LINE_COLOR = styles.getPropertyValue('--line-color').trim();
const LINE_WIDTH = styles.getPropertyValue('--line-width').trim();
const POINT_SIZE = styles.getPropertyValue('--point-size').trim();

const CIRCLE_RADIUS = 300
const NUMBER_OF_POINTS = 30

let possibleAngles = []
let array = []

document.addEventListener("DOMContentLoaded", onLoad)

function onLoad(){
    generateAngles()
    generateCirlce()
    updateAllLines()
    document.querySelectorAll(".point").forEach(dragElement)
}

function generateAngles(){
    for (let i = 0; i<NUMBER_OF_POINTS; i++){
        possibleAngles.push(i/NUMBER_OF_POINTS * Math.PI * 2)
    }
}

function getAngle(){
    const angleIndex = Math.floor(Math.random() * possibleAngles.length)
    const angle = possibleAngles[angleIndex]
    possibleAngles.splice(angleIndex, 1)
    return angle
}

function generateCirlce(){
    for (let i = 0; i<(NUMBER_OF_POINTS*2); i++){
        if (i%2==0){
            const angle = getAngle()
            const pos = getCenteredXY(Math.cos(angle)*CIRCLE_RADIUS, Math.sin(angle)*CIRCLE_RADIUS)
            point = createPoint(pos.x, pos.y, i)
            container.append(point)
            array.push(point)
        } else{
            line = createLine(i)
            svgCanvas.append(line)
            array.push(line)
        }
    }
}

function updateLinePos(index){
    const container = document.querySelector(".container").getBoundingClientRect();
    var leftElem
    var rightElem

    if (index==-1 || index==array.length-1){
        leftElem = array[array.length-2].getBoundingClientRect();
        rightElem = array[0].getBoundingClientRect();
        index = array.length-1
    } else{
        leftElem = array[index-1].getBoundingClientRect();
        rightElem = array[index+1].getBoundingClientRect();
    }
    
    const x1 = leftElem.left - container.left + (leftElem.width / 2);
    const y1 = leftElem.top - container.top + (leftElem.height / 2);

    const x2 = rightElem.left - container.left + (rightElem.width / 2);
    const y2 = rightElem.top - container.top + (rightElem.height / 2);

    array[index].setAttribute('x1', x1);
    array[index].setAttribute('y1', y1);
    array[index].setAttribute('x2', x2);
    array[index].setAttribute('y2', y2);
}

function updateAllLines(){
    for (let i=0; i<array.length; i++){
        if (array[i].tagName == "line"){
            updateLinePos(i)
        }
    }
}

function createLine(index){
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", LINE_COLOR);
    line.setAttribute("stroke-width", LINE_WIDTH)
    line.setAttribute("index", index)
    return line
}

function createPoint(x, y, index){
    const circle = document.createElement("div")
    circle.setAttribute("id", `div${index}`)
    circle.setAttribute("index", index)
    circle.setAttribute("class", "point")
    circle.setAttribute("style", `top: ${y}px; left: ${x}px; width: ${POINT_SIZE}; height: ${POINT_SIZE};`)
    return circle
}

function getCenteredXY(x,y){
    return {"x": x-(parseInt(POINT_SIZE, 10)/2) + containerWidth/2, "y": y-(parseInt(POINT_SIZE, 10)/2)+containerHeight/2}
}

function xyInRange(x, y){
    let validX = false
    let validY = false
    if (y<containerHeight-parseInt(POINT_SIZE,10)/2 && y>0-parseInt(POINT_SIZE,10)/2){
        validY = true
    }
    if (x<containerWidth-parseInt(POINT_SIZE,10)/2 && x>0-parseInt(POINT_SIZE,10)/2){
        validX = true
    }
    return {"x": validX, "y": validY}
}

function dragElement(elmnt) {
    
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {  
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // set the element's new position:
    const newX = elmnt.offsetLeft - pos1
    const newY = elmnt.offsetTop - pos2
    validPos = xyInRange(newX, newY)

    if (validPos.y){
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }
    if (validPos.x){
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    
    elmntIndex = parseInt(elmnt.getAttribute("index"), 10)
    updateLinePos(elmntIndex-1)
    updateLinePos(elmntIndex+1)
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}