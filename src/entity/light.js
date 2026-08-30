import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";
import Game from "../game.js";

export default class Light extends Entity{
    constructor(x,y,z,tint){
        super(x,y,z);
        
        this.texture = new Texture(Game.glTexture,48,0,15,15);

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,2,1,tint,null);
        this.mesh = MeshBuilder.build(meshBuild);
        this.noCollision = true;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(-Game.camera.currentRot);
    }

    render(){
        super.render();
        this.mesh.render();
    }
}