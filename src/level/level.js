import Floor from "../structure/floor.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structure from "../structure/structure.js";
import Wall from "../structure/wall.js";
import Structures from "../structure/structures.js";
import Rainbow from "../entity/rainbow.js";
import MathUtil from "../mathutil.js";
import Lightblock from "../structure/lightblock.js";

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
        this.lightMap = [size*size];
        this.size = size;

        
        console.log(this.lightMap);

        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++){
                if (x == 0 || z == 0 || x == size-1 || z == size-1) this.setStructure(x,z,Structures.wall);

                //else if (x == 1 && z == 4) this.setStructure(x,z,Structures.wall);
                //else if (Math.random()< 0.1){
                    //this.setStructure(x,z,Structures.wall);
               // }
                else this.setStructure(x,z,Structures.floor);
            }
        }

        this.setStructure(10,10,Structures.wall);
        this.setStructure(10,11,Structures.wall);
        this.setStructure(10,12,Structures.wall);

        this.setStructure(11,10,Structures.wall);
        this.setStructure(11,11,Structures.wall);

        this.generateLight(size/2,size/2,8,4);
        this.setStructure(size/2,size/2,Structures.lightBlock);

        this.buildLevel();

        
    }

    generateLight(startX,startY, distance,strength){
        console.log("Generating light "+startX+" "+startY);

        for (let i = 0; i < Math.PI*2; i = i+0.01){
            var stopX = startX + Math.sin(i) * distance;
            var stopY = startY + Math.cos(i) * distance;
            let light = strength;
            var p = MathUtil.bresenham(startX, startY, stopX, stopY, distance);
            p.every((point) => {
                light *= 0.85;
                var s = this.getStructure(point.x, point.y);
                if (!s.blocksLight()) {
                    this.setLight(point.x,point.y,light);
                    return true;
                }else{
                    return false;
                }
            });
            console.log(light);
        }

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

    setLight(x,z,light){
        this.lightMap[x * this.size + z] = light;
    }

    getLight(x,z){
        if (x < 0 || z < 0 || x > this.size || z > this.size) return 0.4;
        var v =  this.lightMap[x * this.size + z];
        if (v == null) return 0.4;
        return v;
    }

    getStructure(x,z){
        if (x < 0 || z < 0 || x > this.size || z > this.size) return null;
        return this.structures[x * this.size + z];
    }

    buildLevel(){
        let meshBuild = MeshBuilder.start(this.gl,0,0,0,0.5);
        let h = 4;
        console.log(this.lightMap);
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                let s = this.getStructure(x,z);
                if (s instanceof Wall){
                    // Only create faces that are visible. Faces facing nothing or other solid blocks are a waste of verticies.
                    let l = this.getStructure(x-1,z);
                    let r = this.getStructure(x+1,z);
                    let f = this.getStructure(x,z+1);
                    let b = this.getStructure(x,z-1);
                    if (l!= null && !l.isSolid()) MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x-1,z),h,s.tint,null);
                    if (r!= null && !r.isSolid()) MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x+1,z),h,s.tint,null);
                    if (f!= null && !f.isSolid()) MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z+1),h,s.tint,null);
                    if (b!= null && !b.isSolid()) MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z-1),h,s.tint,null);
                }else if (s instanceof Lightblock){
                    let l = this.getStructure(x-1,z);
                    let r = this.getStructure(x+1,z);
                    let f = this.getStructure(x,z+1);
                    let b = this.getStructure(x,z-1);
                    if (l!= null && !l.isSolid()) MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x-1,z),h,s.tint,null);
                    if (r!= null && !r.isSolid()) MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x+1,z),h,s.tint,null);
                    if (f!= null && !f.isSolid()) MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z+1),h,s.tint,null);
                    if (b!= null && !b.isSolid()) MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z-1),h,s.tint,null);

                }else if (s instanceof Floor){
                    MeshBuilder.top(s.texture.getUVs(),meshBuild,x,-1,z,this.getLight(x,z),s.tint,null);
                    MeshBuilder.bottom(s.texture.getUVs(),meshBuild,x,h,z,this.getLight(x,z),s.tint,null);
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