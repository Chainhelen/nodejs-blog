var canvas, context, isPainting,clickX, clickY, clickDrag;

var mouseDown = function(e){
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	isPainting = true;
	addClick(mouseX, mouseY, false);
	redraw();
}
var mouseUp = function(e){
	isPainting = false;
	redraw();
}
var mouseMove = function(e){
	if(isPainting){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		addClick(mouseX, mouseY, true);
		redraw();
	}

}
var mouseOut = function(e){
	isPainting = false;
}

function addClick(mouseX, mouseY, isDragging){
	clickX.push(mouseX);
	clickY.push(mouseY);
	clickDrag.push(isDragging);
}

//重绘
function redraw(){
	context.clearRect (0 , 0, canvas.width , canvas.height );
	context.strokeStyle = "#000000";
	var numOfPts = clickX.length;
	for(var i=0; i<numOfPts; i++){
		context.beginPath();
		if(clickDrag[i]){
			context.moveTo(clickX[i-1], clickY[i-1]);
			context.lineTo(clickX[i], clickY[i]);
		}else{
			context.arc(clickX[i], clickY[i], 0.5, 0, 2*Math.PI, true);
		}
		context.closePath();
		context.stroke();
	}
}

//初始化
function init(){
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	isPainting = false;
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	//鼠标事件
	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = mouseMove;
	canvas.onmouseout = mouseOut;
}

//window.onload = init();
