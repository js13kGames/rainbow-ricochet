import Entity from "./entity.js";
import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Particle from "./particle.js";

export default class BulletPickup extends Entity{
        constructor(level,x,y,z){
            super(level,x,y,z);
            this.texture = new Texture(Game.glTexture,63,0,1,1);
            this.yOffset = 4;
    
            var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
            var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,0.9,1,[c[0],c[1],c[2],0.9]);
            this.mesh = MeshBuilder.build(meshBuild);
            this.mesh.scale = [0.3,0.6,0.3];
    
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