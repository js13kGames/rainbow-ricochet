import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structures from "../structure/structures.js";
import Entity from "./entity.js";

export default class Door extends Entity{
    static blue = [0.0,0.0,1.0,1.0];
    static green = [0.0,1.0,0.0,1.0];
    static yellow = [1.0,1.0,0.0,1.0];
    
    constructor(level,gl,shaderprogram,glTexture,x,y,z,color){
        super(x,y,z);
        this.color = color;
        this.texture = new Texture(glTexture,0,16,16,16);
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.locked = true;
        let meshBuild = MeshBuilder.start(gl,0,0,0,0.5);
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x-1,z)+0.5,3,color,null);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x+1,z)+0.5,3,color,null);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z+1)+0.5,3,color,null);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z-1)+0.5,3,color,null);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuild,x,0,z,level.getLight(x,z-1)+0.5,color,null);

        this.mesh = MeshBuilder.build(meshBuild);
        this.AABB.minX=x-0.2;
        this.AABB.minY=y;
        this.AABB.minZ=z-0.2;
        this.AABB.maxX=this.position.x+1.2;
        this.AABB.maxY=this.position.y+level.height;
        this.AABB.maxZ=this.position.z+1.2;

        meshBuild = MeshBuilder.start(gl,0,0,0,0.5);
        MeshBuilder.top(Structures.floor.texture.getUVs(),meshBuild,x,-1,z,level.getLight(x,z)+1,this.color,null);
        this.floorMesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){
        if (!this.locked && this.mesh.position[1] < 2){
            this.mesh.position[1] += deltaTime;
        }
        if (!this.locked && this.mesh.position[1] >=2){
            //game.level.removeStructure(this.position.x,this.position.z);
            game.level.setStructure(this.position.x,this.position.z,Structures.floor);
        }
        
    }

    render(gl){
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
        this.floorMesh.render(gl,this.shaderprogram, this.glTexture);
    }

    unlockDoor(game,player){
        player.keysHold.forEach(k => {
            if (k == this.color && this.locked){
                this.locked = false;
            }
        });
    }
}