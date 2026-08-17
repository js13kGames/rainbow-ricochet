import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Lightblock extends Structure{
    constructor(glTexture, tint) {
        super(new Texture(glTexture,16,0,16,16),tint);
    }

    isSolid(){
        return true;
    }

    blocksLight(){
        return false;
    }
}
//62,0,1,7