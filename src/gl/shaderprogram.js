var e = "error:";
//WebGL shaderprogram
import Game from "../game.js";
export default class ShaderProgram{

    constructor(gl, vertexshader, fragmentshader){

        this.vertexshader = this.loadShader(Game.gl.VERTEX_SHADER, vertexshader);
        this.fragmentshader = this.loadShader(Game.gl.FRAGMENT_SHADER, fragmentshader);
        this.shaderProgram = Game.gl.createProgram();
        Game.gl.attachShader(this.shaderProgram, this.vertexshader);
        Game.gl.attachShader(this.shaderProgram, this.fragmentshader);
        Game.gl.linkProgram(this.shaderProgram);

        if (!Game.gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert(e+ Game.gl.getProgramInfoLog(this.shaderProgram));
        }

        this.locations = {
            attribLocations: {
                vertexPosition: Game.gl.getAttribLocation(this.shaderProgram, 'p'),
                color: Game.gl.getAttribLocation(this.shaderProgram, 'c'),
                light: Game.gl.getAttribLocation(this.shaderProgram, 'l'),
                uv: Game.gl.getAttribLocation(this.shaderProgram, "u")
              },
              uniformLocations: {
                uSampler: Game.gl.getUniformLocation(this.shaderProgram, 's'),
                meshRotX: Game.gl.getUniformLocation(this.shaderProgram,'rX'),
                meshRotY: Game.gl.getUniformLocation(this.shaderProgram,'rY'),
                meshPosition: Game.gl.getUniformLocation(this.shaderProgram,'mp'),
                meshScale: Game.gl.getUniformLocation(this.shaderProgram, 'ms'),
                cameraRotX: Game.gl.getUniformLocation(this.shaderProgram,'crX'),
                cameraRotY: Game.gl.getUniformLocation(this.shaderProgram,'crY'),
                cameraPosition: Game.gl.getUniformLocation(this.shaderProgram,'cp'),
                fog: Game.gl.getUniformLocation(this.shaderProgram, "o")
              },
        };

    }
    loadShader(type, source) {
        var shader = Game.gl.createShader(type);
        Game.gl.shaderSource(shader, source);
        Game.gl.compileShader(shader);

        if (!Game.gl.getShaderParameter(shader, Game.gl.COMPILE_STATUS)) {
          alert(e + Game.gl.getShaderInfoLog(shader));
          Game.gl.deleteShader(shader);
          return null;
        }

        return shader;
      }
}