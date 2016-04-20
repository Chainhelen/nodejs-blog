function Control(){			
	var time = 0;
	var lun = null;
	var control = null;
	var initAnimateControl = null;
	var synAnimatEvent = new Event();
	var ss = null;
	var si = null;

	function initData(){
		stop();
		count = getCount();
		return getRandArray();
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

	function initAnimate(b){
		var time = 0;
		var lun = null;
		var ss = null;
		return {
			"start": function(){
				var a = new Array(b.length);
				for(var i = 0;i < a.length;i++){
					a[i] = 0;
				}
				ss = slide(a, b);
				function run(){
					draw_Background();
					draw_Rect(ss[time]);
					time++;
		
					if(time >= ss.length){
						clearInterval(lun);
						lun = null;
						synAnimatEvent.send({
							type:'initAnimateFinished'
						});
						return;
					}
				}
				lun = setInterval(run ,0);
			},
			"stop": function(){
				clearInterval(lun);
				lun = null;
			}
		}
	}

	function checkCurrentAlgorithm(){
		if(current_algorithm){
			info_blank.innerHTML = "<strong>正在刷新</strong>"
		}
		return true;
	}

	function refresh(si){
		if(null != lun){
			si.changeSomeHightByPlaceNum(time);
			draw_Background();			
			draw_Rect(si.arr);
			changeColor(si.arr, si.place[time] ,"red");
			time++;
		}else{
//			info_blank.innerHTML = "<strong>修改随机数个数,暂停中....</strong>"
		}
	}

	function norefresh(ss,i,j){
		draw_Background();			
		draw_Rect(ss[0]);
		changeColor(ss[0],i,j,"red");
	}
	function run(si){
		draw_Background();			
		draw_Rect(si.arr);

		if(time >= si.place.length){
			clearInterval(lun);			
			lun = null;
			info_blank.innerHTML = "<strong>已完成!! 运行次数</strong>" + "<strong style=\"font-size:60px\">" + si.length + "</strong>";
			current_algorithm = null;
			time = 0;
			return ;
		}

		changeColor(si.arr, si.place[time], "red");
		setTimeout(function(){refresh(si)}, parseInt(speed / 3));
//		refresh(si);
	}

	function switchSort(data){
		for(i in algorithm){
			if(current_algorithm == i){
				return algorithm[i](data);
			}
		}
		return null;
	}

	function start(data){
		stop();

		//匹配算法函数
		si = switchSort(clone(data));
		console.log(si);
		if(si == null){
			info_blank.innerHTML = "<strong>没有该算法...</strong>";
			return ;
		}
		//信息版随机数据生成
		info_blank.innerHTML = "<strong>随机数据生成中....</strong>";
		//数据生成画面，完成后发送finished消息
		initAnimateControl = initAnimate(data);
		initAnimateControl.start();
	}

	//注册算法演示画面函数
	synAnimatEvent.on('initAnimateFinished',
		function(){
			//信息版正在排序
			info_blank.innerHTML = "<strong>正在排序...</strong>";
			lun = setInterval(function(){run(si)}, speed);
		}
	);

	function stop(){
		clearInterval(lun);
		if(null != initAnimateControl){
			initAnimateControl.stop();
		}
		time = 0;
		lun = null;
	}

	control = {
		initData : initData,
		start : start,
		stop : stop
	}
	return control;
}

function runQuickSort(data){
	current_algorithm = "quickSort";
	var b = data;
	var povar = 0;
	var si = new ShowInfo();
	si.arr = clone(b);

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
					si.length++;
					if(b[j]<b[i])
		            {
						swap(b,i,j);

						si.place[povar] = new Array();
						si.hight[povar] = new Array();
		
						si.place[povar].push(i);
						si.hight[povar].push(b[i]);
		
						si.place[povar].push(j);
						si.hight[povar].push(b[j]);
						povar++;
		                break;
		            }
					else
					{
						si.place[povar] = new Array();
						si.hight[povar] = new Array();
		
						si.place[povar].push(i);
						si.hight[povar].push(b[i]);
		
						si.place[povar].push(j);
						si.hight[povar].push(b[j]);
						povar++;
					}
				}
		
		        for(;i<j;i++)
		        {
					si.length++;
					if(b[i]>b[j])
		            {
						swap(b,i,j);
						si.place[povar] = new Array();
						si.hight[povar] = new Array();
		
						si.place[povar].push(i);
						si.hight[povar].push(b[i]);
		
						si.place[povar].push(j);
						si.hight[povar].push(b[j]);
						povar++;
						break;
		            }
					else
					{
						si.place[povar] = new Array();
						si.hight[povar] = new Array();
		
						si.place[povar].push(i);
						si.hight[povar].push(b[i]);
		
						si.place[povar].push(j);
						si.hight[povar].push(b[j]);
						povar++;
					}
		        }
			}
	
			quicksort(b, start, i);
			quicksort(b, i + 1 , end);
		}
	}
	quicksort(b,0,b.length-1);
	return si;
}

