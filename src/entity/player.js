import Game from "../game.js";
import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Door from "./door.js";
import Entity from "./entity.js";
import HealthPickup from "./health.js";
import Key from "./key.js";
import LevelExit from "./levelexit.js";
import PoisionEntity from "./poisionentity.js";
import Rainbow from "./rainbow.js";
import UnicornHorn from "./unicornhorn.js";
import UnicornhornBullet from "./unicornhornbullet.js";

export default class Player extends Entity{
    constructor(level,x,y,z) {
        super(level,x,y,z);

        this.strafe = {x:0,z:0};
        this.speed = 10;
        this.hurtDelay = this.primaryFireDelay = this.secondaryFireDelay = 2;
        this.currentHealth = 10;
        this.maxHealth = 10;
        this.bobCounter = 0;
        //this.hasRainbowInHand = true;
        //this.hasUnicornInHand = true;
        this.keysHold = [];
        this.keysHold.push(Door.secret);

        this.cameraSensitivity = 210;

        //this.keysHold.push(Door.blue);
        //this.keysHold.push(Door.green);
        //this.keysHold.push(Door.yellow);
        this.move(0,0,0);
        this.cameraYOffset = y;
        this.yTarget = y;
    }

    updateCamera(game){
        Game.camera.rotate(-game.input.pointer.x/this.cameraSensitivity);
        Game.camera.rotateX(-game.input.pointer.y/this.cameraSensitivity);
        game.input.resetMouse();

        Game.camera.position.x = this.position.x;
        //Game.camera.position.y = Game.camera.heightOverGround + this.cameraYOffset + this.position.y + (Math.sin(this.bobCounter*10)/15);
        Game.camera.position.y = Game.camera.heightOverGround + this.cameraYOffset + (Math.sin(this.bobCounter*10)/15);
        Game.camera.position.z = this.position.z;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (this.currentHealth <= 0) game.playerDied();

        var cameraYTargetDiff = this.yTarget - this.cameraYOffset;
        this.cameraYOffset = Math.abs(cameraYTargetDiff) > 0.08 ? this.cameraYOffset + (cameraYTargetDiff > 0 ? 0.08 : -0.2) : this.yTarget;

        this.primaryFireDelay -= deltaTime;
        this.secondaryFireDelay -= deltaTime;
        this.hurtDelay -= deltaTime;
        
        this.velocity.z = game.input.axes.y;

        this.strafe.x = 0;
        this.strafe.z = 0;

        let cameraDirection = Game.camera.getDirection();
        if (game.input.axes.x < 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.up);
        if (game.input.axes.x > 0) MathUtil.crossProduct(this.strafe,cameraDirection,Game.down);

        if (this.velocity.x !=0 || this.velocity.z != 0){
            this.bobCounter += deltaTime;
        }else{
            this.bobCounter = 0;
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
                if (this.position.y != moveX.s.height){
                    this.yTarget = moveX.s.height;
                }
                this.position.y = moveX.s.height;
            }else if (moveX.s == null){
                this.position.y = 0;
                this.yTarget = 0;
            }
            if (moveZ.s != null && (moveZ.s instanceof Floor && moveZ.s.height >0 && moveZ.s.height - this.position.y < 0.76)){
                this.move(0,moveZ.s.height,this.tempVector.z-this.position.z);
                if (this.position.y != moveZ.s.height){
                     this.yTarget = moveZ.s.height;
                }
                this.position.y = moveZ.s.height;
            }else if (moveZ.s == null){
                this.position.y = 0;
                this.yTarget = 0;
            }

        }


        if (this.hasRainbowInHand && this.rainbowInHand == null){
            this.rainbowInHand = new Rainbow(game.level,game,0,0,0,{x:0,y:0,z:0},0,0.5);
        }

        if (this.hasUnicornInHand && this.unicornInHand == null){
            this.unicornInHand = new UnicornHorn(game.level,0,0,0);
            this.unicornInHand.inHandYOffset = 0.6;
        }
        if (this.hasRainbowInHand){
            this.rainbowInHand.bobZ = Math.sin(this.bobCounter*10)/55;
            this.rainbowInHand.bobX = Math.cos(this.bobCounter*8)/55;
        }

        if (this.hasUnicornInHand){
            this.unicornInHand.bobZ = -Math.sin(this.bobCounter*10)/55;
            this.unicornInHand.bobX = -Math.cos(this.bobCounter*8)/55;
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
            game.level.addEntity(new Rainbow(game.level,game,this.position.x,this.position.y+0.9,this.position.z,cameraDirection,20));
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
        if (entity.disposed) return;

        if ((entity instanceof UnicornhornBullet || entity instanceof PoisionEntity) && !(entity.owner instanceof Player) && this.hurtDelay <=0){
            this.currentHealth--;
            game.ui.showPlayerHurt();
            game.playerHurt();
            this.hurtDelay = 0.8;
        }

        if (entity instanceof Rainbow){
            if (entity.pickup && !entity.disposed){
                game.pickedUp("RAINBOW");
                if (!game.alreadySeenRainbowMessage) game.ui.queueMessage("FIRE WITH RIGHT MOUSE BUTTON.");
                game.alreadySeenRainbowMessage = true;
            }
            if (entity.bounces > 0 || entity.pickup){
                this.hasRainbowInHand = true;
                game.catchRainbow();
                if (entity.sensor) entity.sensor.disposed = true;
                entity.dispose(game);
            }
        }

        if (entity instanceof HealthPickup){
            if (this.currentHealth < this.maxHealth){
                game.healthPickedUp();
                this.currentHealth += entity.ammount;
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
            game.pickedUp("KEY");
            game.level.deleteEntity(entity);
        }

        if (entity instanceof UnicornHorn){
            this.hasUnicornInHand = true;
            game.pickupKey();
            game.pickedUp("UNICORN HORN");
            if (!game.alreadySeenUnicornMessage) game.ui.queueMessage("FIRE WITH LEFT MOUSE BUTTON.");
            game.alreadySeenUnicornMessage=true;
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