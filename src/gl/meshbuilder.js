import Mesh from "../gl/mesh.js";
let baseSize;
const white = [1,1,1,1];
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

    static addLightArray(lights,lightArray){
        //let l = [light,light,light,1];
        for (let i = 0; i < 4; i++) {
            lights.push([lightArray[i],lightArray[i],lightArray[i],1]);          
        }
        //lights.push(lightArray[0],lightArray[1],lightArray[2],lightArray[3]);
    }

    //Finish the batch and build the mesh
    static build(meshBuild){
        meshBuild.mesh.addVerticies(meshBuild.verticies, meshBuild.colors, meshBuild.uvs,meshBuild.lights);
        meshBuild.mesh.updateMesh();
        return meshBuild.mesh;
    }

    //Add left side of the mesh. Heigth and offset can be specified
    static left(uvs,builder,x,y,z,light,height,color,lightArray,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        console.log(ySize);
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
            else MeshBuilder.addLight(builder.lights,light);
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
    static right(uvs,builder,x,y,z,light,height,color,lightArray,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        console.log(ySize);
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
            else MeshBuilder.addLight(builder.lights,light);
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
    static front(uvs,builder,x,y,z,light,height,color,lightArray,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
            else MeshBuilder.addLight(builder.lights,light);
            uvs.forEach(uv => { builder.uvs.push(uv); });
            builder.verticies.push(
                x-baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h+ySize,z+baseSize,
                x-baseSize,y+h+ySize,z+baseSize
            );
        }
        // if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
        //     else MeshBuilder.addLight(builder.lights,light);
        //     //uvs.forEach(uv => { builder.uvs.push(uv); });
        //     console.log(uvs);
        //     builder.uvs.push([0,1.0,0],[0.25,1.0,0],[0.25,0,0],[0,0,0]);
        //     builder.verticies.push(
        //         x-baseSize,y-baseSize,z+baseSize,
        //         x+baseSize,y-baseSize,z+baseSize,
        //         x+baseSize,y+3+baseSize,z+baseSize,
        //         x-baseSize,y+3+baseSize,z+baseSize
        //     );
    }
    //Add back side of the mesh. Heigth and offset can be specified
    static back(uvs,builder,x,y,z,light,height,color, lightArray,customYSize=0){
        var ySize = customYSize > 0 ? customYSize : baseSize;
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
             else MeshBuilder.addLight(builder.lights,light);
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
    static top(uvs,builder,x,y,z,light, color, lightArray){
        //console.log(lightArray);
        MeshBuilder.addColor(builder.colors,color);
        if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
        else MeshBuilder.addLight(builder.lights,light);
        
        uvs.forEach(uv => { builder.uvs.push(uv); });
        builder.verticies.push(
            x-baseSize,y+baseSize,z-baseSize,
            x-baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z-baseSize
        );
    }
    static bottom(uvs,render,x,y,z,light, color, lightArray){

        MeshBuilder.addColor(render.colors,color);
        if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
        else MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z+baseSize,
            x-baseSize,y-baseSize,z+baseSize
        );
    }

    // Same as front but centered
    static billboard(uvs,builder,x,y,z,light,height,color,lightArray){
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(builder.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(builder.lights,lightArray);
            else MeshBuilder.addLight(builder.lights,light);
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