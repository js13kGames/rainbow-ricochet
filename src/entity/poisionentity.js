import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Entity from "./entity.js";
import Particle from "./particle.js";

export default class PoisionEntity extends Entity{
    constructor(level,x,y,z){
        super(level,x,y,z);
        this.move(0,0,0);
        this.distanceToPlayer = {x:0, z:0};
        this.aggroRange = 20;
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

        // Reused from Darkness. Also kept the variablenames (aggro should be active) just to make zip compression more happy.
        if (length < this.aggroRange){
            /*var p = MathUtil.bresenham(Math.ceil(this.position.x), Math.ceil(this.position.z), Math.ceil(game.level.player.position.x), Math.ceil(game.level.player.position.z), Math.ceil(length));
            for (let pi = 0; pi < p.length; pi++){
                var point = p[pi];
                var s = game.level.getStructure(point.x, point.y);
                if (s != null && !s.blocksLight()) {
                    if ((s instanceof Floor && s.height > 0)){
                        this.hasPlayerAggro = false;
                        break;
                    }
                    if (point.x == Math.ceil(game.level.player.position.x) && point.y == Math.ceil(game.level.player.position.z)){
                        if (!this.hasPlayerAggro){
                                this.hasPlayerAggro = true;
                            }
                        }
                }else{
                    this.hasPlayerAggro = false;
                    break;
                } 
            }
        }else {
            this.hasPlayerAggro = false;
        }*/
        //if (this.hasPlayerAggro){
            if (Math.random()<0.005){
                game.level.addParticle(new Particle(game.level,(this.position.x-0.5)+Math.random(),this.position.y-1,(this.position.z-0.5)+Math.random(),6,{x:0,y:1,z:0},Math.max(0.01,Math.random()/80),[0.0,1.0,0.0,0.9],0.05,0.003));
            }
        }
        
    }    
}