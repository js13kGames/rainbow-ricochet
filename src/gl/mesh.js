//The order of and index forming a triangle
var indicies = [0,1,2,0,2,3];
//The mesh class which is responsive for rendering an object on the screen. See WebGL or OpenGL-tutorials for more info how this works.
//This one is only usable for boxes/squares
import Game from "../game.js";
export default class Mesh{
    constructor(gl, x,y,z){
        this.verticies = [];

        this.position = [x,y,z];

        this.scale = [1,1,1];

        this.rotX = 0;
        this.rotY = 0;
        this.setPos(x,y,z);

        this.positionsBuffer = Game.gl.createBuffer();
        this.colorsBuffer = Game.gl.createBuffer();
        this.lightsBuffer = Game.gl.createBuffer();
        this.uvsBuffer = Game.gl.createBuffer();
        this.indiciesBuffer = Game.gl.createBuffer();

    }

    //Add verticies, colors, UVs and lights to this mesh
    addVerticies(verticies, cols, uvs,lights){
        this.verticies.push(...verticies);
        this.updateCols(cols);
        this.updateUVs(uvs);
        this.updateLights(lights);
    }

    updateMesh(){
        //Calculate verticies, colors, UVs and lights of this mesh.
        //This will create the Float32Arrays and Uint16Arrays that WebGL wants the data in.

        //Every 6th verticies needs one index (two triangles)
        let indiciesNeeded = this.verticies.length/6;

        //Assign correct sizes of the buffers. Verticies x,y,z, Colors r,g,b,a, UVs 4 corners with 2 values each. Indicies 6 values forming two triangles
        this.verticiesBuffer32 = new Float32Array(this.verticies.length*3);
        this.cArrayBuffer32 = new Float32Array(this.verticies.length*4);
        this.uvArrayBuffer32 = new Float32Array(this.verticies.length*8);
        this.indiciesBuffer16 = new Uint16Array(indiciesNeeded*6);

        let vertexCounter = 0;
        let counter = 0;

        this.verticiesBuffer32.set(this.verticies);

        //Since we are always using squares the indicies will be the same for every 6 verticies
        for (let i = 0; i < indiciesNeeded; i++){
            for (let c = 0; c < 6; c++){
                this.indiciesBuffer16[counter+c] = indicies[c] + vertexCounter;
            }
            vertexCounter += 4;
            counter += 6;
        }

        this.numberOfIndicies = counter;

        //Upload the arrays to the buffers on the graphic card
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.positionsBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.verticiesBuffer32, Game.gl.DYNAMIC_DRAW);

        this.uploadCols();
        this.uploadLights();
        this.uploadUVs();
        Game.gl.bindBuffer(Game.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        Game.gl.bufferData(Game.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer16, Game.gl.DYNAMIC_DRAW);
    }

    cleanUp(){
        this.verticies = [];
        this.cs = [];
        this.uvs = [];
        this.verticiesBuffer32 = null;
        this.cArrayBuffer32 = null;
        this.uvArrayBuffer32 = null;
        this.indiciesBuffer16 = null;
        this.lightArrayBuffer32 = null;
    }

    //Move this mesh to a new position.
    setPos(x, y, z){
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
    }
    //Scale the mesh
    setS(s){
        this.scale[0]=s;
        this.scale[1]=s;
        this.scale[2]=s;
    }
    
    //Set the X rotation
    setRotationX(r){
        this.rotX = r;
    }

    //Set the Y rotation
    setRotationY(r){
        this.rotY = r;
    }

    updateCols(c){
        this.cs = c.flat();
    }
    updateLights(lights){
        this.lights = lights.flat();
    }

    updateUVs(uvs){
        this.uvs = [];
        uvs.forEach(uv => { this.uvs.push(uv);});
    }

    uploadCols(){
        this.cArrayBuffer32.set(this.cs);
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.colorsBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.cArrayBuffer32, Game.gl.DYNAMIC_DRAW);
    }
    uploadLights(){
        this.lightArrayBuffer32 = new Float32Array(this.verticies.length*4);
        this.lightArrayBuffer32.set(this.lights);
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.lightsBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.lightArrayBuffer32, Game.gl.DYNAMIC_DRAW);
    }
    uploadUVs(){
        let counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });
        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.uvsBuffer);
        Game.gl.bufferData(Game.gl.ARRAY_BUFFER, this.uvArrayBuffer32, Game.gl.DYNAMIC_DRAW);

    }
    //Render the mesh with WebGL.
    render(targetCamera=null){
        var camera = targetCamera == null ? Game.camera : targetCamera;

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.positionsBuffer);
        Game.gl.vertexAttribPointer(Game.shaderProgram.locations.attribLocations.vertexPosition, 3, Game.gl.FLOAT, false, 0, 0);
        Game.gl.enableVertexAttribArray(Game.shaderProgram.locations.attribLocations.vertexPosition);

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.colorsBuffer);
        Game.gl.vertexAttribPointer(Game.shaderProgram.locations.attribLocations.color, 4, Game.gl.FLOAT, false, 0, 0);
        Game.gl.enableVertexAttribArray(Game.shaderProgram.locations.attribLocations.color);

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.lightsBuffer);
        Game.gl.vertexAttribPointer(Game.shaderProgram.locations.attribLocations.light, 4, Game.gl.FLOAT, false, 0, 0);
        Game.gl.enableVertexAttribArray(Game.shaderProgram.locations.attribLocations.light);

        Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, this.uvsBuffer);
        Game.gl.vertexAttribPointer(Game.shaderProgram.locations.attribLocations.uv, 2, Game.gl.FLOAT, false, 0, 0);
        Game.gl.enableVertexAttribArray(Game.shaderProgram.locations.attribLocations.uv);

        Game.gl.useProgram(Game.shaderProgram.shaderProgram);

        Game.gl.uniform1i(Game.shaderProgram.locations.uniformLocations.uSampler, 0);

        Game.gl.uniform1f(Game.shaderProgram.locations.uniformLocations.meshRotX, this.rotX);
        Game.gl.uniform1f(Game.shaderProgram.locations.uniformLocations.meshRotY, this.rotY);
        Game.gl.uniform3f(Game.shaderProgram.locations.uniformLocations.meshPosition, this.position[0], this.position[1], this.position[2]);
        Game.gl.uniform3f(Game.shaderProgram.locations.uniformLocations.meshScale, this.scale[0], this.scale[1], this.scale[2]);


        Game.gl.uniform1f(Game.shaderProgram.locations.uniformLocations.cameraRotX, camera.currentRotX);
        Game.gl.uniform1f(Game.shaderProgram.locations.uniformLocations.cameraRotY, camera.currentRot);
        Game.gl.uniform3f(Game.shaderProgram.locations.uniformLocations.cameraPosition, camera.position.x, camera.position.y, camera.position.z);

        Game.gl.bindBuffer(Game.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        Game.gl.drawElements(Game.gl.TRIANGLES,  this.numberOfIndicies,Game.gl.UNSIGNED_SHORT,0);
    }
}