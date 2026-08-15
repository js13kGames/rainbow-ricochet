import Game from "./game.js"

var game = new Game();

loop();

function loop(){
    requestAnimationFrame(loop);

    game.update();
}