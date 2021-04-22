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
  let opt = { x: rectShape.x, y: rectShape.y }
  // drawMark(opt);
  // group.add(boundingRect)
  group.add(new zrender.Circle({
    style: {
      x: 100,
      y: 100,
      r: 20,
    }
  }))
  // zr.add(boundingRect);
  zr.on("mousemove", handleMouseMove);
}
function handleMouseMove(ev) {
  rectShape.width = ev.offsetX - rectShape.x;
  rectShape.height = ev.offsetY - rectShape.y;
  boundingRect.setShape(rectShape);
}
function drawMark(opt) {
  // 放到组里面
  mark = new zrender.Circle({
    style: {
      fill: 'transparent',
      stroke: '#1890ff'
    },
    shape: {
      cx: opt.x,
      cy: opt.y,
      r: 4
    },
    hoverable: true,
    draggable: true,
    z: 2,
    onmousedown: _ => {
      // _.cancelBubble = true;
      console.log('mousedown', _)
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
      console.log('circle中down', _)
      // rectShape.x = _.offsetX;
      // rectShape.y = _.offsetY;

      zr.on("mousemove", handleMouseMove);
      // zr.on("mousemove", handlePoint);
    },
    onmousemove: _ => {
      // boundingRect.setShape(rectShape);
      console.log('mousemove', _, _.offsetY)
    },
    onmouseup: _ => {
      console.log('mouseup')
      zr.off("mousemove", handleMouseMove)
    },
    onmouseover: _ => {
      _.target.cursor = 'nw-resize'
      zr.refresh()
      console.log(44444)
    },
    onmouseout: _ => {
      console.log(77777)
    }
  })
  // zr.add(mark);
  group.add(mark)
}

function drawRect() {
  group = new zrender.Group();
  boundingRect = new zrender.Rect({
    shape: rectShape, // 形状
    draggable: true,
    style: {
      fill: "none",
      lineWidth: 1, // 边框宽度
      stroke: "black",
    },
    onmouseover: _ => {// 显示拖拽箭头
      // document.body.style.overflowY = 'hidden'
    },
    // onmousewheel: _ => {
    //   console.log(2222222)
    //   document.body.style.overflowY = 'hidden'
    // },
    // onmouseout: item => {
    //   console.log(2222222)
    //   document.body.style.overflowY = ''
    // }
  });

  zr.on("mousedown", mouseDownAndMove);
  zr.on("mouseup", function (ev) {
    zr.off("mousemove", handleMouseMove);
    zr.off("mousedown", mouseDownAndMove);
    // 绘制mark
    // console.log(boundingRect.shape)
    console.log(rectShape)
    // const shape = ev.target.shape;
    drawMark({
      x: rectShape.x + rectShape.width,
      y: rectShape.y + rectShape.height
    })
    setDisabled("");
    // this.markInfo.forEach((item, index) => {
    //   const opt = {
    //     stroke: '#f00',
    //     pointsSet: this.AssemblyData(item),
    //     id: index
    //   }
    //   vm.drawMark(opt)
    // })
    rectShape = {};
  });
  // boundingRect.onclick=function(){
  //   console.log(777777)
  // }

  // zr.on("click", function (ev) {
  //   console.log('clickclickclickclick',ev)
  // })

  // console.log(boundingRect.getBoundingRect())
  // console.log(boundingRect.contain)
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
