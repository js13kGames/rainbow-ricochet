import Game from "../game.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
export default class LevelExit extends Entity{
    constructor(level,x,y,z){
        super(level,x,y,z);
        this.AABB.minX=x-0.5;
        this.AABB.minY=y;
        this.AABB.minZ=z-0.5;
        this.AABB.maxX=this.position.x+1.5;
        this.AABB.maxY=this.position.y+level.height;
        this.AABB.maxZ=this.position.z+1.5;
    }


    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (Math.random()< 0.1){
            //var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            game.level.addParticle(new Particle(game.level,(this.position.x-0.5)+Math.random(),this.position.y,(this.position.z-0.5)+Math.random(),6,{x:0,y:1,z:0},Math.max(0.01,Math.random()/80),[0.0,1.0,0.0,0.9],0.05));
        }
    }
}