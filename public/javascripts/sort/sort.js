var w = 400;
var h = 300;
var count = 25;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var flag = 0;

draw_Background();

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
function init(){
	info_blank.innerHTML = "<strong>随机数据生成中....</strong>";
	var a = new Array();
	for(var i = 0;i < count;i++)
		a[i] = 0;
	draw_Background();			
	draw_Rect(a);

	var b = getRandArray();
	var ss = slide(a,b);
	var lun = init_donghua();
	lun(ss);
	return b;
}
function init_donghua(){
	var time = 0;
	return function (ss){
		function run(){
			draw_Background();
			draw_Rect(ss[time]);
			time++;

			if(time >= ss.length){
				clearInterval(lun);
			}
		}
		var lun = setInterval(run ,0);
	}
}
function clone(a){
	var s = new Array();
	var len = a.length;
	for(var i = 0;i < len;i++)
		s[i] = a[i];
	return s;
}
function slide(a,b){
	var len = a.length;
	var s = new Array();
	var aa = clone(a);
	var bb = clone(b);
	var max = -1;

	for(var i = 0;i < len;i++){
		if(max < Math.abs(aa[i] - bb[i]))
			max = Math.abs(aa[i] - bb[i])
	}
	s[0] = clone(a);

	for(var i = 1;i <= max;i++){
		for(var j = 0;j < len;j++){
			if((b[j] - aa[j]) > 0){
				aa[j] ++;
			} else if( (b[j] - aa[j]) < 0){
				aa[j] -- ;
			}
		}
		s[i] = clone(aa);
	}
	return s;
}
function change(b,i,j){
	var key = b[i];
	b[i] = b[j];
	b[j] = key;
}
function changeColor(s,i,j,color){
	ctx.fillStyle=color;
	ctx.fillRect(w / count * i,h - s[i], w / count, s[i]);
	ctx.strokeRect(w / count * i,h - s[i], w / count, s[i]);

	ctx.fillRect(w / count * j,h - s[j], w / count, s[j]);
	ctx.strokeRect(w / count * j,h - s[j], w / count, s[j]);
}
function showSort(){			
	info_blank.innerHTML = "<strong>正在排序...</strong>";
	var time = 0;
	function refresh(ss,i,j){
		change(ss[0],i,j);
		draw_Background();			
		draw_Rect(ss[0]);
		changeColor(ss[0],i,j,"red");
	}
	function norefresh(ss,i,j){
		draw_Background();			
		draw_Rect(ss[0]);
		changeColor(ss[0],i,j,"red");
	}
	return function(ss){
		function run(){
			time++;
			draw_Background();			
			draw_Rect(ss[0]);
			if(time >= ss.length){
				clearInterval(lun);			
				info_blank.innerHTML = "<strong>已完成!! 运行次数</strong>" + "<strong style=\"font-size:60px\">" + ss.length + "</strong>";
				flag = 0;
				return ;
			}
			if(ss[time][2] == 1){
				changeColor(ss[0],ss[time][0],ss[time][1],"red");
				setTimeout(function(){refresh(ss,ss[time][0],ss[time][1])},5);
			}
			else if(ss[time][2] == 0){
				changeColor(ss[0],ss[time][0],ss[time][1],"red");
				setTimeout(function(){norefresh(ss,ss[time][0],ss[time][1])},5);
			}
		}
		var lun = setInterval(run,15);
	}
}
function checkButton(){
	if(flag){
		info_blank.innerHTML = "<strong>(请在排序完成后再次点击或者刷新页面)</strong>"
		return false;	
	}else{
		return true;
	}
}
function runQuickSort(){
	flag = 1;
	var b = init();
	var point = 0;
	var ss = new Array();
	ss[point] = clone(b);

	function quicksort(b,start,end)
	{
		var i = start;
		var j = end;
		var num = end - start + 1;
	
		if(num > 1)
		{
			while(i < j)
			{
		        for(;j>i;j--)
		        {
					if(b[j]<b[i])
		            {
						change(b,i,j);
						ss[++point] = new Array();
						ss[point].push(i);
						ss[point].push(j);
						ss[point].push(1);
		                break;
		            }
					else
					{
						ss[++point] = new Array();
						ss[point].push(i);
						ss[point].push(j);
						ss[point].push(0);
					}
				}
		
		        for(;i<j;i++)
		        {
					if(b[i]>b[j])
		            {
						change(b,i,j);
						ss[++point] = new Array();
						ss[point].push(i);
						ss[point].push(j);
						ss[point].push(1);
						break;
		            }
					else
					{
						ss[++point] = new Array();
						ss[point].push(i);
						ss[point].push(j);
						ss[point].push(0);
					}
		        }
			}
	
			quicksort(b, start, i);
			quicksort(b, i + 1 , end);
		}
	}
	quicksort(b,0,b.length-1);
	return ss;
}
function runBubbleSort(){
	flag = 1;
	var b = init();
	var len = b.length;
	var point = 0;
	var ss = new Array();
	ss[point] = clone(b);

	function bubblesort(){
		for(var j = 0;j < len - 1;j++){
			for(var i = 0;i < len - 1 - j;i++){
				if(b[i] > b[i+1]){
					var tmp = b[i];
					b[i] = b[i+1];
					b[i+1] = tmp;

					ss[++point] = new Array();
					ss[point].push(i);
					ss[point].push(i+1);					
					ss[point].push(1);
				} else {
					ss[++point] = new Array();
					ss[point].push(i);
					ss[point].push(i+1);					
					ss[point].push(0);
				}
			}
		}
	};
	bubblesort();
	return ss;
}
var quick_button = document.getElementById('quick-sort');
var bubble_button = document.getElementById('bubble_sort');
var info_blank = document.getElementById('info_blank');

quick_button.onclick = function(){
	if(!checkButton())
		return ;
	else {
		count = getCount();
		var ss = runQuickSort();
		setTimeout(function(){
			var lun = showSort();
			lun(ss);
		},2500)
	}
};

bubble_button.onclick = function(){
	if(!checkButton())
		return ;
	else{
		count = getCount();
		var ss = runBubbleSort();				
		setTimeout(function(){
			var lun = showSort();
			lun(ss);
		},2500)
	}
};