function runBubbleSort(data){
	current_algorithm = "bubbleSort";
	var b = data;
	var len = b.length;
	var povar = 0;

	var si = new ShowInfo();
	si.arr = clone(b);

	function bubblesort(){
		for(var j = 0;j < len - 1;j++){
			for(var i = 0;i < len - 1 - j;i++){
				if(b[i] > b[i+1]){
					var tmp = b[i];
					b[i] = b[i+1];
					b[i+1] = tmp;
				} 

				si.length++;
				si.place[povar] = new Array();
				si.hight[povar] = new Array();

				si.place[povar].push(i);
				si.hight[povar].push(b[i]);

				si.place[povar].push(i + 1);
				si.hight[povar].push(b[i+1]);

				povar++;
			}
		}
	};
	bubblesort();
	return si;
}

function runMergeSort(data){
	current_algorithm = "mergeSort";
	var b = data;
	var len = b.length;
	var povar = 0;
	var tmp = new Array();

	var si = new ShowInfo();
	si.arr = clone(b);

	function mergearray(a, l, mid, r, tmp){
		var i = l, j = mid + 1;
		var m = mid, n = r;
		var k = 0;


		while(i <= m && j <= n){
			si.length++;
			if(a[i] <= a[j]){
				tmp[k++] = a[i++];
			}else{
				tmp[k++] = a[j++];
			}
		}
		while(i <= m){
			si.length++;
			tmp[k++] = a[i++];
		}
		while(j <= n){
			si.length++;
			tmp[k++] = a[j++];
		}

		for(i = 0;i < k;i++){
			a[l + i] = tmp[i];

			si.place[povar] = new Array();
			si.hight[povar] = new Array();
			for(var ii = l;ii <= r;ii++){
				si.place[povar].push(ii);
			}
			for(var ii = l;ii <= l + i;ii++){
				si.hight[povar].push(a[ii]);
			}
			for(var ii = l + i + 1;ii < l + k;ii++){
				si.hight[povar].push(a[ii]);
			}
			povar++;
			si.length++;

		}
	}

	function mergesort(a, first, last, tmp){
		if(first < last){
			var mid = parseInt((first + last) / 2);
			mergesort(a, first, mid, tmp);
			mergesort(a, mid + 1, last, tmp);
			mergearray(a, first, mid, last, tmp);
		}
	}
	mergesort(data, 0, data.length - 1, tmp);
	return si;
}

function gameStart(){
	var data = control.initData();
	control.start(data);
}

var w = 400;
var h = 300;
var count = 25;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var current_algorithm = null;
var speed = 15;
var control = Control();
var algorithm = {
	"quickSort" : runQuickSort,
	"bubbleSort" : runBubbleSort,
	"mergeSort" : runMergeSort
};

var quick_button = document.getElementById('quick_sort');
var bubble_button = document.getElementById('bubble_sort');
var merge_button = document.getElementById('merge_sort');
var info_blank = document.getElementById('info_blank');

quick_button.onclick = function(){
	current_algorithm = "quickSort";
	gameStart();
};

bubble_button.onclick = function(){
	current_algorithm = "bubbleSort";
	gameStart();
};

merge_button.onclick = function(){
	current_algorithm = "mergeSort";
	gameStart();
}

draw_Background();
