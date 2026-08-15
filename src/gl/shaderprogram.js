const e = "error:";
//WebGL shaderprogram
export default class ShaderProgram{

    constructor(gl, vertexshader, fragmentshader){

        this.vertexshader = this.loadShader(gl, gl.VERTEX_SHADER, vertexshader);
        this.fragmentshader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentshader);
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexshader);
        gl.attachShader(this.shaderProgram, this.fragmentshader);
        gl.linkProgram(this.shaderProgram);

        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert(e+ gl.getProgramInfoLog(this.shaderProgram));
        }

        this.locations = {
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.shaderProgram, 'p'),
                color: gl.getAttribLocation(this.shaderProgram, 'c'),
                light: gl.getAttribLocation(this.shaderProgram, 'l'),
                uv: gl.getAttribLocation(this.shaderProgram, "u")
              },
              uniformLocations: {
                uSampler: gl.getUniformLocation(this.shaderProgram, 's'),
                meshRotX: gl.getUniformLocation(this.shaderProgram,'rX'),
                meshRotY: gl.getUniformLocation(this.shaderProgram,'rY'),
                meshPosition: gl.getUniformLocation(this.shaderProgram,'mp'),
                meshScale: gl.getUniformLocation(this.shaderProgram, 'ms'),
                cameraRotX: gl.getUniformLocation(this.shaderProgram,'crX'),
                cameraRotY: gl.getUniformLocation(this.shaderProgram,'crY'),
                cameraPosition: gl.getUniformLocation(this.shaderProgram,'cp')
              },
        };

    }
    loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(e + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }
}