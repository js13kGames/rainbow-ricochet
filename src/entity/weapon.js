import Entity from "./entity.js";

export default class Bullet extends Entity{
    constructor(x,y,z,direction,speed){
        super(x,y,z);
        this.direction = direction;
        this.speed = speed;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);

        this.tempVector.x = this.position.x - this.direction.x * (this.speed * deltaTime);
        this.tempVector.z = this.position.z - this.direction.z * (this.speed * deltaTime);

        if (this.canMove(game, this.tempVector.x,this.position.y,this.position.z,0.2))
            this.move(this.tempVector.x-this.position.x,0,0);
        else{
            this.direction.x = -this.direction.x;
            this.onStructureHit(this.tempVector); // This should probably move to the entity class
        }
            
        if (this.canMove(game, this.position.x,this.position.y,this.tempVector.z,0.2))
            this.move(0,0,this.tempVector.z-this.position.z);
            //this.position.z = this.tempVector.z;
        else{
            this.direction.z = -this.direction.z;
            this.onStructureHit(this.tempVector); // This should probably move to the entity class
        }
    }

    // Called when we hit a structure at the given position
    onStructureHit(pos){

    }
}