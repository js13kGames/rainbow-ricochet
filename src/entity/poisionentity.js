import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Entity from "./entity.js";
import Particle from "./particle.js";

export default class PoisionEntity extends Entity{
    constructor(level,x,y,z){
        super(level,x,y,z);
        this.move(0,0,0);
        this.distanceToPlayer = {x:0, z:0};
        this.hasPlayerAggro = false;
        this.AABB.minX=x+0.3;
        this.AABB.minY=y;
        this.AABB.minZ=z+0.3;
        this.AABB.maxX=x+0.3;
        this.AABB.maxY=y+1;
        this.AABB.maxZ=z+0.3;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.distanceToPlayer.x = game.level.player.position.x - this.position.x;
        this.distanceToPlayer.y = 0;
        this.distanceToPlayer.z = game.level.player.position.z - this.position.z;
        var length = MathUtil.length(this.distanceToPlayer);

        if (length < 20){
            if (Math.random()<0.005){
                game.level.addParticle(new Particle(game.level,(this.position.x-0.5)+Math.random(),this.position.y-1,(this.position.z-0.5)+Math.random(),6,{x:0,y:1,z:0},Math.max(0.01,Math.random()/80),[0.0,1.0,0.0,0.9],0.05,0.003));
            }
        }
    }    
}