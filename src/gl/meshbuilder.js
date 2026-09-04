import Mesh from "../gl/mesh.js";
let baseSize;
var white = [1,1,1,1];
//Create a square mesh by batching the various sides of it.
export default class MeshBuilder{

    //Create a new batch
    static start(gl,x,y,z,size=0.5){    
        baseSize = size;
        return {mesh:new Mesh(gl,x,y,z),verticies:[],colors:[],uvs:[],lights:[]};
    }

    //Set the colors of current added side
    static addColor(colors,color){
        if (color == null) color = white;
            colors.push(color,color,color,color);
    }
    //Set the lights of current added side
    static addLight(lights,light){
        let l = [light,light,light,1];
        lights.push(l,l,l,l);
    }

    //Finish the batch and build the mesh
    static build(meshBuild){
        meshBuild.mesh.addVerticies(meshBuild.verticies, meshBuild.colors, meshBuild.uvs,meshBuild.lights);
        meshBuild.mesh.updateMesh();
        return meshBuild.mesh;
    }

    //Add left side of the mesh. Heigth and offset can be specified
    static left(uvs,builder,x,y,z,light,height,color,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h-baseSize,z+baseSize,
                x-baseSize,y+h+ySize,z+baseSize,
                x-baseSize,y+h+ySize,z-baseSize
            );
        }

    }
    //Add right side of the mesh. Heigth and offset can be specified
    static right(uvs,builder,x,y,z,light,height,color,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z-baseSize,
                x+baseSize,y+h+ySize,z-baseSize,
                x+baseSize,y+h+ySize,z+baseSize
            );
        }
    }
    //Add front side of the mesh. Heigth and offset can be specified
    static front(uvs,builder,x,y,z,light,height,color,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x-baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h+ySize,z+baseSize,
                x-baseSize,y+h+ySize,z+baseSize
            );
        }
    }
    //Add back side of the mesh. Heigth and offset can be specified
    static back(uvs,builder,x,y,z,light,height,color,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x+baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h+ySize,z-baseSize,
                x+baseSize,y+h+ySize,z-baseSize

            );
        }
    }

    //Add left side of the mesh. Offset can be specified
    static top(uvs,builder,x,y,z,light, color){
        MeshBuilder.addColor(builder.colors,color);
        MeshBuilder.addLight(builder.lights,light);
        
        uvs.forEach(uv => { builder.uvs.push(uv); });
        builder.verticies.push(
            x-baseSize,y+baseSize,z-baseSize,
            x-baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z-baseSize
        );
    }
    static bottom(uvs,render,x,y,z,light, color){

        MeshBuilder.addColor(render.colors,color);
        MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z+baseSize,
            x-baseSize,y-baseSize,z+baseSize
        );
    }

    // Same as front but centered
    static billboard(uvs,builder,x,y,z,light,height,color){
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x-baseSize,y+h-baseSize,z,
                x+baseSize,y+h-baseSize,z,
                x+baseSize,y+h+baseSize,z,
                x-baseSize,y+h+baseSize,z
            );
        }
    }
}