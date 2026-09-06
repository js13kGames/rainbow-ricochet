import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Entity from "./entity.js";
import Particle from "./particle.js";

export default class HealthPickup extends Entity{
    constructor(level,x,y,z,ammount){
        super(level,x,y,z);
        this.ammount = ammount;
        this.texture = new Texture(Game.glTexture,5,59,5,5);
        this.yOffset = 4;
        this.distanceToPlayer = {x:0, z:0};

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,0.9,1,[1.0,1.0,1.0,0.9]);
        this.mesh = MeshBuilder.build(meshBuild);
        this.mesh.setS(0.4);

        this.AABB.minX=x+0.2;
        this.AABB.minY=y;
        this.AABB.minZ=z+0.2;
        this.AABB.maxX=x+0.4;
        this.AABB.maxY=y+this.yOffset;
        this.AABB.maxZ=z+0.4;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.move(0,0,0);
        this.mesh.setRotationY(-Game.camera.currentRot);
    }


    render(){
        this.mesh.render();
    }
}