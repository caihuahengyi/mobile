var main = document.querySelector('#main');
var oLis = document.querySelectorAll(".slide>li");
var winW = window.innerWidth;   //获取设备宽度
var winH = window.innerHeight;  //获取设备高度
var desW = 640;  //设计稿宽度
var desH = 960;  //设计稿高度
//适配当前设备
/*main.style.webkitTransform = "scale(" + winH / desH + ")";*/  //缩小(scale)(设备的高度 / 设计稿的高度)
if (winW / winH > desW / desH) {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
} else {
    main.style.webkitTransform = "scale(" + winH / desH + ")";
}
//类数组转换成数组循坏
//forEach循坏形参 当前元素
[].forEach.call(oLis, function () {
    arguments[0].index = arguments[1];  //arguments[1]把当前元素的索引赋值给arguments[0].index 当前元素的自定义属性index
    //addEventListener 添加DOM二级事件
    arguments[0].addEventListener('touchstart', start, false);  //手触摸的时候执行start方法 false 在冒泡阶段执行
    arguments[0].addEventListener('touchmove', move, false);  //滑动的时候执行move方法
    arguments[0].addEventListener('touchend', end, false);  //手松开的时候执行end方法
});
function start(e) {
    this.startY = e.changedTouches[0].pageY;  // changedTouches 类数组 所有触碰点集合 pageY 当前到body的垂直距离
}
function move(e) {
    e.preventDefault(); //阻止默认行为
    /*阻止默认行为*/
    var touchMove = e.changedTouches[0].pageY;  //把当前上/下的动态值赋给touchMove的变量
    var changePos = touchMove - this.startY;    //用动态值-startY固定值  判断是向下还是向上
    var cur = this.index;  //把当前元素的索引赋值给cur
    /*var step = 1/3;
    var scalePos =(Math.abs(changePos)/winH)*step; //取changePos绝对值 / 设备高度 * step(1/2)*/
    [].forEach.call(oLis,function(){
        if(arguments[1]!=cur){   //在move方法移动的时候，除了当前元素外，把所有元素都隐藏
            arguments[0].style.display="none";
        }
        //当前元素移动的时候，清除掉当前元素的class
        arguments[0].className="";
        arguments[0].firstElementChild.id="";  //清除当前元素子元素的第一个儿子id
    });
    if (changePos > 0) {/*往下滑*/
        var pos = -winH+changePos;
        //如果当前的索引是第一张就把上一张变成最后一张，否则减1
        this.preSIndex = cur == 0 ? oLis.length - 1 : cur - 1;
    } else if (changePos < 0) {/*往上滑*/
        var pos = winH+changePos;
        //如果当前的索引是最后一张就把上一张变成第一张，否则加1
        this.preSIndex = cur == oLis.length - 1 ? 0 : cur + 1;
    }
    // translate(x轴,y轴)平移 translateX(x轴平移) translateY(y轴平移)
    oLis[this.preSIndex].style.webkitTransform = "translateY("+pos+"px)";
    //当前元素显示在最上面
    oLis[this.preSIndex].className = "zIndex";
    oLis[this.preSIndex].style.display="block";
    //把当前元素按照比例缩放  1- 是因为要从大到小缩放  translate 平移的距离
    oLis[cur].style.webkitTransform = "scale("+(1/*-scalePos*/)+") translate(0,"+changePos+"px)";
}
function end(e) {  //手松开的时候
    oLis[this.preSIndex].style.webkitTransform ="translate(0,0)"; //平移结束
    oLis[this.preSIndex].style.webkitTransition="0.5s";  //动画的时间
    //addEventListener添加DOM二级事件 webkitTransitionEnd 动画结束
    oLis[this.preSIndex].addEventListener('webkitTransitionEnd',function(){
        this.style.webkitTransition="";
        this.firstElementChild.id = "a"+(this.index+1);
    },false);
}

var $cubeBox = $('.cubeBox');

//->随时记录当前盒子的旋转角度,让下一次的操作是在当前的角度基础上再次旋转的
$cubeBox.attr({
    rotateX: -30,
    rotateY: 45
});
$cubeBox.on('touchstart', function (ev) {
    var point = ev.changedTouches[0];
    $(this).attr({
        strX: point.pageX,
        strY: point.pageY,
        changeX: 0,
        changeY: 0
    });
});
$cubeBox.on('touchmove', function (ev) {
    var point = ev.changedTouches[0];
    $(this).attr({
        changeX: point.pageX - parseFloat($(this).attr('strX')),
        changeY: point.pageY - parseFloat($(this).attr('strY'))
    });
});
$cubeBox.on('touchend', function (ev) {
    var changeX = parseFloat($(this).attr('changeX')),
        changeY = parseFloat($(this).attr('changeY'));
    var rotateX = parseFloat($(this).attr('rotateX')),
        rotateY = parseFloat($(this).attr('rotateY'));
    if (Math.abs(changeX) > 30 || Math.abs(changeY) > 30) {
        //->肯定是滑动
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $(this).attr({
            rotateX: rotateX,
            rotateY: rotateY
        }).css('transform', 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
    }
});
/*音乐*/
var beyond = document.querySelector("#beyond");
var music = document.querySelector(".music");
window.setTimeout(function () {
    beyond.play();//音频文件播放,边缓存边播放
    beyond.addEventListener("canplay", function () {
        music.className = 'music musicMove';
        music.style.opacity = 1;
    });

}, 1000);
music.addEventListener("click", function () {
    if (beyond.paused) {//停止
        beyond.play();
        music.className = 'music musicMove';
    } else {//播放
        beyond.pause();
        music.className = 'music';
    }
});




