import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Bullet from "./bullet.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
import Game from "../game.js";
export default class Darkness extends Entity{
    constructor(x,y,z) {
        super(x,y,z);
        //Game.glTexture = glTexture;
        this.texture = new Texture(Game.glTexture,16,16,16,16);
        this.eyesTexture = new Texture(Game.glTexture,63,0,1,1);
        var tint = [1.0, 1.0, 1.0, 1.0];
        this.health = 1;
        this.hitDelay = 0;
        this.light = 0.3;
        this.distanceToPlayer = {x:0, z:0};
        this.aggroRange = 20;

        var headCounter = Math.random()*10;
        this.meshMoveCounter = [Math.random()*10,Math.random()*10,headCounter,headCounter];
        this.meshes = [];

        var meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,+0.5,0,0,this.light,1,tint,null);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,-0.5,0,0,this.light,1,tint,null);
        var m = MeshBuilder.build(meshBuild);
        m.scale[0] = 0.4;
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0.1,0.8,0,this.light,1,tint,null);
        var m = MeshBuilder.build(meshBuild);
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.25);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,1.5,0,this.light,1,tint,null);

        var m = MeshBuilder.build(meshBuild);
       //m.setS(0.7);
        this.meshes.push(m);


        meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.02);

        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,-0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0],null);
        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0],null);
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

        if (Math.random()< 0.05){
            var p = new Particle(game.gl,game.shaderProgram,game.glTexture,this.position.x,this.position.y+0.5,this.position.z,0.8,{x:MathUtil.getRandom(-0.2,0.2), y: Math.random()/1.5, z: MathUtil.getRandom(-0.2,0.2)},0.05,[0.11,0.11,0.11,1.0],MathUtil.getRandom(0.05,0.2));
            game.level.addParticle(p);
        }

        if (this.hitDelay > 0) this.hitDelay -= deltaTime;

        this.distanceToPlayer.x = game.player.position.x - this.position.x;
        this.distanceToPlayer.z = game.player.position.z - this.position.z;
        var length = MathUtil.length(this.distanceToPlayer);

        if (length < this.aggroRange){
            var p = MathUtil.bresenham(Math.ceil(this.position.x), Math.ceil(this.position.z), Math.ceil(game.player.position.x), Math.ceil(game.player.position.z), Math.ceil(length));
            for (let pi = 0; pi < p.length; pi++){
                var point = p[pi];
                var s = game.level.getStructure(point.x, point.y);
                if (s != null && !s.blocksLight()) {
                    if ((s instanceof Floor && s.height > 0)){
                        this.hasPlayerAggro = false;
                        break;
                    }
                    if (point.x == Math.ceil(game.player.position.x) && point.y == Math.ceil(game.player.position.z)){
                        if (!this.hasPlayerAggro){
                            this.hasPlayerAggro = true;
                            game.monsterAggro();
                            }
                        }
                }else{
                    this.hasPlayerAggro = false;
                    break;
                } 
            }
        }else {
            this.hasPlayerAggro = false;
        }

        if (this.hasPlayerAggro && Math.random() < 0.001){
            game.monsterAggro();
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
        if (this.hitDelay <= 0){
            this.health--;

            if (this.health <=0){
                this.disposed = true;
                game.monsterDie();
                for (let i = 0; i < 20; i++){
                    var p = new Particle(this.position.x,this.position.y+0.5,this.position.z,2.8,{x:MathUtil.getRandom(-0.3,0.3), y: Math.random()/1.5, z: MathUtil.getRandom(-0.3,0.3)},0.05,[0.11,0.11,0.11,1.0],MathUtil.getRandom(0.05,0.2));
                    game.level.addParticle(p);
                }
               
            }else{
                this.hitDelay = 0.25;
                game.monsterHit();
            }
            
        }

    }
}