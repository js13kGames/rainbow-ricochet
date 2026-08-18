import Floor from "../structure/floor.js";

export default class Entity{
    constructor(x,y,z,radius){
        this.velocity = {x:0,z:0};
        this.position = {x:x,y:y,z:z};
        this.tempVector = {x:0,y:0,z:0};
        this.AABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        this.tempAABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
    }

    // Move the entity in x,y,z position (position + movement)
    // Also update the AABB which is used for collision checking between entities
    move(x,y,z){
        this.position.x = this.position.x + x;
        this.position.y = this.position.y + y;
        this.position.z = this.position.z + z;

        this.AABB.minX=this.position.x;
        this.AABB.minY=this.position.y;
        this.AABB.minZ=this.position.z;
        this.AABB.maxX=this.position.x+1;
        this.AABB.maxY=this.position.y+2;
        this.AABB.maxZ=this.position.z+1;
    }

    // Check if the entity can move to the position it wants to move to
    // Checks surronding structures and do AABB intersect checks against them
    canMove(game, x,y,z,radius=0.4){

        this.tempAABB.minX=x;
        this.tempAABB.minY=y;
        this.tempAABB.minZ=z;
        this.tempAABB.maxX=x+1;
        this.tempAABB.maxY=y+2;
        this.tempAABB.maxZ=z+1;
        console.log(this.tempAABB);

        var radius = radius;
        let x1 = Math.round(x + radius);
        let z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius);
        let z2 = Math.round(z - radius);

        var b1 = this.checkIntersects(game, x1,y,z1);
        var b2 = this.checkIntersects(game, x2,y,z1);
        var b3 = this.checkIntersects(game, x1,y,z2);
        var b4 = this.checkIntersects(game, x2,y,z2);

        if (b1.i) return {i:!b1.i,s:b1.s};
        if (b2.i) return {i:!b2.i,s:b2.s};
        if (b3.i) return {i:!b3.i,s:b3.s};
        if (b4.i) return {i:!b4.i,s:b4.s};
        return {i:true,s:null};
    }

    // Get sturcture and check if we will intersect with it
    checkIntersects(game, x,y,z){
        var s = game.level.getStructure(x,z);
        if (s == null) return false;
        var i = s.intersects(x,y,z,this.tempAABB);
        return {i,s};
    }

    // Check if this entity collides with another entity by doing a AABB check. Returns false if we try to check against ourselves.
    doesCollidesWithEntity(game,entity){
        if (entity == this) return false;
        return (entity.AABB.minX <= this.AABB.maxX && entity.AABB.maxX >= this.AABB.minX) &&
         (entity.AABB.minY <= this.AABB.maxY && entity.AABB.maxY >= this.AABB.minY) &&
         (entity.AABB.minZ <= this.AABB.maxZ && entity.AABB.maxZ >= this.AABB.minZ);
    }

    // Called when we are hit by an entity and which entity
    onEntityHit(game, entity){
    }

    dispose(game){
        this.disposed = true;
    }

    tick(game,deltaTime){

    }

    render(gl){

    }
}