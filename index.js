var main = document.querySelector("#main");
var oLis = document.querySelectorAll("#main>ul>li");
var winW = window.innerWidth;
var winH = window.innerHeight;
var desW = 640;
var desH = 1008;
if (winW / winH <= desW / desH) {
    main.style.webkitTransform = "scale(" + winH / desH + ")";
} else {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
}
//预加载
function fnLoad() {
    var ary = ["V1I2DB0S.jpg", "music.png", "4kxA74Cr.png", "Ekxy4VAr.png", "EJKSvH0S.png", "4knMZzAB.jpg", "page_1_img_B.jpg", "last_img_1.png"];
    var n = 0;
    var loadText = document.querySelector(".loadText");
    var loading = document.querySelector("#loadingBox");
    ary.forEach(function (curImg) {
        var oImg = new Image();
        oImg.src = 'assets/' + curImg + "?" + Math.random();
        oImg.onload = function () {
            n++;
            loadText.innerHTML = Math.round(n / ary.length * 100) + "%";
            if (n == ary.length) {
                window.setTimeout(function () {
                    main.removeChild(loading);
                    fnMusic();
                    fnTouch();
                }, 1000)

            }
        }
    })
}

fnLoad();

function fnMusic() {
    var sound = document.querySelector("#sound");
    var music = document.querySelector("#music");
    sound.play();
    music.addEventListener("click", function () {
        if (sound.paused) {
            sound.play();
            music.className = "";
        } else {
            sound.pause();
            music.className = "musicBg";
        }
    }, false);

}


function fnTouch() {
    //初始化第一页
    window.setTimeout(function () {
        oLis[0].firstElementChild.id = "side0";
    }, 500);
    [].forEach.call(oLis, function (curLi, index) {
        curLi.index = index;
        curLi.addEventListener("touchstart", start, false);
        curLi.addEventListener("touchmove", move, false);
        curLi.addEventListener('touchend', end, false);
    });
    function start(e) {
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }

    function move(e) {
        this.style.webkitTransition = "";
        this.flag = true;//判断是否移动
        e.preventDefault();
        var moveX = e.touches[0].pageX;
        var moveY = e.touches[0].pageY;
        var direction = swipeDirection(this.startX, this.startY, moveX, moveY);
        var index = this.index;
        var len = oLis.length;
        if (isSwipe(this.startX, this.startY, moveX, moveY)) {
            if (/^(Down|Up)$/.test(direction)) {
                //滑动前初始化,只有当前这张显示,并且去掉所有li的类名zIndex
                [].forEach.call(oLis, function (curLi, step) {
                    if (step != index) {
                        curLi.style.display = "none";
                    }
                    curLi.className = "";
                    curLi.firstElementChild.id = "";
                })
                var movePos = moveY - this.startY;
                //通过判断方向获取索引和距离
                if (direction == "Down") {
                    this.prevsIndex = index == 0 ? len - 1 : index - 1;
                    var pos = -desH / 2 + movePos;
                } else if (direction == "Up") {
                    this.prevsIndex = index == len - 1 ? 0 : index + 1;
                    var pos = desH / 2 + movePos;
                }
                //上一张或者下一张设置移动的距离和层级
                oLis[this.prevsIndex].className = "zIndex";
                oLis[this.prevsIndex].style.display = "block";
                oLis[this.prevsIndex].style.webkitTransform = "translate(0," + pos + "px)";
                this.style.webkitTransform = "scale(" + (1 - Math.abs(movePos) / desH) + ") translate(0," + movePos + "px)";

            }
        }


    }

    function end(e) {
        if (this.flag) {
            oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
            oLis[this.prevsIndex].style.webkitTransition = "1s";
            var _this = this;
            oLis[this.prevsIndex].addEventListener("webkitTransitionEnd", function () {
                //滑动效果执行完之后处理些逻辑
                this.style.webkitTransition = "";
                _this.style.webkitTransform = "translate(0,0)";
                _this.style.webkitTransition = "1s";
                this.firstElementChild.id = "side" + this.index;

            }, false)
            this.flag = false;
        }

    }

    function isSwipe(startX, startY, moveX, moveY) {
        return Math.abs(moveX - startX) > 30 || Math.abs(moveY - startY) > 30;
    }

    function swipeDirection(startX, startY, moveX, moveY) {
        var changeX = moveX - startX;
        var changeY = moveY - startY;
        return Math.abs(changeX) > Math.abs(changeY) ? (changeX > 0 ? "Right" : "Left") : (changeY > 0 ? "Down" : "Up");
    }

}

