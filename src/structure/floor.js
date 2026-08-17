import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Floor extends Structure{
    constructor(glTexture,tint) {
        super(new Texture(glTexture,0,0,16,16),tint);
    }

    intersects(x,y,z,checkAABB){
        return false;
    }
}