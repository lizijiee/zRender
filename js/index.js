let btn = document.getElementsByClassName("btn-list")[0];
let data = [
  { line: "线段" },
  { rect: "矩形" },
  { circle: "圆形" },
  { arc: "弧形" },
];

for (obj of data) {
  let newChild = document.createElement("button");
  newChild.innerHTML = Object.values(obj)[0];
  newChild.className = Object.keys(obj)[0];
  if (Object.keys(obj)[0] === "arc") {
    newChild.disabled = true;
  }
  newChild.onclick = click.bind(null, obj);
  btn.append(newChild);
}

let zr = zrender.init(document.getElementById("container"));

/* 绘制一个矩形 */
let rectShape = {};
let boundingRect;

function mouseDownAndMove(event) {
  rectShape.x = event.offsetX;
  rectShape.y = event.offsetY;
  drawRect();
  zr.add(boundingRect);
  zr.on("mousemove", handleMouseMove);
}
function handleMouseMove(ev) {
  rectShape.width = ev.offsetX - rectShape.x;
  rectShape.height = ev.offsetY - rectShape.y;
  boundingRect.setShape(rectShape);
}
function drawRect() {
  boundingRect = new zrender.Rect({
    shape: rectShape, // 形状
    // draggable:true,
    style: {
      fill: "none",
      lineWidth: 1, // 边框宽度
      stroke: "black",
    },
  });
  zr.on("mousedown", mouseDownAndMove);
  zr.on("mouseup", function (ev) {
    zr.off("mousemove", handleMouseMove);
    rectShape = {};
  });
}

/* 绘制一个圆 */
let circleShape = {};
let boundingCircle;
// zr.add(circle);
function circleMouseDownAndMove(event) {
  circleShape.cx = event.offsetX;
  circleShape.cy = event.offsetY;
  drawCircle();
  zr.add(boundingCircle);
  zr.on("mousemove", handleCircleMouseMove);
}
function handleCircleMouseMove(ev) {
  w = ev.offsetX - circleShape.cx;
  h = ev.offsetY - circleShape.cy;
  r = Math.sqrt(w * w + h * h);
  circleShape.r = r;
  boundingCircle.setShape(circleShape);
}

function drawCircle() {
  boundingCircle = new zrender.Circle({
    // shape: {
    //   cx: 366,
    //   cy: 366,
    //   r: 50,
    // },
    shape: circleShape,
    style: {
      fill: "none",
      stroke: "#eeaa45",
      lineWidth: 2,
    },
  });
  zr.on("mousedown", circleMouseDownAndMove);
  zr.on("mouseup", function () {
    zr.off("mousemove", handleCircleMouseMove);
    circleShape = {};
  });
}
/* 绘制一条直线 */
let lineShape = {};
let boundingLine;
function lineMouseDownAndMove(event) {
  lineShape.x1 = event.offsetX;
  lineShape.y1 = event.offsetY;
  lineShape.x2 = event.offsetX;
  lineShape.y2 = event.offsetY;
  drawLine();
  zr.add(boundingLine);
  zr.on("mousemove", handleLineMouseMove);
}
function handleLineMouseMove(ev) {
  lineShape.x2 = ev.offsetX;
  lineShape.y2 = ev.offsetY;
  boundingLine.setShape(lineShape);
}

function drawLine() {
  boundingLine = new zrender.Line({
    shape: lineShape,
  });

  zr.on("mousedown", lineMouseDownAndMove);
  zr.on("mouseup", function () {
    zr.off("mousemove", handleLineMouseMove);
    lineShape = {};
  });
}

function click(obj) {
  let key = Object.keys(obj)[0];
  onMessage(key);
}
function setDisabled(className) {
  let list = document.getElementsByClassName("btn-list")[0].childNodes;
  for (let i = 0; i < list.length; i++) {
    if (list[i].nodeType === 1) {
      if (list[i].className === className) {
        setTimeout(function () {
          document.getElementsByClassName(className)[0].disabled = true;
        }, 0);
      }
      if (list[i].className !== "arc") {
        list[i].disabled = false;
      }
    }
  }
}
onMessage = (event, data) => {
  switch (event) {
    case "line":
      zr.off("mousedown", circleMouseDownAndMove);
      zr.off("mousedown", mouseDownAndMove);
      drawLine();
      setDisabled("line");
      break;
    case "rect":
      zr.off("mousedown", circleMouseDownAndMove);
      zr.off("mousedown", lineMouseDownAndMove);
      drawRect();
      setDisabled("rect");
      break;
    case "circle":
      zr.off("mousedown", mouseDownAndMove);
      zr.off("mousedown", lineMouseDownAndMove);
      drawCircle();
      setDisabled("circle");
      break;
    case "arc":
      console.log("arc");
      break;

    default:
      break;
  }
};
