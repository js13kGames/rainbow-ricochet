import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Bullet from "./bullet.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
import Game from "../game.js";

export default class Darkness extends Entity{
    constructor(level,x,y,z) {
        super(level,x,y,z);
        //Game.glTexture = glTexture;
        this.texture = new Texture(Game.glTexture,16,16,16,16);
        this.eyesTexture = new Texture(Game.glTexture,63,0,1,1);
        var tint = [1.0, 1.0, 1.0, 1.0];
        
        this.hitDelay = 0;
        this.light = 0.3;
        this.distanceToPlayer = {x:0, z:0};
        this.aggroRange = 15+(Math.random()*10);

        var headCounter = Math.random()*10;
        this.meshMoveCounter = [Math.random()*10,Math.random()*10,headCounter,headCounter];
        this.meshes = [];

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,+0.5,0,0,this.light,1,tint);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,-0.5,0,0,this.light,1,tint);
        var m = MeshBuilder.build(meshBuild);
        m.scale[0] = 0.4;
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0.1,0.8,0,this.light,1,tint);
        var m = MeshBuilder.build(meshBuild);
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.25);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,1.5,0,this.light,1,tint);

        var m = MeshBuilder.build(meshBuild);
       //m.setS(0.7);
        this.meshes.push(m);


        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.02);

        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,-0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0]);
        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0]);
        var m = MeshBuilder.build(meshBuild);
        this.meshes.push(m);
    }

    tick(game,deltaTime){
        
        super.tick(game,deltaTime);
        this.move(0,0,0);
        var i = 0;
        this.meshes.forEach(m=>{
            this.meshMoveCounter[i]+=deltaTime;
            var xOffset = Math.sin(this.meshMoveCounter[i]);
            var yOffset = Math.cos(this.meshMoveCounter[i]);
            var zOffset = Math.sin(this.meshMoveCounter[i]+0.5);
            m.setRotationY(-Game.camera.currentRot);
            m.setPos(this.position.x+xOffset/14,this.position.y+0.1+yOffset/14,this.position.z+zOffset/14);
            if (i >1) m.scale[0] += yOffset/300;
            i++;
        })

        if (this.hitDelay > 0) this.hitDelay -= deltaTime;

        this.distanceToPlayer.x = game.level.player.position.x - this.position.x;
        this.distanceToPlayer.y = 0;
        this.distanceToPlayer.z = game.level.player.position.z - this.position.z;
        var length = MathUtil.length(this.distanceToPlayer);

        this.hasPlayerAggro=length<this.aggroRange;
        var s;
        if(this.hasPlayerAggro){
            var x=Math.ceil(game.level.player.position.x),z=Math.ceil(game.level.player.position.z),p=MathUtil.bresenham(Math.ceil(this.position.x),Math.ceil(this.position.z),x,z,Math.ceil(length));
            for(var q of p)if(!(s=game.level.getStructure(q.x,q.y))||s.blocksLight()){this.hasPlayerAggro=false;break}
        }

         if (this.hasPlayerAggro && Math.random() < 0.008){
            MathUtil.normalize(this.distanceToPlayer);
            var direction = {x:-this.distanceToPlayer.x,y:0,z:-this.distanceToPlayer.z};
            game.level.shootBullet(this.position.x,this.position.y + 0.9,this.position.z,direction,20,this,0.2,3);
        }
    }

     render(){
        super.render();

        this.meshes.forEach(m=>{
            m.render();
        });


    }

     onEntityHit(game, entity){
        if (!(entity instanceof Bullet)) return;
        if (entity.owner instanceof Darkness) return;
        if (this.hitDelay <= 0){
            this.currentHealth--;

            if (this.currentHealth <=0){
                this.disposed = true;
                game.monsterDie();
                for (let i = 0; i < 20; i++){
                    var p = new Particle(game.level,this.position.x,this.position.y+0.5,this.position.z,2.8,{x:MathUtil.getRandom(-0.3,0.3), y: Math.random()/1.5, z: MathUtil.getRandom(-0.3,0.3)},0.05,[0.11,0.11,0.11,1.0],MathUtil.getRandom(0.05,0.2));
                    game.level.addParticle(p);
                }
               
            }else{
                this.hitDelay = 0.25;
                game.monsterHit();
            }
            
        }

    }
}