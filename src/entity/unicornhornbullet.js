import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Glassblock from "../structure/glassblock.js";
import Bullet from "./bullet.js";
import Darkness from "./darkness.js";

export default class UnicornhornBullet extends Bullet{
    constructor(level,x,y,z,direction,speed,owner,size=0.05,ttl=1.5,ignoreCollisionTimer=0){
        super(level,x,y,z,direction,speed,owner,false);
            this.texture = new Texture(Game.glTexture,63,0,1,1);

            var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
            var c = Game.rainbowColors[Math.floor(Math.random()*6)];
            if (owner instanceof Darkness) c = [0.4,0.4,0.4];
            MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,0,0,2,1,[c[0],c[1],c[2],0.9]);
            this.mesh = MeshBuilder.build(meshBuild);
            this.mesh.setS(size);
            this.ttl = ttl;
            if (ignoreCollisionTimer>0){
                this.ignoreCollisions = true;
                this.ignoreCollisionTimer = ignoreCollisionTimer;
            }
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.ttl -= deltaTime;
        if (this.ignoreCollisionTimer >0) this.ignoreCollisionTimer -=deltaTime;
        if (this.ignoreCollisionTimer <=0) this.ignoreCollisions = false;
        if (this.ttl <= 0) this.disposed = true;
        this.mesh.setRotationY(-Game.camera.currentRot);
    }

    render(){
        super.render();
        this.mesh.render();
    }

    doesCollideWithStructure(structure){
        return false;
    }

    onStructureHit(game, pos,structure){
        if (structure != null && structure instanceof Glassblock) game.playGlassHit();
        else game.playWallHit();
        game.level.deleteEntity(this);
        //game.playWallHit();
        this.explode(game,0);
    }
}
