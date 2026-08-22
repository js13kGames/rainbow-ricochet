import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Entity from "./entity.js";

export default class UnicornHorn extends Entity{
    constructor(gl,shaderprogram,glTexture,x,y,z){
            super(x,y,z);
            this.shaderprogram = shaderprogram;
            this.glTexture = glTexture;
            this.texture = new Texture(glTexture,32,0,16,16);
    
            var meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,1,1,[1.0,1.0,1.0,0.5],null);
            this.mesh = MeshBuilder.build(meshBuild);
            this.yOffset = y-2; // already adding +2 in Entity AABB-check but we need higher number if item is on a higher floor
            this.inHandYOffset = 0;
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

        renderinHand(gl){
            
            this.mesh.setS(0.7);
            this.mesh.setPos(0,-1.5+this.inHandYOffset,-2);
            this.mesh.setRotationY(0);
            this.mesh.setRotationX(3.14);
            //this.mesh.setRotationY(-1.2+(this.inHandXOffset));
            gl.enable(gl.BLEND)
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            this.mesh.render(gl,this.shaderprogram, this.glTexture,gl.uiCamera);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
        }
}