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
               this.context.drawImage(Game.glTexture.image,16,48,16,16,x*256,y*256,256,256);
               this.context.globalCompositeOperation = 'multiply';
               this.context.fillStyle = '#2cabab';
               this.context.fillRect(x*256,y*256,256,256);
               this.context.globalCompositeOperation = 'source-over';
            }
        }

        this.drawShadowedTextAt("THE LAST UNICORN",320,100,70,"white","black");

        this.drawShadowedTextAt("A game for JS13k 2026",350,200,48,"white","black");
        this.drawShadowedTextAt("by Nicklas Löf",450,280,48,"white","black");

        this.drawShadowedTextAt("Additional graphics by Isadu at itch.io",180,380,40,"white","black");

        this.drawShadowedTextAt("Save the last unicorn from being overtaken by darkness",210,520,26,"white","black");
        this.drawShadowedTextAt("by travel to the unicorn rainbow",396,600,26,"white","black");

        this.drawShadowedTextAt("<<Click to focus and start>>",340,680,36,"white","black");
    }

    drawShadowedTextAt(message,x,y,size,color1,color2){
        this.drawTextAt(message,x+6,y+6,size,color2);
        this.drawTextAt(message,x,y,size,color1);
    }
}