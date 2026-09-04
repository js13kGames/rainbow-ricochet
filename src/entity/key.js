import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";
import Game from "../game.js";


export default class Key extends Entity{
    constructor(level,x,y,z,keyType){
        super(level,x,y,z);
        this.keyType = keyType;
        this.texture = new Texture(Game.glTexture,32,16,16,16);

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,1,1,this.keyType);
        this.mesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(-Game.camera.currentRot);
        this.move(0,0,0);
    }

    render(){
        super.render();
        this.mesh.render();
    }
}