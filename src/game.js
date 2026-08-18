
import Player from "./entity/player.js";
import Camera from "./gl/camera.js";
import GlTexture from "./gl/gltexture.js";

import ShaderProgram from "./gl/shaderprogram.js";
import Input from "./input/input.js";
import Level from "./level/level.js";
import MathUtil from "./mathutil.js";
import Structures from "./structure/structures.js";



export default class Game{
    static up = {x:0,y:1,z:0};
    static down = {x:0,y:-1,z:0}
    static rainbowColors = [[1.0,0.8,0.1],[1.0,0.5,0.0],[1.0,0.1,0.1],[0.0,0.8,0.4],[0.0,0.7,0.9],[0.0,0.3,0.5],[0.4,0.1,0.5]];


    constructor(){
        this.canvas = document.getElementById("c");
        this.canvas.width = 854*2;
        this.canvas.height = 480*2;
        this.gl = this.canvas.getContext("webgl",{antialias: false});

        this.input = new Input();
        this.canvas.addEventListener('click', (e) => { this.canvas.requestPointerLock(); this.mouseLocked = true;});

        this.shaderProgram = new ShaderProgram(this.gl,`precision highp float; attribute vec4 p; attribute vec4 c; attribute vec4 l; attribute vec2 u; uniform float rX; uniform float rY; uniform float crX; uniform float crY; uniform vec3 cp; uniform vec3 mp; uniform vec3 ms; varying vec4 vc; varying vec2 uv; varying float d; varying vec4 li; mat4 rmX(float rX){ return mat4( 1,0,0,0, 0,cos(rX),-sin(rX),0, 0,sin(rX),cos(rX),0, 0,0,0,1); } mat4 rmY(float rY){ return mat4( cos(rY),0,sin(rY),0, 0,1,0,0, -sin(rY),0,cos(rY),0, 0,0,0,1 ); } mat4 cpm(float fov, float aspect, float near, float far) { float f = 1.0 / tan(fov / 2.0); return mat4( f / aspect, 0.0, 0.0, 0.0, 0.0, f, 0.0, 0.0, 0.0, 0.0, (far + near) / (near - far), -1.0, 0.0, 0.0, (2.0 * far * near) / (near - far), 0.0 ); } void main(){ vec4 rp = rmX(rX) * rmY(rY) * vec4(p.x*ms.x,p.y*ms.y,p.z*ms.z,p.w) + vec4(mp-cp,1.0); mat4 proj = cpm(1.2,2.0,0.1,40.0) * rmX(crX) * rmY(crY); gl_Position = proj * rp; vc=c; li=l; uv=u; }`,` precision highp float; varying vec4 vc; varying vec2 uv; varying float d; varying vec4 li; uniform sampler2D s; void main(){ vec4 col=texture2D(s,uv)*vc;vec4 c=vec4(col.rgb,col.a)*li; if (col.rgb == vec3(0.0,0.0,0.0)) discard; gl_FragColor=c; }`);

        {
        // The shader program above expanded:
        // this.shaderProgram = new ShaderProgram(this.gl,`
        //     precision highp float;
        //     attribute vec4 p;
        //     attribute vec4 c;
        //     attribute vec4 l;
        //     attribute vec2 u;
        //     uniform float rX;
        //     uniform float rY;
        //     uniform float crX;
        //     uniform float crY;
        //     uniform vec3 cp;
        //     uniform vec3 mp;
        //     uniform vec3 ms;
            
        //     varying vec4 vc;
        //     varying vec2 uv;
        //     varying float d;
        //     varying vec4 li;

        //     mat4 rmX(float rX){
        //         return mat4(
        //         1,0,0,0,
        //         0,cos(rX),-sin(rX),0,
        //         0,sin(rX),cos(rX),0,
        //         0,0,0,1);
        //     }

        //     mat4 rmY(float rY){
        //         return mat4(
        //         cos(rY),0,sin(rY),0,
        //         0,1,0,0,
        //         -sin(rY),0,cos(rY),0,
        //         0,0,0,1
        //       );
        //     }

        //     mat4 cpm(float fov, float aspect, float near, float far) {
        //         float f = 1.0 / tan(fov / 2.0);
        //         return mat4(
        //             f / aspect, 0.0, 0.0, 0.0,
        //             0.0, f, 0.0, 0.0,
        //             0.0, 0.0, (far + near) / (near - far), -1.0,
        //             0.0, 0.0, (2.0 * far * near) / (near - far), 0.0
        //         );
        //     }
            

        //     void main(){
        //       vec4 rp = rmX(rX) * rmY(rY) * vec4(p.x*ms.x,p.y*ms.y,p.z*ms.z,p.w) + vec4(mp-cp,1.0);
        //       mat4 proj = cpm(1.2,2.0,0.1,20.0) * rmX(crX) * rmY(crY);

        //       gl_Position = proj * rp;
        //       vc=c;
        //       li=l;
        //       uv=u;
        //     }`,`
        //     precision highp float;
        //     varying vec4 vc;
        //     varying vec2 uv;
        //     varying float d;
        //     varying vec4 li;
        //     uniform sampler2D s;
        //     void main(){
        //       vec4 col=texture2D(s,uv)*vc;
        //       vec4 c=vec4(col.rgb,col.a)*li;
        //       if (col.rgb == vec3(0.0,0.0,0.0))
        //         discard;
        //       gl_FragColor=c;
        //     }`);
        }

        this.glTexture = new GlTexture(this.gl, "t.png");
        this.structures = new Structures(this.glTexture);
        
        this.player = new Player(1,0,1);

        this.gl.camera = new Camera(this.gl,this.player.position.x,1.2,this.player.position.z);
        this.gl.camera.setRotation(270);

        this.last = performance.now();
        //this.counter = 0;
        //this.fps = 0;

        this.level = new Level(this,64,this.player,0.3,10);
    }

    update(){
        if (this.glTexture.dirty) return;
        var now = performance.now();
        var deltaTime = now - this.last;
        if (deltaTime>500) deltaTime = 16; // Dont allow too big jump in time.
        this.last = now;

        //this.counter += deltaTime;


            this.tick(deltaTime/1000);


            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.clearColor(0.0,0.0,0.0,1.0);

            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LESS);
            this.gl.enable(this.gl.CULL_FACE);

            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.render();

            //this.fps++;



        // FPS and tick counter
        //if (this.counter > 1000){
            //console.log("FPS: "+this.fps, " "+Math.ceil(this.player.position.x)+ " "+Math.ceil(this.player.position.z));
            this.counter = this.fps = 0;
       // }
    }

    tick(deltaTime){
        this.input.tick(this);

        
        //this.player.tick(this,deltaTime);

        this.level.tick(this,deltaTime);
    }

    render(){
        this.level.render(this.gl);
        //this.player.render(this.gl);
    }
}