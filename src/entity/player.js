import Game from "../game.js";
import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Door from "./door.js";
import Entity from "./entity.js";
import Key from "./key.js";
import LevelExit from "./levelexit.js";
import Rainbow from "./rainbow.js";
import UnicornHorn from "./unicornhorn.js";
import UnicornhornBullet from "./unicornhornbullet.js";

export default class Player extends Entity{
    constructor(x,y,z) {
        super(x,y,z);

        this.strafe = {x:0,z:0};
        this.speed = 8;
        this.hurtDelay = this.primaryFireDelay = this.secondaryFireDelay = 0;
        this.currentHealth = 8;
        this.maxHealth = 10;
        this.headBobCounter = 0;
        this.hasRainbowInHand = true;
        this.hasUnicornInHand = true;
        this.keysHold = [];

        //this.keysHold.push(Door.blue);
        this.keysHold.push(Door.green);
        //this.keysHold.push(Door.yellow);
        this.move(0,0,0);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.primaryFireDelay -= deltaTime;
        this.secondaryFireDelay -= deltaTime;
        this.hurtDelay -= deltaTime;
        

        Game.camera.rotate(-game.input.pointer.x/500);
        Game.camera.rotateX(-game.input.pointer.y/500);
        this.velocity.z = game.input.axes.y;

        this.strafe.x = 0;
        this.strafe.z = 0;

        let cameraDirection = Game.camera.getDirection();
        if (game.input.axes.x < 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.up);
        if (game.input.axes.x > 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.down);

        if (this.velocity.x !=0 || this.velocity.z != 0){
            this.headBobCounter += deltaTime;
        }else{
            this.headBobCounter = 0;
        }

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

            var moveX = this.canMove(game, this.tempVector.x,this.position.y,this.position.z);
            var moveZ = this.canMove(game, this.position.x,this.position.y,this.tempVector.z);
            if (moveX.i) this.move(this.tempVector.x-this.position.x,0,0);
            if (moveZ.i) this.move(0,0,this.tempVector.z-this.position.z);

            if (moveX.s != null && (moveX.s instanceof Floor && moveX.s.height >0 && moveX.s.height - this.position.y < 0.76)){
                this.move(this.tempVector.x-this.position.x,0,0);
                this.position.y = moveX.s.height;
            }else if (moveX.s == null) this.position.y = 0;
            if (moveZ.s != null && (moveZ.s instanceof Floor && moveZ.s.height >0 && moveZ.s.height - this.position.y < 0.76)){
                this.move(0,moveZ.s.height,this.tempVector.z-this.position.z);
                this.position.y = moveZ.s.height;
            }else if (moveZ.s == null) this.position.y = 0;

        }
        Game.camera.position.x = this.position.x;
        Game.camera.position.y = Game.camera.heightOverGround + this.position.y + (Math.sin(this.headBobCounter*10)/15);
        Game.camera.position.z = this.position.z;

        if (this.hasRainbowInHand && this.rainbowInHand == null){
            this.rainbowInHand = new Rainbow(0,0,0,{x:0,y:0,z:0},0,0.5);
        }

        if (this.hasUnicornInHand && this.unicornInHand == null){
            this.unicornInHand = new UnicornHorn(0,0,0);
            this.unicornInHand.inHandYOffset = 0.6;
        }

        // Fire unicornhorn bullets
        if (this.hasUnicornInHand && game.input.firePressed && this.primaryFireDelay <= 0.0){
            //game.level.addEntity(new UnicornhornBullet(this.position.x,this.position.y + 0.9,this.position.z,cameraDirection,40));
            game.level.shootBullet(this.position.x,this.position.y + 0.9,this.position.z,cameraDirection,40,this);
            this.primaryFireDelay = 0.3;
            game.playShoot();
            this.unicornInHand.inHandYOffset = 0.6;
        }

        // Fire rainbow boomerang
        if (this.hasRainbowInHand && game.input.secondFirePressed && this.secondaryFireDelay <= 0.0){
            game.level.addEntity(new Rainbow(this.position.x,this.position.y+0.9,this.position.z,cameraDirection,20));
            this.secondaryFireDelay = 0.9;
            this.hasRainbowInHand = false;
            game.throwRainbow();
        }

        if (this.rainbowInHand != null && !this.hasRainbowInHand && this.rainbowInHand.inHandYOffset > -1){
            this.rainbowInHand.inHandYOffset -= deltaTime*3.5;
            this.rainbowInHand.inHandXOffset -= deltaTime*3.5;
            this.rainbowInHand.inHandYOffset = Math.max(-1,this.rainbowInHand.inHandYOffset);
            this.rainbowInHand.inHandXOffset = Math.max(-1,this.rainbowInHand.inHandXOffset);
        }else if (this.hasRainbowInHand && this.rainbowInHand.inHandYOffset < 0){
            this.rainbowInHand.inHandYOffset += deltaTime*3.5;
            this.rainbowInHand.inHandXOffset += deltaTime*3.5;
            this.rainbowInHand.inHandYOffset = Math.min(0,this.rainbowInHand.inHandYOffset);
            this.rainbowInHand.inHandXOffset = Math.min(0,this.rainbowInHand.inHandXOffset);
        }

        if (this.unicornInHand != null && this.unicornInHand.inHandYOffset > 0){
            this.unicornInHand.inHandYOffset -= deltaTime*3;
        }

        
    }

    onEntityHit(game,entity){

        if (entity instanceof UnicornhornBullet && !(entity.owner instanceof Player) && this.hurtDelay <=0){
            this.currentHealth--;
            game.playerHurt();
            this.hurtDelay = 0.5;
        }

        if (entity instanceof Rainbow){
            if (entity.pickup && !entity.disposed) game.pickedUp("A RAINBOW");
            if (entity.bounces > 0 || entity.pickup){
                this.hasRainbowInHand = true;
                game.catchRainbow();
                entity.dispose(game);
            }
        }

        if (entity instanceof Door){
            entity.unlockDoor(game,this);
        }

        if (entity instanceof LevelExit){
            game.switchLevel();
        }

        if (entity instanceof Key){
            game.pickupKey();
            this.keysHold.push(entity.keyType);
            game.pickedUp("A KEY");
            game.level.deleteEntity(entity);
        }

        if (entity instanceof UnicornHorn){
            this.hasUnicornInHand = true;
            game.pickupKey();
            game.pickedUp("AN UNICORN HORN");
            game.level.deleteEntity(entity);
        }
    }

    renderInHand(){
        if (this.rainbowInHand != null && this.rainbowInHand.inHandYOffset > -1){
            this.rainbowInHand.renderinHand();
        }

        if (this.unicornInHand != null){
            this.unicornInHand.renderinHand();
        }
    }
}