import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";

export default class Light extends Entity{
    constructor(gl,shaderprogram,glTexture,x,y,z,tint){
        super(x,y,z);
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.texture = new Texture(glTexture,48,0,15,15);

        var meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,2,1,tint,null);
        this.mesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(-game.gl.camera.currentRot);
    }

    render(gl){
        super.render(gl);
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
    }
}