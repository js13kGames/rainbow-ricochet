import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";

export default class Particle extends Entity{
    constructor(gl,shaderprogram,glTexture,x,y,z,ttl,direction,speed,tint,size=1) {
        super(x,y,z);
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.texture = new Texture(glTexture,63,0,1,1);
        this.ttl = ttl;
        this.direction = direction;
        this.speed = speed;

        var meshBuild = MeshBuilder.start(gl,x,y,z,size);
        //var meshBuild = MeshBuilder.start(gl,x,y,z,1);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,1,1,tint,null);
        this.mesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.ttl -= deltaTime;
        if (this.ttl <=0) this.disposed = true;
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        this.position.z += this.direction.z * this.speed;
        this.mesh.setPos(this.position.x,this.position.y, this.position.z);
        this.mesh.setRotationY(-game.gl.camera.currentRot);
    }

    render(gl){
        super.render(gl);
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
    }
}