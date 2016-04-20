function draw_Background(){
	ctx.fillStyle="rgb(203, 201, 204)";
	ctx.fillRect(0,0,w+1,h+1);
}

function getCount(){
	var objs = document.getElementsByName("count");
	for(var i = 0;i < objs.length;i++){
		if(objs[i].checked){
			return objs[i].value;
		}
	}
}

function draw_Rect(s){
	var minw = parseInt(w / count);
	var harray = s;
	var len = s.length;
	ctx.fillStyle="rgb(170,0,255)";

	for(var i = 0;i < len;i++)
	{
		ctx.fillRect(minw * i,h - harray[i], minw, harray[i]);
		ctx.strokeRect(minw * i,h - harray[i], minw, harray[i]);
	}
}

function getRandArray(){
	var b = new Array();
	for(var i = 0;i < count;i++)
		b[i] = Math.round(Math.random()*300);
	return b;
}

function clone(a){
	var s = new Array();
	var len = a.length;
	for(var i = 0;i < len;i++)
		s[i] = a[i];
	return s;
}

function swap(b,i,j){
	var key = b[i];
	b[i] = b[j];
	b[j] = key;
}

function changeColor(s, place, color){
	ctx.fillStyle	=	color;
	var len 		= 	place.length;

	for(var i = 0;i < len;i++){
		var l = place[i];
		ctx.fillRect(w / count * l,h - s[l], w / count, s[l]);
		ctx.strokeRect(w / count * l,h - s[l], w / count, s[l]);
	}
}

//事件类
function Event(){
	this.handlers = {};
}
Event.prototype = {
	on:function(type, handler){
		   if(typeof this.handlers[type] == "undefined"){
			   this.handlers[type] = [];
		   }
		   this.handlers[type].push(handler);
    },
	send:function(event){
		 if(!event.target){
			 event.target = this;
		 }
		 if(this.handlers[event.type] instanceof Array){
			 var handlers = this.handlers[event.type];
			 for(var i = 0;i < handlers.length;i++){
				 handlers[i]();
			 }
		 }
	}
}

function ShowInfo(){
	this.arr = [];
	this.place = [];
	this.hight = [];
	this.length = 0;
};

ShowInfo.prototype.changeSomeHightByPlaceNum = function(b){
	if("number"  != typeof(b)){
		console.log("error in changeSomeHightByPlace");
		return ;
	}
	var place 	= this.place[b];
	var hight   = this.hight[b];
	var len 	= place.length;

	for(var i = 0;i < len;i++){
		this.arr[place[i]] = hight[i];
	}
}
