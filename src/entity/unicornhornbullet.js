import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Bullet from "./bullet.js";

export default class UnicornhornBullet extends Bullet{
    constructor(x,y,z,direction,speed){
        super(x,y,z,direction,speed,false);
            this.texture = new Texture(Game.glTexture,63,0,1,1);

            var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
            var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,2,1,[c[0],c[1],c[2],0.9],null);
            this.mesh = MeshBuilder.build(meshBuild);
            this.mesh.setS(0.05);
            this.ttl = 1.5;
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.ttl -= deltaTime;
        if (this.ttl <= 0) this.disposed = true;
        this.mesh.setRotationY(-Game.camera.currentRot);
    }

    render(){
        super.render();
        this.mesh.render();
    }

    onStructureHit(game, pos){
        game.level.deleteEntity(this);
        this.explode(game,0);
    }
}
