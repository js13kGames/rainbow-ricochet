import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";
import Game from "../game.js";

export default class Particle extends Entity{
    constructor(level,x,y,z,ttl,direction,speed,tint,size=1) {
        super(level,x,y,z,0,false);
        this.texture = new Texture(Game.glTexture,63,0,1,1);
        this.ttl = ttl;
        this.direction = direction;
        this.speed = speed;

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,size);
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
        this.mesh.setRotationY(-Game.camera.currentRot);
    }

    render(){
        super.render();
        this.mesh.render();
    }
}