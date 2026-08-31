import Game from "../game.js";
import UI from "./ui.js";

export default class Intro extends UI{
    constructor(width,height){
        super(width,height);
    }

    tick(deltaTime){

    }

    render(game){
        if (game.input.firePressed) game.state = "game";
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        
        
        for (let x = 0; x <10; x++){
            for (let y = 0; y < 10;y++){
               this.context.drawImage(Game.glTexture.image,0,0,16,16,x*256,y*256,256,256);
               this.context.globalCompositeOperation = 'multiply';
               this.context.fillStyle = '#2cabab';
               this.context.fillRect(x*256,y*256,256,256);
               this.context.globalCompositeOperation = 'source-over';
            }
        }

        this.drawShadowedTextAt("THE LAST UNICORN",370,100,100,"white","black");

        this.drawShadowedTextAt("A game for JS13k 2026",530,200,48,"white","black");
        this.drawShadowedTextAt("by Nicklas Löf",630,280,48,"white","black");

        this.drawShadowedTextAt("Additional graphics by Isadu at itch.io",390,380,40,"white","black");

        this.drawShadowedTextAt("Save the last unicorn from being overtaken by darkness",430,580,26,"white","black");
        this.drawShadowedTextAt("by travel to the unicorn rainbow",596,640,26,"white","black");

        this.drawShadowedTextAt("<<Click to focus and start>>",540,760,36,"white","black");
    }

    drawShadowedTextAt(message,x,y,size,color1,color2){
        this.drawTextAt(message,x+6,y+6,size,color2);
        this.drawTextAt(message,x,y,size,color1);
    }
}