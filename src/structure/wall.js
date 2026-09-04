import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Wall extends Structure{
    constructor(glTexture, tint) {
        super(new Texture(glTexture,48,48,16,16),tint);
    }

    isSolid(s){
        return true;
    }

    blocksLight(){
        return true;
    }
}