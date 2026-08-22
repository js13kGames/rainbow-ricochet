import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";


export default class Key extends Entity{
    constructor(gl,shaderprogram,glTexture,x,y,z,keyType){
        super(x,y,z);
        this.keyType = keyType;
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.texture = new Texture(glTexture,32,16,16,16);

        var meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,1,1,this.keyType,null);
        this.mesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(-game.gl.camera.currentRot);
        this.move(0,0,0);
    }

    render(gl){
        super.render(gl);
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
    }
}