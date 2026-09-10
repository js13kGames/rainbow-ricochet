import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Floor from "../structure/floor.js";
import Bullet from "./bullet.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
import Game from "../game.js";
import Rainbow from "./rainbow.js";

export default class Darkness extends Entity{
    constructor(level,x,y,z) {
        super(level,x,y,z);
        //Game.glTexture = glTexture;
        this.currentHealth = this.maxHealth = 1;
        this.texture = new Texture(Game.glTexture,16,16,16,16);
        this.eyesTexture = new Texture(Game.glTexture,63,0,1,1);
        var tint = [1.0, 1.0, 1.0, 1.0];
        this.startPosition = {x:x,y:y,z:z};
        
        this.hitDelay = 0;
        this.light = 0.3;
        this.distToPlayer = {x:0, z:0};
        this.aggroRange = 18;
        this.speed = MathUtil.getRandom(0.03,0.07);

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
        if (this.moveBackCounter >0) this.moveBackCounter -= deltaTime;

        if (this.moveBackCounter <= 0 && !this.hasMovedBack){
            this.position.x = this.startPosition.x;
            this.position.y = this.startPosition.y;
            this.position.z = this.startPosition.z;
            this.move(0,0,0);
            this.hasMovedBack = true;
        }

        if (this.attackPlayerCounter >0) this.attackPlayerCounter -= deltaTime;
        if (this.attackPlayerCounter <=0 && !this.willAttackPlayer){
            this.willAttackPlayer = true;
        }

        this.distToPlayer.x = game.level.player.position.x - this.position.x;
        this.distToPlayer.y = 0;
        this.distToPlayer.z = game.level.player.position.z - this.position.z;
        var distanceToPlayer = MathUtil.length(this.distToPlayer);

        this.inAggroRange = (distanceToPlayer < this.aggroRange);

        if(this.inAggroRange){
            // Reset any ongoing movingback counters
            this.hasMovedBack=true;
            // Shoot a ray out from the monster position to the player position.
            var x=Math.ceil(game.level.player.position.x),
                z=Math.ceil(game.level.player.position.z),
                points=MathUtil.bresenham(Math.ceil(this.position.x),Math.ceil(this.position.z),x,z,Math.ceil(distanceToPlayer)),
                s;
            
            // Loop trough the ray and if we hit a obstacle then we lost aggro and we will be teleported back
            for(var p of points)
                if(!(s=game.level.getStructure(p.x,p.y))
                    || s.blocksLight()){
                // If the monster don't have a straight line between his position and the player position drop the aggro.
                // This is to avoid monster shooting at the player at the other side of the wall
                this.inAggroRange=false;
                this.willAttackPlayer = false;
                this.moveBackCounter=2.5;
                this.hasMovedBack=false;
                break
            }

            if (!this.willAttackPlayer && !this.inAggroRange) this.attackPlayerCounter = 0.5;
        }

        move_monster: if(distanceToPlayer < this.aggroRange){
            MathUtil.normalize(this.distToPlayer);

            var directions = [
                [+1,0],
                [0,+1],
                [-1,0],
                [0,-1],
                [+1,-1],
                [+1,+1],
                [-1,+1],
                [-1,-1]
            ]

            var seenDistance=32;
            var choosenPath;
            var choosenDirection;
            
            directions.forEach(d=>{
                let key = `${d[0]+Math.ceil(this.position.x)},${d[1]+Math.ceil(this.position.z)}`;
                let distance = game.level.player.pathFinding.get(key);
                if (distance == null) return;
                if (distance < seenDistance && distance > 1){
                    seenDistance = distance;
                    choosenPath = key;
                    choosenDirection = d;
                }
            })

            if (choosenPath == null) break move_monster;
            var choosenPath = choosenPath.split(',').map(Number);

            this.tempVector.x = this.position.x + (choosenDirection[0]*this.speed);
            this.tempVector.z = this.position.z + (choosenDirection[1]*this.speed);
    
            var moveX=this.canMove(game,this.tempVector.x,this.position.y,this.position.z);
            var moveZ=this.canMove(game,this.position.x,this.position.y,this.tempVector.z);

            if(moveX.i) this.move(this.tempVector.x-this.position.x,0,0);
            if(moveZ.i) this.move(0,0,this.tempVector.z-this.position.z);
        }

        // If the monster is close it will start shoot randomly. The closer you are the more frequent. This is to stop player to just rush trough enimies running for the exit.
        // Using ** is not a typo since it's the operator for expotentional operations so the distance from the player to the monster is more smooth.
        if (this.inAggroRange && this.willAttackPlayer){
            if (Math.random() < 0.01+0.10*(1-distanceToPlayer/this.aggroRange)**2){
                
                // Make the monster aim a bit off so it's not always hitting player
                var direction = {x:-this.distToPlayer.x+MathUtil.getRandom(-0.18,0.18),y:0,z:-this.distToPlayer.z+MathUtil.getRandom(-0.18,0.18)};
                game.level.shootBullet(this.position.x,this.position.y + 0.9,this.position.z,direction,20,this,0.3,3);
            }
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
               
            }
        }

    }
}