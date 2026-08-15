import Entity from "./entity.js";

export default class Weapon extends Entity{
    constructor(x,y,z,direction,speed){
        super(x,y,z);
        this.direction = direction;
        this.speed = speed;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        //this.position.x -= this.direction.x * (this.speed * deltaTime);
        //this.position.z -= this.direction.z * (this.speed * deltaTime);

        this.tempVector.x = this.position.x - this.direction.x * (this.speed * deltaTime);
        this.tempVector.z = this.position.z - this.direction.z * (this.speed * deltaTime);

        if (this.canMove(game, this.tempVector.x,this.position.y,this.position.z,0.2))
            this.position.x = this.tempVector.x;
        else
            this.direction.x = -this.direction.x

        if (this.canMove(game, this.position.x,this.position.y,this.tempVector.z,0.2))
            this.position.z = this.tempVector.z;
        else
            this.direction.z = -this.direction.z;
    }
}