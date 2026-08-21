import Structure from "./structure.js";

export default class DoorBlock extends Structure{
    constructor(){
        super(null,null);
    }
    
    isSolid(){
        return false;
    }

    blocksLight(){
        return true;
    }
}