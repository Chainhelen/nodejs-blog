$("#gamecanvasdiv").css({"z-index": 3});

var chesspaint = {
    width : 0,
    height: 0,
    cellwidth: 0,
    cellheight: 0,
    margin: 30,
    ishost: true,
    manradius: 0,
    ctx : can.getContext('2d'),
    can : document.getElementById("can")
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

chesspaint.drawChessman = function(){
    this.ctx.save();
    var obj = arguments[0];

    if("object" == typeof obj){
        var x = ("number" == typeof(obj.x) ? obj.x : 0);
        var y = ("number" == typeof(obj.y) ? obj.y : 0);

        var nx = this.margin + x * this.cellwidth;
        var ny = this.margin + (9 - y)  * this.cellheight;

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

        if(obj.curHost){
            this.ctx.fillStyle="red"; 
        } else {
            this.ctx.fillStyle="bule"; 
        }

        this.ctx.translate(nx, ny);
        switch (obj.type)
        {
            case 'c':
                this.ctx.fillText("車", 0, 0);
                break;
            case 'm':
                this.ctx.fillText("馬", 0, 0);
                break;
            case 'X':
                this.ctx.fillText("相", 0, 0);
                break;
            case 'x':
                this.ctx.fillText("象", 0, 0);
                break;
            case 'S':
                this.ctx.fillText("仕", 0, 0);
                break;
            case 's':
                this.ctx.fillText("士", 0, 0);
                break;
            case 'p':
                this.ctx.fillText("炮", 0, 0);
                break;
            case 'b':
                this.ctx.fillText("兵", 0, 0);
                break;
            case 'z':
                this.ctx.fillText("卒", 0, 0);
                break;
            case 'J':
                this.ctx.fillText("帥", 0, 0);
                break;
            case 'j':
                this.ctx.fillText("將", 0, 0);
                break;

        }
        this.ctx.restore();
    }
    this.ctx.stroke();
    this.ctx.restore();
};

chesspaint.init({ishost:true});
chesspaint.drawBackground();

var base = [
    ['c', 'm', 'X', 'S', 'J', 'S', 'X', 'm', 'c'],
    ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
    ['*', 'p', '*', '*', '*', '*', '*', 'p', '*'],
    ['b', '*', 'b', '*', 'b', '*', 'b', '*', 'b'],
    [],
    [],
    ['z', '*', 'z', '*', 'z', '*', 'z', '*', 'z'],
    ['*', 'p', '*', '*', '*', '*', '*', 'p', '*'],
    ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
    ['c', 'm', 'x', 's', 'j', 's', 'x', 'm', 'c'],
];

for(var i = 0;i < base.length;i++){
    for(var j = 0;j < base[i].length;j++){
        var curHost = (i <= 4 ? true : false);
        chesspaint.drawChessman({
            x:i,
            y:j,
            curHost:curHost,
            type:base[i][j]
        });
    }
}
/*
chesspaint.drawChessman({
    x:0,
    y:0,
    curHost:true,
    type:'c'
});
chesspaint.drawChessman({
    x:1,
    y:0,
    curHost:true,
    type:'p'
});*/
