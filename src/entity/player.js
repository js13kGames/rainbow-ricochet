import Game from "../game.js";
import MathUtil from "../mathutil.js";
import Entity from "./entity.js";
import Rainbow from "./rainbow.js";
import UnicornhornBullet from "./unicornhornbullet.js";

export default class Player extends Entity{
    constructor(x,y,z) {
        super(x,y,z);

        this.strafe = {x:0,z:0};
        this.speed = 8;
        this.primaryFireDelay = this.secondaryFireDelay = 0;
        this.hasRainbowInHand = true;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.primaryFireDelay -= deltaTime;
        this.secondaryFireDelay -= deltaTime;

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

            // check if the player can move in x or z direction separetly to allow slide along walls

            if (this.canMove(game, this.tempVector.x,this.position.y,this.position.z)) this.move(this.tempVector.x-this.position.x,0,0);
            if (this.canMove(game, this.position.x,this.position.y,this.tempVector.z)) this.move(0,0,this.tempVector.z-this.position.z);
        }

        game.gl.camera.position.x = this.position.x;
        game.gl.camera.position.z = this.position.z;

        // Fire unicornhorn bullets
        if (game.input.firePressed && this.primaryFireDelay <= 0.0){
            game.level.addEntity(new UnicornhornBullet(game.gl,game.shaderProgram,game.glTexture,this.position.x,0.9,this.position.z,cameraDirection,12));
            this.primaryFireDelay = 0.3;
        }

        // Fire rainbow boomerang
        if (this.hasRainbowInHand && game.input.secondFirePressed && this.secondaryFireDelay <= 0.0){
            game.level.addEntity(new Rainbow(game.gl,game.shaderProgram,game.glTexture,this.position.x,0.9,this.position.z,cameraDirection,8));
            this.secondaryFireDelay = 0.9;
            this.hasRainbowInHand = false;
        }
    }

    onEntityHit(game,entity){
        if (entity instanceof Rainbow){
            if (entity.bounces > 0){
                this.hasRainbowInHand = true;
                entity.dispose(game);
            }
        }
    }
}