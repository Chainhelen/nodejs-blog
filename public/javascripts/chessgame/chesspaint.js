$("#gamecanvasdiv").css({"z-index": 3});

function deepcopyarray(obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = deepcopyarray(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
};

function getPointOnCanvas(canvas, x, y) {
    var bbox =canvas.getBoundingClientRect();
    return { x: x- bbox.left *(canvas.width / bbox.width),
        y:y - bbox.top  * (canvas.height / bbox.height)
    };
};

function getChessmanPoint(chesspaint, point){
    var x = point.x;
    var y = point.y;

    if(x < chesspaint.margin - chesspaint.manradius ||
            x > chesspaint.margin + chesspaint.cellwidth * 8 + chesspaint.manradius){
        return null;
    }
    if(y < chesspaint.margin - chesspaint.manradius || 
            y > chesspaint.margin + chesspaint.cellheight * 9 + chesspaint.manradius){
        return null;
    }

    x = x - chesspaint.margin + chesspaint.cellwidth / 2;

    if(chesspaint.ishost){
    } else {

    }
};

var chesspaint = {
    width : 0,
    height: 0,
    cellwidth: 0,
    cellheight: 0,
    margin: 30,
    ishost: true,
    manradius: 0,
    can : document.getElementById("can"),
    ctx : can.getContext('2d'),
    flashcir : null
};

var chessmap = {
    'ch': "車",
    'cc': "車",
    'mh': "馬",
    'mc': "馬",
    'Xh': "相",
    'xc': "象",
    'Sh': "仕",
    'sc': "士",
    'ph': "炮",
    'pc': "炮",
    'bh': "兵",
    'zc': "卒",
    'Jh': "帥",
    'jc': "將"
};

chesspaint.init = function(){
    if("object" == typeof arguments[0] && "boolean" == typeof arguments[0].ishost){
            this.ishost = arguments[0];
    } else {
        this.ishost = true;
    }
    this.width  = can.width;
    this.height = can.height;
    this.cellwidth = (this.width - 2 * this.margin) / 8;
    this.cellheight = (this.height - 2 * this.margin) / 9;

    this.manradius = Math.min(this.cellwidth - 5,
                this.cellheight - 5) / 2;

}

chesspaint.drawBackground = function(){
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();

    for(var i = 0;i < 2;i++){
        var prex = this.margin + i * (this.width - 2 * this.margin);
        var prey = this.margin + 0;
        var newx = prex;
        var newy = this.margin + (this.height - 2 * this.margin);

        this.ctx.moveTo(prex, prey);
        this.ctx.lineTo(newx, newy);
    }
    for(var i = 1;i < 8;i++){
        var prex = this.margin + i * this.cellwidth;
        var prey = this.margin + 0;
        var newx = prex;
        var newy = this.margin + this.cellheight * 4;

        this.ctx.moveTo(prex, prey);
        this.ctx.lineTo(newx, newy);
    }
    for(var i = 1;i < 8;i++){
        var prex = this.margin + i * this.cellwidth;
        var prey = this.margin + this.cellheight * 5;
        var newx = prex;
        var newy = this.margin + this.height - 2 * this.margin;

        this.ctx.moveTo(prex, prey);
        this.ctx.lineTo(newx, newy);
    }
    for(var i = 0;i <= 10;i++){
        var prex = this.margin + 0;
        var prey = this.margin + i * this.cellheight;
        var newx = this.margin + (this.width - 2 * this.margin);
        var newy = prey;

        this.ctx.moveTo(prex, prey);
        this.ctx.lineTo(newx, newy);
    }
    px = this.margin + 5 * this.cellwidth;
    py = this.margin + 0;
    nx = this.margin + 3 * this.cellwidth;
    ny = this.margin + 2 * this.cellheight;
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(nx, ny);

    var px = this.margin + 3 * this.cellwidth;
    var py = this.margin + 0;
    var nx = this.margin + 5 * this.cellwidth;
    var ny = this.margin + 2 * this.cellheight;
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(nx, ny);

    px = this.margin + 5 * this.cellwidth;
    py = this.margin + 7 * this.cellheight;
    nx = this.margin + 3 * this.cellwidth;
    ny = this.margin + 9 * this.cellheight;
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(nx, ny);

    var px = this.margin + 3 * this.cellwidth;
    var py = this.margin + 7 * this.cellheight;
    var nx = this.margin + 5 * this.cellwidth;
    var ny = this.margin + 9 * this.cellheight;
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(nx, ny);

    this.ctx.lineWidth = 1; 
    this.ctx.stroke();

    var fontsize = parseInt(0.8 * this.cellwidth);
    px = this.margin + 2 * this.cellwidth;
    py = this.margin + 4.5 * this.cellheight;
    nx = this.margin + 6 * this.cellwidth;
    ny = this.margin + 4.5 * this.cellheight;

    this.ctx.font =  fontsize + "px 宋体";
    this.ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
    this.ctx.textAlign = 'center'; //设置文本的水平对对齐方式

    if(this.ishost){
        this.ctx.save();
        this.ctx.fillText("楚河", px, py);
        this.ctx.translate(nx, ny);
        this.ctx.rotate(Math.PI);
        this.ctx.fillText("汉界", 0, 0);
        this.ctx.restore();
    } else {
        this.ctx.save();
        this.ctx.fillText("汉界", px, py);
        this.ctx.translate(nx, ny);
        this.ctx.rotate(Math.PI);
        this.ctx.fillText("楚河", 0, 0);
        this.ctx.restore();
    }
};


chesspaint.drawSingleChessman = function(){
    this.ctx.save();
    var obj = arguments[0];

    if("object" == typeof obj){
        if('undefined' == typeof chessmap[obj.type]){
            return;
        }
        var x = ("number" == typeof(obj.x) ? obj.x : 0);
        var y = ("number" == typeof(obj.y) ? obj.y : 0);
        var ny, nx = 0;

        if(!obj.ishost){
            nx = this.margin + x * this.cellwidth;
            ny = this.margin + y * this.cellheight;
        } else {
            nx = this.margin + (8 - x) * this.cellwidth;
            ny = this.margin + (9 - y) * this.cellheight;
        }

        this.ctx.beginPath();
        this.ctx.arc(nx, ny, this.manradius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle="white"; 
        this.ctx.fill();

        //paint the font of chessman
        this.ctx.save();
        var fontsize = parseInt(this.manradius);

        this.ctx.font =  fontsize + "px 宋体";
        this.ctx.textBaseline = 'middle';//设置文本的垂直对齐方式
        this.ctx.textAlign = 'center'; //设置文本的水平对对齐方式

        if('h' == obj.type[1]){
            this.ctx.fillStyle="red"; 
        } else {
            this.ctx.fillStyle="black"; 
        }

        this.ctx.translate(nx, ny);
        this.ctx.fillText(chessmap[obj.type], 0, 0);
        this.ctx.restore();
    }
    this.ctx.stroke();
    this.ctx.restore();
};

chesspaint.drawGlobalChessman = function(basemap){
    for(var i = 0, wlen = basemap.length;i < wlen;i++){
        for(var j = 0, hlen = basemap[i].length;j < hlen;j++){
            var x = j, y = i;
            chesspaint.drawSingleChessman({
                x: x,
                y: y,
                isHost: this.ishost,
                type: basemap[i][j]
            });
        }
    }
};

chesspaint.unDrawSomeChessman = function(basemap, flashchessman){
    var flasharr = [];
    if( flashchessman instanceof Array){
        flasharr = flashchessman;
    } else if(flashchessman instanceof Object){
        flasharr.push(flashchessman);
    } else {
        console.log('Error in unDrawSomeChessman');
    }
    var basemaptemp = deepcopyarray(basemap);

    for(var k = 0, flen = flasharr.length;k < flen;k++){
        var p = flasharr[k];
        basemaptemp[p.x][p.y] = '**';
    }

    chesspaint.drawGlobalChessman(basemaptemp);
};

chesspaint.startFlashChessman = function(basemap, flashchessman){
    var handler = [];
    var i = 0; 

    handler.push(this.drawGlobalChessman);
    handler.push(this.unDrawSomeChessman);

    this.flashcir = setInterval(function(){
        chesspaint.drawBackground();
        try{
            handler[i](basemap.slice(0), flashchessman);
        }catch(e){
            console.log(e);
        }
        i++;
        i %= handler.length;
    }, 600);
};

chesspaint.stopFlashChessman = function(){
    clearInterval(this.flashcir);
    this.flashcir = null;
};

chesspaint.can.addEventListener("click", function(e){
    var point = getPointOnCanvas(can, e.pageX, e.pageY);
}, false);

var basemap = [
    ['cc', 'mc', 'xc', 'sc', 'jc', 'sc', 'xc', 'mc', 'cc'],
    [],
    ['**', 'pc', '**', '**', '**', '**', '**', 'pc', '**'],
    ['zc', '**', 'zc', '**', 'zc', '**', 'zc', '**', 'zc'],
    [],
    [],
    ['bh', '**', 'bh', '**', 'bh', '**', 'bh', '**', 'bh'],
    ['**', 'ph', '**', '**', '**', '**', '**', 'ph', '**'],
    [],
    ['ch', 'mh', 'Xh', 'Sh', 'Jh', 'Sh', 'Xh', 'mh', 'ch'],
];


chesspaint.init({ishost:true});
chesspaint.drawBackground();
//chesspaint.drawGlobalChessman(basemap);
//chesspaint.unDrawSomeChessman(basemap, [{x : 0, y : 0}, {x : 2, y : 1}]);
chesspaint.startFlashChessman(basemap, [{x : 0, y : 0}, {x : 2, y : 1}]);
/*
chesspaint.drawSingleChessman({
    x:0,
    y:0,
    curHost:true,
    type:'c'
});
chesspaint.drawSingleChessman({
    x:1,
    y:0,
    curHost:true,
    type:'p'
});*/
