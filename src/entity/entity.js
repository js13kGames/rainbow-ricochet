export default class Entity{
    constructor(x,y,z){
        this.velocity = {x:0,z:0};
        this.position = {x:x,y:y,z:z};
        this.tempVector = {x:0,y:0,z:0};
        this.AABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        this.tempAABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
    }


    canMove(game, x,y,z,radius=0.4){

        this.tempAABB.minX=x;
        this.tempAABB.minY=y;
        this.tempAABB.minZ=z;
        this.tempAABB.maxX=x+1;
        this.tempAABB.maxY=y+2;
        this.tempAABB.maxZ=z+1;

        var radius = radius;
        let x1 = Math.round(x + radius);
        let z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius);
        let z2 = Math.round(z - radius);

        var b1 = this.checkIntersects(game, x1,y,z1);
        var b2 = this.checkIntersects(game, x2,y,z1);
        var b3 = this.checkIntersects(game, x1,y,z2);
        var b4 = this.checkIntersects(game, x2,y,z2);

        if (b1) return !b1;
        if (b2) return !b2;
        if (b3) return !b3;
        if (b4) return !b4;  
        return true;
    }

    checkIntersects(game, x,y,z){
        var s = game.level.getStructure(x,z);

        if (s == null) return false;
        var i = s.intersects(x,y,z,this.tempAABB);

        return i;
    }

    tick(game,deltaTime){

    }

    render(gl){

    }
}