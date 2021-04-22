
var zr = zrender.init(document.getElementById('main'));
var scale = 1.0;
zr.on('mousewheel', function (e) {
    var storage = zr.storage;
    var els = zr.storage.getDisplayList(true, true);
    var delta = e.wheelDelta;
    var newScale = scale + delta / 10.0;

    if (newScale < 0.5 || newScale > 3) {
        return;
    }
    scale = newScale;
    group.animateTo({
        scale: [scale, scale],
    }, 100, 100)

    zr.refresh();
});

var p1 = new zrender.Circle({
    position: [100, 100],
    "shape": {
        "cx": 100,
        "cy": 100,
        "r": 30
    },
    "style": {
        "lineWidth": 1,
        "textPosition": "inside"
    }
});

var p2 = new zrender.Circle({
    position: [0, 0],
    "shape": {
        "cx": 300,
        "cy": 300,
        "r": 30
    },
    "style": {
        "lineWidth": 1,
        "textPosition": "inside"
    }
});

var line = new zrender.Polyline({
    "style": {
        "stroke": "red",
        "lineWidth": 2
    },
    "shape": {
        "points": [
            [
                200,
                200
            ],
            [
                300,
                300
            ]
        ],
        "smooth": false,
        "smoothConstraint": null
    }
});

var group = new zrender.Group({ position: [0, 0] });

group.add(p1);
group.add(p2);
group.add(line);

zr.add(group);