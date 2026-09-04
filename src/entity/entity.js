import Floor from "../structure/floor.js";
import Wall from "../structure/wall.js";

export default class Entity{
    constructor(level,x,y,z,radius,collisions=true){
        this.velocity = {x:0,z:0};
        this.position = {x:x,y:y,z:z};
        this.tempVector = {x:0,y:0,z:0};
        this.AABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        this.tempAABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        this.yOffset = 0;
        this.currentHealth = 1;
        this.maxHealth = 1;
        this.sectorX = level.worldPosToGrid(x);
        this.sectorZ = level.worldPosToGrid(z);
        this.collisions = collisions;
        if (this.collisions) level.setEntitySector(null,null,this.sectorX,this.sectorZ,this);
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
        this.AABB.maxY=this.position.y+4.25+this.yOffset;
        this.AABB.maxZ=this.position.z+1;
    }

    updateSector(level){
        if (!this.collisions) return;
        let newSectorX = level.worldPosToGrid(this.position.x);
        let newSectorZ = level.worldPosToGrid(this.position.z);
        if (newSectorX != this.sectorX || newSectorZ != this.sectorZ){
            level.setEntitySector(this.sectorX, this.sectorZ,newSectorX,newSectorZ,this);
            this.sectorX = newSectorX;
            this.sectorZ = newSectorZ;
        }
    }

    // Check if the entity can move to the position it wants to move to
    // Checks surronding structures and do AABB intersect checks against them
    canMove(game, x,y,z,radius=0.4){

        this.tempAABB.minX=x;
        this.tempAABB.minY=y;
        this.tempAABB.minZ=z;
        this.tempAABB.maxX=x+1;
        this.tempAABB.maxY=y+4.25+this.yOffset;
        this.tempAABB.maxZ=z+1;
       // console.log(this.tempAABB);


        let x1 = Math.round(x + radius), z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius), z2 = Math.round(z - radius);

        let structures = [
            this.checkIntersects(game, x1, y, z1),
            this.checkIntersects(game, x2, y, z1),
            this.checkIntersects(game, x1, y, z2),
            this.checkIntersects(game, x2, y, z2),
        ];

        // This is ugly..  Prefer wall collisions over floor collisions (fake 3D trade‑off)
        for (let structure of structures) {
            if (structure.i && !(structure.s instanceof Floor)) return { i: !structure.i, s: structure.s };
        }
        for (let structure of structures) {
            if (structure.i) return { i: !structure.i, s: structure.s };
        }
        return { i: true, s: null };
    }

    // Get structure and check if we will intersect with it
    checkIntersects(game, x,y,z){
        var structure = game.level.getStructure(x,z);
        if (structure == null) return false;
        if (structure instanceof Floor) y = structure.height;

        var intersects = structure.intersects(game,x,y,z,this.tempAABB,this);
        return {i: intersects,s: structure};
    }

    doesCollideWithStructure(structure){
        return true;
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
        //console.log(this.constructor.name+ ":  "+entity.constructor.name);
        //console.log(entity.position);
        //console.log(this.position);
        //console.log("================================");
    }

    dispose(game){
        this.disposed = true;
    }

    tick(game,deltaTime){
        this.updateSector(game.level);
    }

    render(){

    }
}