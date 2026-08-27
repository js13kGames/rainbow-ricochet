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

        this.drawTextAt("HEALTH:",56,40,24);
        this.drawTextAt(game.player.health, 126,42,26,"red");

        this.drawTextAt(game.stableFPS +" FPS", this.canvas.width-100,42,26,"white");

    }


    drawTextAt(text,x,y,size,color="white"){
        this.context.font=size+"px monospace";
        this.context.fillStyle = color;
        this.context.textAlign = "center";
        this.context.fillText(text,x,y);
    }


}