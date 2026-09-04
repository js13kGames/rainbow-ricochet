import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structures from "../structure/structures.js";
import Entity from "./entity.js";
import Game from "../game.js";

export default class Door extends Entity{
    static blue = [0.0,0.0,1.0,1.0];
    static green = [0.0,1.0,0.0,1.0];
    static yellow = [1.0,1.0,0.0,1.0];
    static secret = [0.5,0.5,0.5,0.5];
    
    constructor(level,x,y,z,color,wallColor){
        super(level,x,y,z);
        this.color = color;
        this.lightReduction = 0;
        if (color == Door.secret){
            this.secretDoor = true;
            this.lightReduction = 0.1;
        }
        this.texture = new Texture(Game.glTexture,48,48,16,16);
        this.lockTexture = new Texture(Game.glTexture,32,16,16,16);
        this.locked = true;
        let meshBuild = MeshBuilder.start(Game.gl,0,0,0,0.502);
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x-1,z)-this.lightReduction,3,wallColor);
        MeshBuilder.left(this.lockTexture.getUVs(),meshBuild,x-0.01,1,z,0.8,1,color);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x+1,z)-this.lightReduction,3,wallColor);
        MeshBuilder.right(this.lockTexture.getUVs(),meshBuild,x+0.01,1,z,0.8,1,color);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z+1)-this.lightReduction,3,wallColor);
        MeshBuilder.front(this.lockTexture.getUVs(),meshBuild,x,1,z+0.01,0.8,1,color);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z-1)-this.lightReduction,3,wallColor);
        MeshBuilder.back(this.lockTexture.getUVs(),meshBuild,x,1,z-0.01,0.8,1,color);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z),wallColor);

        this.mesh = MeshBuilder.build(meshBuild);
        this.AABB.minX=x-0.5;
        this.AABB.minY=y;
        this.AABB.minZ=z-0.5;
        this.AABB.maxX=this.position.x+1.5;
        this.AABB.maxY=this.position.y+level.height;
        this.AABB.maxZ=this.position.z+1.5;

        meshBuild = MeshBuilder.start(Game.gl,0,0,0,0.5);
        MeshBuilder.top(Structures.floor.texture.getUVs(),meshBuild,x,-1,z,level.getLight(x,z),wallColor);
        this.floorMesh = MeshBuilder.build(meshBuild);

        meshBuild = MeshBuilder.start(Game.gl,0,0,0,0.5);
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,3,z,level.getLight(x-1,z),level.height-3,wallColor);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,3,z,level.getLight(x+1,z),level.height-3,wallColor);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,3,z,level.getLight(x,z+1),level.height-3,wallColor);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,3,z,level.getLight(x,z-1),level.height-3,wallColor);
        this.wallMesh = MeshBuilder.build(meshBuild);

    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        if (!this.locked && this.mesh.position[1] < 2.5){
            this.mesh.position[1] += deltaTime*1.5;
        }
        if (!this.locked && this.mesh.position[1] >=2.0){
            game.level.setStructure(this.position.x,this.position.z,Structures.floor);
        }
        
    }

    render(){
        this.mesh.render();
        this.floorMesh.render();
        this.wallMesh.render();
    }

    unlockDoor(game,player){
        player.keysHold.forEach(k => {
            if (k == this.color && this.locked){
                this.locked = false;
                game.openDoor();
            }
        });
    }
}