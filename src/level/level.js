import Floor from "../structure/floor.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Structure from "../structure/structure.js";
import Wall from "../structure/wall.js";
import Structures from "../structure/structures.js";
import Rainbow from "../entity/rainbow.js";
import MathUtil from "../mathutil.js";
import Lightblock from "../structure/lightblock.js";
import Darkness from "../entity/darkness.js";
import Door from "../entity/door.js";
import Key from "../entity/key.js";
import UnicornHorn from "../entity/unicornhorn.js";

export default class Level{
    constructor(game,size,player,ambientLight,height){
        this.gl = game.gl;
        this.shaderprogram = game.shaderProgram;
        this.glTexture = game.glTexture;
        this.entities = [];
        this.particles = [];
        this.structures = [];
        this.entities.push(player);
        this.player = player;

        this.level = [size*size];
        this.lightMap = [size*size];
        this.size = size;
        this.ambientLight = ambientLight;
        this.height = height;


        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++){
                var levelChar = l.charAt(x + (z*this.size));

                if (levelChar == "#") this.setStructure(x,z,Structures.wall);
                else if (levelChar == "x") this.addDoor(game, x,z,Door.green);
                else if (levelChar == "y") this.addDoor(game, x,z,Door.blue);
                else if (levelChar == "z") this.addDoor(game, x,z,Door.yellow);
                else if (levelChar == "u") this.addKey(game, x,z,Door.green);
                else if (levelChar == "v") this.addKey(game, x,z,Door.blue);
                else if (levelChar == "w") this.addKey(game, x,z,Door.yellow);
                else if (levelChar == "h") this.addUnicornHorn(game, x,z);
                else if (levelChar == "a") this.setStructure(x,z,Structures.floor1);
                else if (levelChar == "b") this.setStructure(x,z,Structures.floor2);
                else if (levelChar == "c") this.setStructure(x,z,Structures.floor3);
                else if (levelChar == "d") this.setStructure(x,z,Structures.floor4);
                else this.setStructure(x,z,Structures.floor);
                if (levelChar == "p") { player.position = {x:x,y:0,z:z}; this.setStructure(x,z,Structures.floor); }

                if (levelChar == "m") this.addDarkness(game,x,z);

                
                if (x == 0 || z == 0 || x == size-1 || z == size-1) this.setStructure(x,z,Structures.wall);
            }
        }

        this.buildLight();
        

        this.buildWallLevel();
        this.buildFloorLevel();
        this.buildTransparentLevel();
    }

    addDoor(game, x,z,color){
        this.addEntity(new Door(this,game.gl,game.shaderProgram,game.glTexture,x,0,z,color));
        this.setStructure(x,z,Structures.doorBlock);
    }

    addKey(game, x,z,color){
        this.addEntity(new Key(game.gl,game.shaderProgram,game.glTexture,x,0,z,color));
        this.setStructure(x,z,Structures.floor);
    }

    addUnicornHorn(game,x,z){
        var floor = this.getStructure(x-1,z);
        this.setStructure(x,z,floor);
        this.addEntity(new UnicornHorn(game.gl, game.shaderProgram,game.glTexture,x,floor.height,z));
    }

    addDarkness(game,x,z){
        var floor = this.getStructure(x-1,z);
        var height = 0;
        if (floor != Structure.floor){
            this.setStructure(x,z,floor);
            height = floor.height;
        }

        this.addEntity(new Darkness(game.gl,game.shaderProgram,game.glTexture,x,height,z));
    }

    buildLight(){
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                var levelChar = l.charAt(x + (z*this.size));
                if (levelChar == "l"){
                    this.setStructure(x,z,Structures.lightBlock);
                    //if (Math.random() > 0.4) this.generateLight(x,z,10,5);
                    this.generateLight(x,z,12,4);
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
                light *= 0.74;
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

    addParticle(particle){
        this.particles.push(particle);
    }

    deleteParticle(particle){
        this.deleteFromList(particle,this.particles);
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

    removeStructure(x,z){
        this.structures[x * this.size + z] = null;
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

    buildWallLevel(){
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
                }
            }
        }

        this.wallMesh = MeshBuilder.build(meshBuild);
    }

    buildFloorLevel(){
        let meshBuild = MeshBuilder.start(this.gl,0,0,0,0.5);
        for (let x = 0; x < this.size; x++) {
            for (let z = 0; z < this.size; z++){
                let s = this.getStructure(x,z);
                if (s instanceof Floor){
                    if (s.height == 0) MeshBuilder.top(s.texture.getUVs(),meshBuild,x,-1,z,this.getLight(x,z),s.tint,null);
                    else if (s.height > 0){
                        MeshBuilder.top(s.texture.getUVs(),meshBuild,x,-1+s.height,z,this.getLight(x,z),s.tint,null);

                        MeshBuilder.left(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x-1,z),1,s.tint,null,s.height-0.5);
                        MeshBuilder.right(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x+1,z),1,s.tint,null,s.height-0.5);
                        MeshBuilder.front(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z+1),1,s.tint,null,s.height-0.5);
                        MeshBuilder.back(s.texture.getUVs(),meshBuild,x,0,z,this.getLight(x,z-1),1,s.tint,null,s.height-0.5);
                    }
                    MeshBuilder.bottom(s.texture.getUVs(),meshBuild,x,this.height,z,this.getLight(x,z),s.tint,null);
                }
            }
        }

        this.floorMesh = MeshBuilder.build(meshBuild);
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

       /* if (Math.random() < 0.05){
            this.lightMap = [this.size*this.size];
            this.buildLight();
            this.buildWallLevel();
            this.buildFloorLevel();
            this.buildTransparentLevel();
        }*/
        this.entities.forEach(a => {
            if (a.disposed) this.deleteEntity(a);
            else a.tick(game,deltaTime);
        });

        this.particles.forEach(a =>{
            if (a.disposed) this.deleteParticle(a);
            else a.tick(game,deltaTime);
        })

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
        this.wallMesh.render(gl,this.shaderprogram, this.glTexture);
        this.floorMesh.render(gl,this.shaderprogram, this.glTexture);
        
        this.entities.forEach(e => {
            e.render(gl);
        });

        this.particles.forEach(e => {
            e.render(gl);
        });


        gl.enable(this.gl.BLEND)

        this.transparentMesh.render(gl,this.shaderprogram, this.glTexture);

        this.player.renderInHand(gl);
        gl.disable(this.gl.BLEND);

       
    }
    
}