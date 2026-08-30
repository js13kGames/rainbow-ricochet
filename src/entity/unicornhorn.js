import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";
import Game from "../game.js";

export default class UnicornHorn extends Entity{
    constructor(level,x,y,z){
            super(level,x,y,z);
            
            this.texture = new Texture(Game.glTexture,32,0,16,16);
    
            var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,1,1,[1.0,1.0,1.0,0.5],null);
            this.mesh = MeshBuilder.build(meshBuild);
            this.yOffset = y-2; // already adding +2 in Entity AABB-check but we need higher number if item is on a higher floor
            this.inHandYOffset = 0;
            this.bobX = 0;
            this.bobZ = 0;
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

        renderinHand(){
            
            this.mesh.setS(0.7);
            this.mesh.setPos(0+this.bobX,-1.5+this.inHandYOffset+this.bobZ,-2);
            this.mesh.setRotationY(0);
            this.mesh.setRotationX(3.14);
            Game.gl.enable(Game.gl.BLEND)
            Game.gl.disable(Game.gl.DEPTH_TEST);
            Game.gl.disable(Game.gl.CULL_FACE);
            this.mesh.render(Game.uiCamera);
            Game.gl.enable(Game.gl.CULL_FACE);
            Game.gl.enable(Game.gl.DEPTH_TEST);
            Game.gl.disable(Game.gl.BLEND);
        }
}