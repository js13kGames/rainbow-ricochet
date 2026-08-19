//The order of and index forming a triangle
const indicies = [0,1,2,0,2,3];
//The mesh class which is responsive for rendering an object on the screen. See WebGL or OpenGL-tutorials for more info how this works.
//This one is only usable for boxes/squares
export default class Mesh{
    constructor(gl, x,y,z){
        this.verticies = [];

        this.position = [x,y,z];

        this.scale = [1,1,1];
        this.gl = gl;

        this.rotX = 0;
        this.rotY = 0;
        this.setPos(x,y,z);

        this.positionsBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.lightsBuffer = gl.createBuffer();
        this.uvsBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();

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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.verticiesBuffer32, this.gl.DYNAMIC_DRAW);

        this.uploadCols();
        this.uploadLights();
        this.uploadUVs();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer16, this.gl.DYNAMIC_DRAW);
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.cArrayBuffer32, this.gl.DYNAMIC_DRAW);
    }
    uploadLights(){
        this.lightArrayBuffer32 = new Float32Array(this.verticies.length*4);
        this.lightArrayBuffer32.set(this.lights);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lightsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.lightArrayBuffer32, this.gl.DYNAMIC_DRAW);
    }
    uploadUVs(){
        let counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.uvArrayBuffer32, this.gl.DYNAMIC_DRAW);

    }
    //Render the mesh with WebGL.
    render(gl, shaderProgram, texture,targetCamera=null){
        var camera = targetCamera == null ? gl.camera : targetCamera;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.lightsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.light, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.light);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.uv);

        gl.useProgram(shaderProgram.shaderProgram);

        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        gl.uniform1i(shaderProgram.locations.uniformLocations.uSampler, 0);

        gl.uniform1f(shaderProgram.locations.uniformLocations.meshRotX, this.rotX);
        gl.uniform1f(shaderProgram.locations.uniformLocations.meshRotY, this.rotY);
        gl.uniform3f(shaderProgram.locations.uniformLocations.meshPosition, this.position[0], this.position[1], this.position[2]);
        gl.uniform3f(shaderProgram.locations.uniformLocations.meshScale, this.scale[0], this.scale[1], this.scale[2]);


        gl.uniform1f(shaderProgram.locations.uniformLocations.cameraRotX, camera.currentRotX);
        gl.uniform1f(shaderProgram.locations.uniformLocations.cameraRotY, camera.currentRot);
        gl.uniform3f(shaderProgram.locations.uniformLocations.cameraPosition, camera.position.x, camera.position.y, camera.position.z);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
        //gl.drawElements(gl.POINTS,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
        //gl.drawElements(gl.LINES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}