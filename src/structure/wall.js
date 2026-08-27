import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Wall extends Structure{
    constructor(glTexture, tint) {
        super(new Texture(glTexture,0,16,16,16),tint);
    }

    isSolid(s){
        return true;
    }

    blocksLight(){
        return true;
    }
}
//62,0,1,7