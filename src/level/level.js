import Floor from "../structure/floor.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structure from "../structure/structure.js";
import Wall from "../structure/wall.js";
import Structures from "../structure/structures.js";
import Rainbow from "../entity/rainbow.js";

export default class Level{
    constructor(game,size,player){
        console.log(game);
        this.gl = game.gl;
        this.shaderprogram = game.shaderProgram;
        this.glTexture = game.glTexture;
        this.entities = [];
        this.structures = [];
        this.entities.push(player);

        this.level = [size*size];
        this.size = size;

        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++){
                if (x == 0 || z == 0 || x == size-1 || z == size-1) this.setStructure(x,z,Structures.wall);

                //else if (x == 1 && z == 4) this.setStructure(x,z,Structures.wall);
                else if (Math.random()< 0.1){
                    this.setStructure(x,z,Structures.wall);
                }
                else this.setStructure(x,z,Structures.floor);
            }
        }

        this.buildLevel();

        
    }

    addEntity(entity){
        this.entities.push(entity);
    }

    deleteEntity(entity){
        this.deleteFromList(entity,this.entities);
    }

    // Javascript doesn't have a way to just delete something smoothly from a list (AFAIK)
    deleteFromList(objectToDelete,sourceList){
        for(let i = sourceList.length - 1; i >= 0; i--) {
            if(sourceList[i] === objectToDelete) {
                sourceList.splice(i, 1);
            }
        }
    }

    setStructure(x,z,structure){
        this.structures[x * this.size + z] = structure;
    }
    getStructure(x,z){
        if (x < 0 || z < 0 || x > this.size || z > this.size) return null;
        return this.structures[x * this.size + z];
    }

    buildLevel(){
        let meshBuild = MeshBuilder.start(this.gl,0,0,0,0.5);
        //let h = Math.ceil(Math.random()*4)+2;
        let h = 4;
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                let s = this.getStructure(x,z);
                if (s instanceof Wall){
                    // Only create faces that are visible. Faces facing nothing or other solid blocks are a waste of verticies.
                    let l = this.getStructure(x-1,z);
                    let r = this.getStructure(x+1,z);
                    let f = this.getStructure(x,z+1);
                    let b = this.getStructure(x,z-1);
                    if (l!= null && !l.isSolid()) MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,1,h,s.tint,null);
                    if (r!= null && !r.isSolid()) MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,1,h,s.tint,null);
                    if (f!= null && !f.isSolid()) MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,1,h,s.tint,null);
                    if (b!= null && !b.isSolid()) MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,1,h,s.tint,null);
                }else if (s instanceof Floor){
                    MeshBuilder.top(s.texture.getUVs(),meshBuild,x,-1,z,2,s.tint,null);
                    MeshBuilder.bottom(s.texture.getUVs(),meshBuild,x,h,z,2,s.tint,null);
                }
            }
        }

        this.structureMesh = MeshBuilder.build(meshBuild);
        
    }

    tick(game,deltaTime){
        this.entities.forEach(a => {
            if (a.disposed) this.deleteEntity(a);
            else a.tick(game,deltaTime);
        });

        // Bad performance thing but here we are :)
        // If I have time and space make it check just areas surronding each entity

        this.entities.forEach(a => {
            this.entities.forEach(b => {
                if(a.doesCollidesWithEntity(game,b)){
                    a.onEntityHit(game,b);
                    b.onEntityHit(game,a);
                }
            })
        })
    }

    render(gl){
        //console.log(this.shaderprogram);
        this.structureMesh.render(gl,this.shaderprogram, this.glTexture);

        this.entities.forEach(e => {
            e.render(gl);
        });
    }
}