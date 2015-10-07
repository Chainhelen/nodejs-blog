function hash(){

	function updateUrl(){
		var obj = '';
		var len = clickX.length;
		for(var i = 0;i < len;i++){
			obj += clickX[i] + '*';
			obj += clickY[i] + '*';
			if(clickDrag[i] == true){
				obj += '+*';
			} else {
				obj += '-*';
			}
		}
		document.location.hash = Base64.encode([obj].join("\x7f"));
		setTimeout(updateUrl,1000);
	}

	function updateInput(){
		var obj = '';
		var objsub;
		var start;
		var end;

		var hash = (!window.location.hash)?"#":window.location.hash;
		window.location.hash = hash;
		obj = Base64.decode(unescape((location).hash).split("\x7F")[0]||"");
		
		for(var i = 0;i < obj.length;){
			end = i;
			while(obj[end] != '*'){
				end++;
			}
			objsub = obj.substring(i, end);
			clickX.push(Math.floor(objsub));
			i = end + 1;

			end = i;
			while(obj[end] != '*'){
				end++;
			}
			objsub = obj.substring(i, end);
			clickY.push(Math.floor(objsub));
			i = end + 1;

			if(obj[i] == '+'){
				clickDrag[clickX.length - 1] = true;
			} else {
				clickDrag[clickX.length - 1] = false;
			}
			i+=2;
		}
		redraw();
	}
	updateInput();
	updateUrl();
};
$(document).ready(function(){
	init();	
	hash();	
});
