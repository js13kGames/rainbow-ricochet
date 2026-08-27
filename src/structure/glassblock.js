import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Glassblock extends Structure{
    constructor(glTexture, tint) {
        super(new Texture(glTexture,16,0,16,16),tint);
    }

    isSolid(s){
        if (s instanceof Glassblock) return true;
        return false;
    }

    blocksLight(){
        return false;
    }
}
//62,0,1,7