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
    constructor(game,size,player,ambientLight,height){
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
        this.ambientLight = ambientLight;
        this.height = height;


        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++){
                var levelChar = l.charAt(x + (z*this.size));

                if (levelChar == "#") this.setStructure(x,z,Structures.wall);
                else this.setStructure(x,z,Structures.floor);
                if (levelChar == "p") { player.position = {x:x,y:0,z:z}; this.setStructure(x,z,Structures.floor); }

                
                if (x == 0 || z == 0 || x == size-1 || z == size-1) this.setStructure(x,z,Structures.wall);
            }
        }

        this.buildLight();
        

        this.buildLevel();
        this.buildTransparentLevel();
    }

    buildLight(){
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                var levelChar = l.charAt(x + (z*this.size));
                if (levelChar == "l"){
                    this.setStructure(x,z,Structures.lightBlock);
                    if (Math.random() > 0.4) this.generateLight(x,z,10,5);
                }
            }
        }
    }

    generateLight(startX,startY, distance,strength){
        for (let i = 0; i < Math.PI*2; i = i+0.01){
            var stopX = startX + Math.sin(i) * distance;
            var stopY = startY + Math.cos(i) * distance;
            let light = strength;
            var p = MathUtil.bresenham(startX, startY, stopX, stopY, distance);
            for (let pi = 0; pi < p.length; pi++){
                var point = p[pi];
                light *= 0.75;
                var s = this.getStructure(point.x, point.y);
                if (s != null && !s.blocksLight()) {
                    this.setLight(point.x,point.y,light);
                }else break;
            }
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
        if (x < 0 || z < 0 || x > this.size || z > this.size) return;
        var existingLight = this.getLight(x,z);
        if (existingLight > light) return;
        this.lightMap[x * this.size + z] = light;
    }

    getLight(x,z){
        if (x < 0 || z < 0 || x > this.size || z > this.size) return this.ambientLight;
        var v =  this.lightMap[x * this.size + z];
        if (v == null) return this.ambientLight;
        return v;
    }

    getStructure(x,z){
        if (x < 0 || z < 0 || x > this.size || z > this.size) return null;
        return this.structures[x * this.size + z];
    }

    buildLevel(){
        let meshBuild = MeshBuilder.start(this.gl,0,0,0,0.5);
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                let s = this.getStructure(x,z);
                if (s instanceof Wall){
                    // Only create faces that are visible. Faces facing nothing or other solid blocks are a waste of verticies.
                    let l = this.getStructure(x-1,z);
                    let r = this.getStructure(x+1,z);
                    let f = this.getStructure(x,z+1);
                    let b = this.getStructure(x,z-1);
                    if (l!= null && !l.isSolid()) MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x-1,z),this.height,s.tint,null);
                    if (r!= null && !r.isSolid()) MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x+1,z),this.height,s.tint,null);
                    if (f!= null && !f.isSolid()) MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z+1),this.height,s.tint,null);
                    if (b!= null && !b.isSolid()) MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z-1),this.height,s.tint,null);
                }else if (s instanceof Floor){
                    MeshBuilder.top(s.texture.getUVs(),meshBuild,x,-1,z,this.getLight(x,z),s.tint,null);
                    MeshBuilder.bottom(s.texture.getUVs(),meshBuild,x,this.height,z,this.getLight(x,z),s.tint,null);
                }
            }
        }

        this.structureMesh = MeshBuilder.build(meshBuild);
    }

    buildTransparentLevel(){
        let meshBuild = MeshBuilder.start(this.gl,0,0,0,0.5);
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                let s = this.getStructure(x,z);
                if (s instanceof Lightblock){
                    let l = this.getStructure(x-1,z);
                    let r = this.getStructure(x+1,z);
                    let f = this.getStructure(x,z+1);
                    let b = this.getStructure(x,z-1);
                    if (l!= null && !l.isSolid()) MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x-1,z),this.height,s.tint,null);
                    if (r!= null && !r.isSolid()) MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x+1,z),this.height,s.tint,null);
                    if (f!= null && !f.isSolid()) MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z+1),this.height,s.tint,null);
                    if (b!= null && !b.isSolid()) MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z-1),this.height,s.tint,null);

                }
            }
        }

        this.transparentMesh = MeshBuilder.build(meshBuild);
    }

    tick(game,deltaTime){

        if (Math.random() < 0.05){
            this.lightMap = [this.size*this.size];
            this.buildLight();
            this.buildLevel();
            this.buildTransparentLevel();
        }
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
        this.structureMesh.render(gl,this.shaderprogram, this.glTexture);
        
        this.entities.forEach(e => {
            e.render(gl);
        });


        gl.enable(this.gl.BLEND)

        this.transparentMesh.render(gl,this.shaderprogram, this.glTexture);

                gl.disable(this.gl.BLEND);

       
    }
    
}