let throttle = function (func, delay) {
  var prev = Date.now();
  return function () {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};

let btn = document.getElementsByClassName("btn-list")[0];
let data = [
  // { line: "线段" },
  { rect: "矩形" },
  // { circle: "圆形" },
  // { arc: "弧形" },
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
let group;

function mouseDownAndMove(event) {
  rectShape.x = event.offsetX;
  rectShape.y = event.offsetY;
  drawRect();
  let opt = { x: rectShape.x, y: rectShape.y };
  // drawMark(opt);
  // group.add(boundingRect)
  zr.add(boundingRect);
  zr.on("mousemove", handleMouseMove);
}
function handleMouseMove(ev) {
  rectShape.width = ev.offsetX - rectShape.x;
  rectShape.height = ev.offsetY - rectShape.y;
  boundingRect.setShape(rectShape);
}

function drawMark(opt, rectInfo, pointsInfo, pointGroup) {
  // 放到组里面
  let markMove = false;
  mark = new zrender.Circle({
    style: {
      fill: "transparent",
      stroke: "#1890ff",
    },
    shape: {
      cx: opt.x,
      cy: opt.y,
      r: 4,
    },
    id: "class",
    // hoverable: true,
    draggable: true,
    z: 2,
    onmousedown: (_) => {
      // _.cancelBubble = true;
      console.log("mousedown");
      markMove = true;
      /*     function handlePoint(event) {
            // console.log(, )
            // opt.x=event.offsetX
            // opt.y=event.offsetY
            // mark.setShape(opt)
            boundingCircle.setShape(circleShape);
            rectShape.width = event.offsetX - rectShape.x;
            rectShape.height = event.offsetY - rectShape.y;
            boundingRect.setShape(rectShape);
          } */
      // rectShape.x = _.offsetX;
      // rectShape.y = _.offsetY;
      // zr.on("mousemove", handleMouseMove);
      // zr.on("mousemove", handlePoint);
    },
    onmousemove: (_) => {
      if (markMove) {
        // rectInfo.setShape({
        //   ...rectInfo.shape,
        //   width: _.offsetX - rectInfo.shape.x,
        //   height: _.offsetY - rectInfo.shape.y,
        // });
        console.log(rectInfo.shape);
        // rectInfo.scale = [
        //   (_.offsetX - rectInfo.shape.x) / rectInfo.shape.width,
        //   (_.offsetY - rectInfo.shape.y) / rectInfo.shape.height,
        // ];
        // rectInfo.style.lineWidth = 1;
        // rectInfo.origin = [rectInfo.shape.x, rectInfo.shape.y];
        const { x, y, width: w, height: h } = rectInfo.shape;
        throttle(handle(), 100);
        function handle() {
          boundingRect.setShape({
            x,
            y,
            width: _.offsetX - x,
            height: _.offsetY - y,
          });
        }
      }
    },
    onmouseup: (_) => {
      markMove = false;
      // console.log("mouseup");
      // zr.off("mousemove", handleMouseMove);
    },
    // onmouseover: (_) => {
    //   _.target.cursor = "nw-resize";
    //   zr.refresh();
    // },
    // onmouseout: (_) => {
    //   console.log("onmouseout");
    // },
  });
  zr.add(mark);
  // group.add(mark);
}

function drawRect() {
  let pointsInfo = [];
  function pointGroup(shape) {
    const { x, y, width: w, height: h } = shape;
    pointsInfo.push(
      { x, y },
      // { x: x + w / 2, y },
      { x: x + w / 2, y: y - 30 },
      { x: x + w, y },
      // { x: x + w, y: y + h / 2 },
      { x: x + w, y: y + h },
      { x: x, y: y + h }
      // { x: x+ w / 2, y: y + h },
      // { x, y: y + h / 2 }
    );
  }
  group = new zrender.Group();
  boundingRect = new zrender.Rect({
    shape: rectShape, // 形状
    draggable: true,
    style: {
      fill: "none",
      lineWidth: 1, // 边框宽度
      stroke: "black",
    },
    onclick: (ev) => {
      setTimeout(() => {});
      console.log(ev);
    },
    // onmouseover: (_) => {
    //   console.log("移入");
    //   显示拖拽箭头
    //   document.body.style.overflowY = 'hidden'
    // },
    // onmousewheel: _ => {
    //   console.log(2222222)
    //   document.body.style.overflowY = 'hidden'
    // },
    // onmouseout: (item) => {
    //   console.log("移出");
    //   document.body.style.overflowY = ''
    // },
  });
  // 只创建一次
  boundingRect.one("click", function (ev) {
    pointGroup(ev.target.shape);
    for (key in pointsInfo) {
      drawMark(pointsInfo[key], boundingRect, pointsInfo, pointGroup);
    }
  });

  function handleMouseUp() {
    zr.off("mousemove", handleMouseMove);
    zr.off("mousedown", mouseDownAndMove);
    zr.off("mouseup", handleMouseUp);
    // 绘制mark
    setDisabled("");
    rectShape = {};
  }
  zr.on("mousedown", mouseDownAndMove);
  zr.on("mouseup", handleMouseUp);
  // zr.on("click", function (ev) {
  //   console.log('clickclickclickclick',ev)
  // })
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
      lineWidth: 1,
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
    // case "line":
    //   zr.off("mousedown", circleMouseDownAndMove);
    //   zr.off("mousedown", mouseDownAndMove);
    //   drawLine();
    //   // setDisabled("line");
    //   break;
    case "rect":
      zr.off("mousedown", circleMouseDownAndMove);
      zr.off("mousedown", lineMouseDownAndMove);
      setDisabled("rect");
      drawRect();
      break;
    // case "circle":
    //   zr.off("mousedown", mouseDownAndMove);
    //   zr.off("mousedown", lineMouseDownAndMove);
    //   drawCircle();
    //   // setDisabled("circle");
    //   break;
    // case "arc":
    //   console.log("arc");
    //   break;

    default:
      break;
  }
};

/*
scrollFunc = (e) => {
  // 阻止默认事件 （缩放时外部容器禁止滚动）
  e.preventDefault();

  if(e.wheelDelta){

    e.wheelDelta > 0 ? this.scale += this.step : this.scale -= this.step

    this.render()
  }
}
*/
