import Game from "../game.js";

export default class UI{
    constructor(width,height){
        this.canvas = document.getElementById("u");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.messages = [];
        this.messageTimer = 0;



    }

    tick(deltaTime){
        if (this.messageCountdown > 0){
            this.messageCountdown -= deltaTime;
        }else{
            this.messages.pop();
            if (this.messages.length > 0) this.messageCountdown = 3.5;
        }

        if(this.playerHurt>0) this.playerHurt-= deltaTime;
    }

    render(game){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        if (this.playerHurt >0){
            this.context.fillStyle = "salmon";
            this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        }

        this.context.drawImage(Game.glTexture.image,0,59,5,5,(this.canvas.width/2)-8,(this.canvas.height/2)-2,16,16);

        this.drawTextAt("HEALTH:",56,this.canvas.height-100,24);
        this.drawTextAt(((game.player.currentHealth/game.player.maxHealth)*100).toFixed(0)+"%", 166,this.canvas.height-100,26,"red");

        this.drawTextAt("FPS: "+game.stableFPS, this.canvas.width-120,42,20,"white");
        this.drawTextAt("tick:" + game.stableTick+" ms", this.canvas.width-120,72,20,"white");
        this.drawTextAt("rend:" + game.stableRend+" ms", this.canvas.width-120,102,20,"white");

        if (this.messages.length >0){
            for (let i =0;i < 3; i++){
                let message = this.messages[i];
                if(message != null) this.drawTextAt(message,27,33+(i*40),28,"black");
                if(message != null) this.drawTextAt(message,24,30+(i*40),28,"red");
            }
        }
    }

    drawTextAt(text,x,y,size,color="white"){
        this.context.font=size+"px monospace";
        this.context.fillStyle = color;
        //this.context.textAlign = "center";
        this.context.fillText(text,x,y);
    }

    queueMessage(message){
        this.messages.push(message);
        this.messageCountdown = 3.5;
    }

    showPlayerHurt(){
        this.playerHurt = 0.2;
    }


}