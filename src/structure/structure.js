import Floor from "./floor.js";

export default class Structure{
    constructor(texture,tint,height=0){
        this.texture = texture;
        this.tint = tint;
        this.height = height;
        this.AABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
    }

    isSolid(){
        return false;
    }

    blocksLight(){
        return false;
    }

    intersects(x,y,z,checkAABB){
        var yMinAdjusted = this.height > 0 ? this.height : 0;
        var yMaxAdjusted = this.height > 0 ? 0.5 : 5;
        this.AABB.minX=x;
        this.AABB.minY=yMinAdjusted;
        this.AABB.minZ=z;
        this.AABB.maxX=x+1;
        this.AABB.maxY=y+yMaxAdjusted;
        this.AABB.maxZ=z+1;

        /*console.log(this.constructor.name);
        console.log("structure AABB");
        console.log(this.AABB);
        console.log("checkAABB");
        console.log(checkAABB);*/
       
        return (checkAABB.minX <= this.AABB.maxX && checkAABB.maxX >= this.AABB.minX) &&
         (checkAABB.minY <= this.AABB.maxY && checkAABB.maxY >= this.AABB.minY) &&
         (checkAABB.minZ <= this.AABB.maxZ && checkAABB.maxZ >= this.AABB.minZ);
    }
}