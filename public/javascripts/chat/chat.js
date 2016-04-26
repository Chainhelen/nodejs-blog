(function (target) {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;

    if("object" != typeof(target) || "undefined" == target.host || "undefined" == target.port){
        console.log("Debug: target: host port maybe wrong");
        return;
    }

    var socket = io.connect('http://' + target.host + ':' + target.port + '/chat');
    socket.on('open', function(){
        status.text('Choose a name:');
    });

    socket.on('system',function(json){
        var p = '';
        if (json.type === 'welcome'){
            if(myName==json.text) status.text(myName + ': ').css('color', json.color);
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Welcome ' + json.text +'</p>';
        }else if(json.type == 'disconnect'){
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Bye ' + json.text +'</p>';
        }
        content.prepend(p); 
    });

    socket.on('message',function(json){
        var p = '<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+html_encode(json.text)+'</p>';
        content.prepend(p);
    });

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) return;
            socket.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            }
        }
    });
    function html_encode(str)   
    {   
        var s = "";   
        if (str.length == 0) return "";   
        s = str.replace(/&/g, "&gt;");   
        s = s.replace(/</g, "&lt;");   
        s = s.replace(/>/g, "&gt;");   
        s = s.replace(/ /g, "&nbsp;");   
        s = s.replace(/\'/g, "&#39;");   
        s = s.replace(/\"/g, "&quot;");   
            s = s.replace(/\n/g, "<br>");   
        return s;   
    }   
})(target);
