import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structures from "../structure/structures.js";
import Entity from "./entity.js";
import Game from "../game.js";

export default class Door extends Entity{
    static blue = [0.0,0.0,1.0,1.0];
    static green = [0.0,1.0,0.0,1.0];
    static yellow = [1.0,1.0,0.0,1.0];
    
    constructor(level,x,y,z,color,wallColor){
        super(x,y,z);
        this.color = color;
        this.texture = new Texture(Game.glTexture,0,16,16,16);
        this.lockTexture = new Texture(Game.glTexture,32,16,16,16);
        this.locked = true;
        let meshBuild = MeshBuilder.start(Game.gl,0,0,0,0.5);
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,0,z,0.6,3,wallColor,null);
        MeshBuilder.left(this.lockTexture.getUVs(),meshBuild,x-0.01,0,z,0.8,3,color,null);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,0,z,0.6,3,wallColor,null);
        MeshBuilder.right(this.lockTexture.getUVs(),meshBuild,x+0.01,0,z,0.8,3,color,null);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,0,z,0.6,3,wallColor,null);
        MeshBuilder.front(this.lockTexture.getUVs(),meshBuild,x,0,z+0.01,0.8,3,color,null);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,0,z,0.6,3,wallColor,null);
        MeshBuilder.back(this.lockTexture.getUVs(),meshBuild,x,0,z-0.01,0.8,3,color,null);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuild,x,0,z,0.6,wallColor,null);

        this.mesh = MeshBuilder.build(meshBuild);
        this.AABB.minX=x-0.2;
        this.AABB.minY=y;
        this.AABB.minZ=z-0.2;
        this.AABB.maxX=this.position.x+1.2;
        this.AABB.maxY=this.position.y+level.height;
        this.AABB.maxZ=this.position.z+1.2;

        meshBuild = MeshBuilder.start(Game.gl,0,0,0,0.5);
        MeshBuilder.top(Structures.floor.texture.getUVs(),meshBuild,x,-1,z,level.getLight(x,z)+1,this.color,null);
        this.floorMesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
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