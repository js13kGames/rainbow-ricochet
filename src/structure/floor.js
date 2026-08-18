import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Floor extends Structure{
    constructor(glTexture,tint,height) {
        super(new Texture(glTexture,0,0,16,16),tint,height);
    }

    intersects(x,y,z,checkAABB){
        if (this.height == 0) return false;
        else return super.intersects(x,y,z,checkAABB);
    }
}