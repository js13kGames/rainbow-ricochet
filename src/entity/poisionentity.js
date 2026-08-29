import Entity from "./entity.js";

export default class PoisionEntity extends Entity{
    constructor(x,y,z){
        super(x,y,z);
        this.move(0,0,0);
    }
}