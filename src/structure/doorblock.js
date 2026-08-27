import Structure from "./structure.js";

export default class DoorBlock extends Structure{
    constructor(){
        super(null,null);
    }
    
    isSolid(s){
        return false;
    }

    blocksLight(){
        return true;
    }
}