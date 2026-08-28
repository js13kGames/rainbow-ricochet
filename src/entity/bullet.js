import Game from "../game.js";
import MathUtil from "../mathutil.js";
import Darkness from "./darkness.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
import Player from "./player.js";
import RainBow from "./rainbow.js";

export default class Bullet extends Entity{
    constructor(x,y,z,direction,speed,owner,bounce=false){
        super(x,y,z);
        this.heightOverGround = y;
        this.direction = direction;
        this.speed = speed;
        this.bounce = bounce;
        this.ignoreCollisions = false;
        this.owner = owner;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.tempVector.x = this.position.x - this.direction.x * (this.speed * deltaTime);
        this.tempVector.z = this.position.z - this.direction.z * (this.speed * deltaTime);

        if (this.ignoreCollisions){
            this.move(this.tempVector.x-this.position.x,0,this.tempVector.z-this.position.z);
        }else{
            if (this.canMove(game, this.tempVector.x,this.heightOverGround,this.position.z,0.2).i){
                this.move(this.tempVector.x-this.position.x,0,0);
                this.position.y = this.heightOverGround;
            }
            else{
                if (this.bounce) this.direction.x = -this.direction.x;
                this.onStructureHit(game,this.tempVector); // This should probably move to the entity class
            }
                
            if (this.canMove(game, this.position.x,this.heightOverGround,this.tempVector.z,0.2).i){
                this.move(0,0,this.tempVector.z-this.position.z);
                this.position.y = this.heightOverGround;
            }
            else{
                if (this.bounce) this.direction.z = -this.direction.z;
                this.onStructureHit(game,this.tempVector); // This should probably move to the entity class
            }
        }

        this.mesh.setPos(this.position.x,this.position.y,this.position.z);
    }

    // Called when we hit a structure at the given position
    onStructureHit(game, pos){
    }
    onEntityHit(game,entity){
        if (
            (entity instanceof Darkness && !(this.owner instanceof Darkness))
            || (entity instanceof Player && !(this.owner instanceof Player)) 
            && !(this instanceof RainBow)){
            this.disposed = true;
            this.explode(game);
        }
    }

    explode(game,baseSize){
        for (let i = 0; i < 20; i++){
            var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            var p = new Particle(this.position.x,this.position.y,this.position.z,MathUtil.getRandom(0.5,1.9),{x:MathUtil.getRandom(-0.3,0.3), y: Math.random()/1.5, z: MathUtil.getRandom(-0.3,0.3)},0.05,[c[0],c[1],c[2],0.9],baseSize+MathUtil.getRandom(0.001,0.005));
            game.level.addParticle(p);
        }
    }
}