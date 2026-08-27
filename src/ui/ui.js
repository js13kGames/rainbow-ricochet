import Game from "../game.js";

export default class UI{
    constructor(width,height){
        this.canvas = document.getElementById("u");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;



    }

    tick(deltaTime){
        
    }

    render(game){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.drawImage(Game.glTexture.image,0,59,5,5,(this.canvas.width/2)-8,(this.canvas.height/2)-2,16,16);

        this.drawTextAt("health",10,40,14);
        this.drawTextAt(""+game.player.health, 140,38,18);

    }


    drawTextAt(text,x,y,size){
        for (let i = 0; i < text.length; i++) {
            var c = text.toUpperCase().charCodeAt(i);
            var idx = c - (c < 64 ? 48 : 55);
            var row = idx < 12 ? 0 : idx < 24 ? 1 : 2;
            idx %= 12;
            this.context.drawImage(Game.glTexture.image, idx * 5, 44 + row * 5, 5, 5, x, y, size, size);
            x += size + 5;
        }
        /*this.context.font=font==null?"14px monospace":font;
        this.context.fillStyle = "white";
        this.context.textAlign = "center";
        this.context.fillText(text,x,y);*/
    }


}