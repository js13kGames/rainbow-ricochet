import Game from "../game.js";
import UI from "./ui.js";

export default class LevelSwitch extends UI{
    constructor(){
        super();
        this.clickDelay = 1;
    }

    tick(deltaTime){
        if (this.clickDelay >0) this.clickDelay -=deltaTime;
    }

    render(game){
        var currentLevel = game.currentLevel;
        if (currentLevel < 4 && this.clickDelay <=0 && game.input.firePressed) game.startLevel();
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawBackground(Game.glTexture.image,48,48,16,16,'#4444ab');



        if (currentLevel>0 && game.level !=null && game.level.endTime != null && game.level.startTime!=null){
            this.drawShadowedTextAt("Finished level "+(currentLevel),0,150,60,"white","black",true);
            if(game.level != null) this.drawShadowedTextAt("in "+((game.level.endTime-game.level.startTime)/1000).toFixed(1)+" seconds",0,250,40,"red","black",true);
        }

        if (game.playerDead){
            this.drawShadowedTextAt("Oh no, you died :(",0,150,60,"white","black",true);
        }

        if (currentLevel < 4){
            this.drawShadowedTextAt("Level "+(currentLevel+1)+":",0,450,40,"white","black",true);

            this.drawShadowedTextAt(game.levels[currentLevel][8]+" rainbow",0,550,40,"white","black",true);

            this.drawShadowedTextAt("<Click to play>",0,680,36,"white","black",true);
        }else{
            this.drawShadowedTextAt("You did it!",0,350,40,"white","black",true);
            this.drawShadowedTextAt("You saved the rainbow to be overtaken by darkness",0,450,40,"white","black",true);
            this.drawShadowedTextAt("and the last unicorn thanks you!",0,550,40,"white","black",true);
            this.drawShadowedTextAt("Thanks for playing // Nicklas",0,650,30,"green","black",true);
        }
    }

}