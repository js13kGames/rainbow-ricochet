import Texture from "../gl/texture.js";
import Structure from "./structure.js";

export default class Floor extends Structure{
    constructor(glTexture,tint,height) {
        super(new Texture(glTexture,16,48,16,16),tint,height);
    }

    intersects(game,x,y,z,checkAABB,entity){
        console.log(entity.constructor.name);
        // Can't use instanceOf here because of "ReferenceError: can't access lexical declaration 'Bullet' before initialization"
        if (entity.constructor.name == "UnicornhornBullet") return false;
        if (this.height == 0) return false;
        else return super.intersects(game,x,y,z,checkAABB);
    }
}