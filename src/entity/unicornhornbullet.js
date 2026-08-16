import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Bullet from "./bullet.js";

export default class UnicornhornBullet extends Bullet{
    constructor(gl,shaderprogram,glTexture,x,y,z,direction,speed){
        super(x,y,z,direction,speed,false);
            this.shaderprogram = shaderprogram;
            this.glTexture = glTexture;
            this.texture = new Texture(glTexture,63,0,1,1);

            var meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
            var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,2,1,[c[0],c[1],c[2],0.9],null);
            this.mesh = MeshBuilder.build(meshBuild);
            this.mesh.setS(0.05);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(-game.gl.camera.currentRot);
    }

    render(gl){
        super.render(gl);
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
    }

    onStructureHit(game, pos){
        game.level.deleteEntity(this);
    }
}
