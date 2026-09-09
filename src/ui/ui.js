import Darkness from "../entity/darkness.js";
import Game from "../game.js";
import DoorBlock from "../structure/doorblock.js";
import Glassblock from "../structure/glassblock.js";
import Wall from "../structure/wall.js";

export default class UI{
    constructor(){
        this.canvas = document.getElementById("u");
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.messages = [];
        this.messageTimer = 0;
        this.showMiniMap = false;
        this.mapKeyWasPressed = false;



    }

    tick(deltaTime){
        if (this.messageCountdown > 0){
            this.messageCountdown -= deltaTime;
        }else{
            this.messages.shift();
            if (this.messages.length > 0) this.messageCountdown = this.messages[0].length/3.5;

        }

        if(this.playerHurt>0) this.playerHurt-= deltaTime;
    }

    render(game){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        if (this.playerHurt >0){
            this.context.fillStyle = "salmon";
            this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        }

        //DEBUG this.drawTextAt("FPS: " + game.stableFPS, this.canvas.width-120,42,20,"white");
        //DEBUG this.drawTextAt("tick:" + game.stableTick+" ms", this.canvas.width-120,72,20,"white");
        //DEBUG this.drawTextAt("rend:" + game.stableRend+" ms", this.canvas.width-120,102,20,"white");
        //DEBUG this.drawTextAt("accu:" + game.accumulator.toFixed(1)+" ", this.canvas.width-120,132,20,"white");
        //DEBUG this.drawTextAt("time:" + game.time.toFixed(1)+" ", this.canvas.width-120,162,20,"white");
        //DEBUG this.drawTextAt("step:" + game.stepTime.toFixed(1)+" ", this.canvas.width-120,192,20,"white");

        //DEBUG this.drawTextAt("x:" + game.level.player.position.x.toFixed(1)+" z:"+game.level.player.position.z.toFixed(1), this.canvas.width-150,222,20,"white");
        
        var mapPressed = game.input.mapPressed;
        if (mapPressed && !this.mapKeyWasPressed) {
            this.showMiniMap = !this.showMiniMap; // toggle
        }
        this.mapKeyWasPressed = mapPressed;

        if (this.showMiniMap){
            this.drawMiniMap(game);
        }else{
            this.context.drawImage(Game.glTexture.image,0,59,5,5,(this.canvas.width/2)-8,(this.canvas.height/2)-2,16,16); //crosshair
            if(game.level.player.hasUnicornInHand) this.drawTextAt("BULLETS:",56,this.canvas.height-90,24);
            if(game.level.player.hasUnicornInHand) this.drawTextAt(game.level.player.bullets,180,this.canvas.height-90,24,"red");
            this.drawTextAt("HEALTH :",56,this.canvas.height-120,24);
            this.drawTextAt(((game.level.player.currentHealth/game.level.player.maxHealth)*100).toFixed(0)+"%", 180,this.canvas.height-120,26,"red");

            game.level.player.keysHold.forEach((k,i)=>{
                var x = 16 + 32 * i, y = this.canvas.height - 80;
                if (i>0){
                    this.context.drawImage(Game.glTexture.image,32,16,16,16,x,y,32,32);
                    this.context.globalCompositeOperation = 'source-atop';
                    this.context.fillStyle = `rgba(${k[0] * 255}, ${k[1] * 255}, ${k[2] * 255}, .4)`;
                    this.context.fillRect(x,y,32,32);
                    this.context.globalCompositeOperation = 'source-over';
                    }
            })            
        }
        

        if (this.messages.length >0){
            for (let i =0;i < 3; i++){
                let message = this.messages[i];
                if(message != null) this.drawTextAt(message,27,33+(i*40),28,"black");
                if(message != null) this.drawTextAt(message,24,30+(i*40),28,"red");
            }
        }
    }

    drawMiniMap(game){
        this.context.globalCompositeOperation = 'multiply';
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.context.globalCompositeOperation = 'source-over';
        this.context.font="8px monospace";
        for (var x = 0;x < 64;x++){
            for (var z = 0; z < 64;z++){
                var draw = true;
                var s = game.level.getStructure(x,z);
                if (s instanceof Wall)
                    this.context.fillStyle = "white";
                else if (s instanceof Glassblock)
                    this.context.fillStyle = "gray";
                else if (s instanceof DoorBlock)
                    this.context.fillStyle = "red";
                else
                    draw = false;
                
                if (draw) this.context.fillText("#",384+(x*8),(this.canvas.height/6)+(z*8));
            }
        }
        
        var px = game.level.player.position.x;
        var pz = game.level.player.position.z;
        this.context.fillStyle = "green";
        this.context.font="12px monospace";
        this.context.fillText("@",384+(px*8),(this.canvas.height/6)+(pz*8));
// DEBUG
/*        if (game.level.player.printMap){
            for (let [key, value] of  game.level.player.pathFinding.entries()) {
                var [x, z] = key.split(',').map(Number);
                this.context.fillStyle = "white";
                this.context.font="8px monospace";
                //this.context.fillText(value,10+(x*8),10+(z*8));
                this.context.fillText(value,384+(x*8),(this.canvas.height/6)+(z*8));
            }
                
                //this.context.font="8px monospace";
                //this.context.fillText("#",10+(x*8),10+(z*8));
            
        }

        game.level.entities.forEach(e=>{
            if (e instanceof Darkness){
                this.context.fillStyle = "red";
                this.context.fillText("e",384+(Math.floor(e.position.x)*8),(this.canvas.height/6)+(Math.floor(e.position.z)*8));
            }
        })*/
        
    }

    drawBackground(image,ix,iy,w,h,tint){
        for (let x = 0; x <10; x++){
            for (let y = 0; y < 10;y++){
                this.context.drawImage(image,ix,iy,w,h,x*256,y*256,256,256);
                this.context.globalCompositeOperation = 'multiply';
                this.context.fillStyle = tint;
                this.context.fillRect(x*256,y*256,256,256);
                this.context.globalCompositeOperation = 'source-over';
            }
        }
    }

     drawShadowedTextAt(message,x,y,size,color1,color2,center=false){
        this.drawTextAt(message,x+6,y+6,size,color2,center);
        this.drawTextAt(message,x,y,size,color1,center);
    }

    drawTextAt(text,x,y,size,color="white",center=false){
        this.context.font=size+"px monospace";
        this.context.fillStyle = color;
        if (center) this.context.textAlign = "center";
        else this.context.textAlign = "left";
        this.context.fillText(text,center?this.canvas.width/2:x,y);
    }

    queueMessage(message){
        this.messages.push(message);
        this.messageCountdown = message.length/3.5;
    }

    showPlayerHurt(){
        this.playerHurt = 0.2;
    }

    clearMessages(){
        this.messages = [];
    }


}