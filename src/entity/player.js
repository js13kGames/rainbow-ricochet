import Game from "../game.js";
import MathUtil from "../mathutil.js";
import Entity from "./entity.js";
import Rainbow from "./rainbow.js";

export default class Player extends Entity{
    constructor(x,y,z) {
        super(x,y,z);

        this.strafe = {x:0,z:0};
        this.speed = 5;
        this.fireDelay = 0;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.fireDelay -= deltaTime;

        game.gl.camera.rotate(-game.input.pointer.x/500);
        game.gl.camera.rotateX(-game.input.pointer.y/500);
        this.velocity.z = game.input.axes.y;

        this.strafe.x = 0;
        this.strafe.z = 0;

        let cameraDirection = game.gl.camera.getDirection();
        if (game.input.axes.x < 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.up);
        if (game.input.axes.x > 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.down);

        if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
            //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
            this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
            this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;
            this.tempVector.y = 0;
            //normalize it to prevent moving faster when strafing and moving forward/backward at the same time
            MathUtil.normalize(this.tempVector);

            //multiply the final normalized movement with the speed the player will move
            this.tempVector.x *= this.speed * deltaTime;
            this.tempVector.z *= this.speed * deltaTime;

            //finally add the current position of the player to the calculated movement vector
            this.tempVector.x += this.position.x;
            this.tempVector.z += this.position.z;

            // check if the player can move in x or z direction to allow slide along walls
            
            if (this.canMove(game, this.tempVector.x,this.position.y,this.position.z)) this.position.x += this.tempVector.x-this.position.x;
            if (this.canMove(game, this.position.x,this.position.y,this.tempVector.z)) this.position.z += this.tempVector.z-this.position.z;

            game.gl.camera.position.x = this.position.x;
            game.gl.camera.position.z = this.position.z;
        }

        if (game.input.firePressed && this.fireDelay <= 0.0){
            game.level.entities.push(new Rainbow(game.gl,game.shaderProgram,game.glTexture,this.position.x,0.1,this.position.z,cameraDirection,8));
            this.fireDelay = 0.9;
        } 

    }
}