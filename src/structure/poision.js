import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Poision extends Structure{
    constructor(glTexture) {
        //super(new Texture(glTexture,63,0,1,1));
        super(new Texture(glTexture,16,48,16,16));
        this.tint = [0.0,0.9,0.0,1.0];
    }

    intersects(game,x,y,z,checkAABB,entity){
        return false;
    }
}