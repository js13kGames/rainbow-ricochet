import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Lightblock extends Structure{
    constructor(glTexture, tint) {
        super(new Texture(glTexture,63,0,1,1),tint);
    }

    isSolid(){
        return false;
    }

    blocksLight(){
        return false;
    }
}
//62,0,1,7