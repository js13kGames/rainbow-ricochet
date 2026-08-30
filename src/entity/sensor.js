import Darkness from "./darkness.js";
import Entity from "./entity.js";
import Rainbow from "./rainbow.js";

export default class Sensor extends Entity{
    constructor(level,x,y,z,size,filter) {
        super(level,x,y,z);
        this.size = size;
        this.updateAABB(level);
        this.list = new Set();
        this.filter = filter;
        this.listReset = 0;
    }

    onEntityHit(game, entity){
        if (!(entity instanceof this.filter)) return;
        this.list.add(entity);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.listReset++;
        if (this.listReset >=3){
            this.list.clear();
            this.listReset = 0;
        }
        this.updateAABB(game.level);
    }

    updateAABB(level){
        this.AABB.minX=this.position.x-this.size/2;
        this.AABB.minY=this.position.y;
        this.AABB.minZ=this.position.z-this.size/2;
        this.AABB.maxX=this.position.x+this.size/2;
        this.AABB.maxY=this.position.y+level.height;
        this.AABB.maxZ=this.position.z+this.size/2;
    }
}