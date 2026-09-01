
import Player from "./entity/player.js";
import Camera from "./gl/camera.js";
import GlTexture from "./gl/gltexture.js";

import ShaderProgram from "./gl/shaderprogram.js";
import Input from "./input/input.js";
import Level from "./level/level.js";
import MathUtil from "./mathutil.js";
import Structures from "./structure/structures.js";

import {zzfx} from './lib/z.js'
import UI from "./ui/ui.js";
import Intro from "./ui/intro.js";

const TICK_RATE = 1000 / 60;
const MAX_STEPS = 5;

export default class Game{
    static up = {x:0,y:1,z:0};
    static down = {x:0,y:-1,z:0}
    static rainbowColors = [[1.0,0.8,0.1],[1.0,0.5,0.0],[1.0,0.1,0.1],[0.0,0.8,0.4],[0.0,0.7,0.9],[0.0,0.3,0.5],[0.4,0.1,0.5]];
    static gl;
    static glTexture;
    static shaderProgram;
    static camera;
    static uiCamera;


    constructor(){
        this.canvas = document.getElementById("c");
        this.canvas.width = 852*2;
        this.canvas.height = 480*2;
        Game.gl = this.canvas.getContext("webgl",{antialias: false});

        this.input = new Input();
        this.canvas.addEventListener('click', (e) => { this.canvas.requestPointerLock(); this.mouseLocked = true;});

        this.intro = new Intro(852*2,480*2);
        this.ui = new UI(852*2,480*2);

        this.state = "intro";

        Game.uiCamera = new Camera(0,0,0);

        Game.shaderProgram = new ShaderProgram(Game.gl,`precision highp float; attribute vec4 p; attribute vec4 c; attribute vec4 l; attribute vec2 u; uniform float rX; uniform float rY; uniform float crX; uniform float crY; uniform vec3 cp; uniform vec3 mp; uniform vec3 ms; varying vec4 vc; varying vec2 uv; varying float d; varying vec4 li; mat4 rmX(float rX){ return mat4( 1,0,0,0, 0,cos(rX),-sin(rX),0, 0,sin(rX),cos(rX),0, 0,0,0,1); } mat4 rmY(float rY){ return mat4( cos(rY),0,sin(rY),0, 0,1,0,0, -sin(rY),0,cos(rY),0, 0,0,0,1 ); } mat4 cpm(float fov, float aspect, float near, float far) { float f = 1.0 / tan(fov / 2.0); return mat4( f / aspect, 0.0, 0.0, 0.0, 0.0, f, 0.0, 0.0, 0.0, 0.0, (far + near) / (near - far), -1.0, 0.0, 0.0, (2.0 * far * near) / (near - far), 0.0 ); } void main(){ vec4 rp = rmX(rX) * rmY(rY) * vec4(p.x*ms.x,p.y*ms.y,p.z*ms.z,p.w) + vec4(mp-cp,1.0); mat4 proj = cpm(1.2,2.0,0.1,40.0) * rmX(crX) * rmY(crY); gl_Position = proj * rp; vc=c; li=l; uv=u; }`,` precision highp float; varying vec4 vc; varying vec2 uv; varying float d; varying vec4 li; uniform sampler2D s; void main(){ vec4 col=texture2D(s,uv)*vc;vec4 c=vec4(col.rgb,col.a)*li; if (col.rgb == vec3(0.0,0.0,0.0)) discard; gl_FragColor=c; }`);

        {
        // The shader program above expanded:
        // this.shaderProgram = new ShaderProgram(Game.gl,`
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

        Game.glTexture = new GlTexture(Game.gl, "t.png");
        this.structures = new Structures(Game.glTexture);
        
        this.last = performance.now();
        this.accumulator = this.counter = this.fps = this.tickTime = this.levelSwitchDelay = 0;

        this.levels = [
            [64,0.2,5,[0.2,0.2,0.8,1.0],[0.1,0.5,0.8,1.0],[0.1,0.1,0.5,1.0],l1],
            [64,0.4,5,[0.2,0.4,0.2,1.0],[0.1,0.8,0.5,1.0],[0.1,0.5,0.1,1.0],l2],
            [64,0.1,8,[0.7,0.7,0.2,1.0],[0.8,0.8,0.5,1.0],[0.9,0.9,0.1,1.0],l3],
            [64,0.3,8,[0.7,0.2,0.2,1.0],[0.8,0.5,0.5,1.0],[0.9,0.1,0.3,1.0],l4],
        ];

        //this.levels = [
        //    new Level(this,64,this.player,0.2,5,[0.2,0.2,0.8,1.0],[0.1,0.5,0.8,1.0],[0.1,0.1,0.5,1.0],l1),
       //    new Level(this,64,this.player,0.9,5,[0.8,0.8,0.1,1.0],[0.2,0.5,0.8,1.0],[0.1,0.4,0.5,6.0],l1)
       // ];
        //this.currentLevel = -1;
        this.currentLevel = 2;
        
        this.switchLevel();
        
    }

    update(){
        if (Game.glTexture.dirty) return;

        if (this.state == "game" && Game.camera == null){
            Game.camera = new Camera(this.level.player.position.x,1.4,this.level.player.position.z);
            Game.camera.setRotation(270);
            this.input.resetMouse();
        }

        var now = performance.now();
        var deltaTime = now - this.last;

        this.last = now;

        if (deltaTime > 250) deltaTime = 250; // Dont allow too big jump in time.

        this.counter += deltaTime;


        this.stepTime = deltaTime;
        if (Math.abs(this.stepTime - TICK_RATE) < 0.5) this.stepTime = TICK_RATE;
        this.accumulator += this.stepTime;

        this.time = deltaTime - TICK_RATE;

        this.input.tick(this);
        if (this.state == "game"){
            this.level.player.updateCamera(this);
                if (this.levelSwitchDelay >0) this.levelSwitchDelay -= deltaTime/1000;
        }
        
        
        var steps = 0;
        var tickStart = performance.now();
        var ticked = false;

        while (this.accumulator >= TICK_RATE && steps < MAX_STEPS) {
            this.tick(TICK_RATE / 1000);
            this.accumulator -= TICK_RATE;
            steps++;
            ticked = true;
        }
        if (steps === MAX_STEPS) this.accumulator = 0;

        
        this.tickTime = performance.now() - tickStart;

        if (ticked){
            var renderStart = performance.now();
            Game.gl.clear(Game.gl.COLOR_BUFFER_BIT | Game.gl.DEPTH_BUFFER_BIT);
            if (this.state == "game") Game.gl.clearColor(0.7,0.7,1.0,1.0);
            else if (this.state == "intro") Game.gl.clearColor(0.0,0.0,0.0,1.0);

            Game.gl.enable(Game.gl.DEPTH_TEST);
            Game.gl.depthFunc(Game.gl.LESS);
            Game.gl.enable(Game.gl.CULL_FACE);

            Game.gl.blendFunc(Game.gl.SRC_ALPHA, Game.gl.ONE_MINUS_SRC_ALPHA);
            this.render();

            this.renderTime = performance.now() - renderStart;
            this.fps++;
        }

        // FPS and tick counter
        if (this.counter > 1000){
            this.stableFPS = this.fps;
            this.stableTick = this.tickTime;
            this.stableRend = this.renderTime;
            //console.log("FPS: "+this.fps, " "+Math.ceil(this.player.position.x)+ " "+Math.ceil(this.player.position.z));
            //console.log(this.level.entities.length+" "+this.level.particles.length);
            this.counter = this.fps = 0;
        }
    }

    tick(frameTime){
        if (this.state == "game"){
            this.level.tick(this,frameTime);
            this.ui.tick(frameTime);
        }else if (this.state == "intro"){
            this.intro.tick(frameTime);
        }

    }

    render(){
        if (this.state == "game"){
            this.level.render();
            this.ui.render(this);
        }else if (this.state == "intro"){
            this.intro.render(this);
        }
    }

    playShoot(){
        zzfx(...[,.45,330,.02,.03,.18,,1.9,,-32,,,,.2,,,,.94,.03]); // Pickup 58
    }

    playRainbowWallHit(){
        zzfx(...[1.1,,81,.01,.07,.38,4,3.4,,,,,,.5,,.6,,.44,.08]); // Explosion 77
    }

    playWallHit(){
        zzfx(...[3.2,,446,.02,.04,.17,,1.1,,,,,,1.8,,.4,,.56,.02,,-1623]); // Hit 492
    }

    throwRainbow(){
        zzfx(...[.8,,334,.03,.19,.08,,3.2,-13,45,,,,,,.1,,.56,.08,,-1182]); // Shoot 81
    }

    catchRainbow(){
        zzfx(...[2,,257,.01,.03,.17,,3.3,,-96,113,.07,,,,,.04,.51,.01,,-1409]); // Pickup 109
    }

    pickupKey(){
        zzfx(...[.6,,270,,.09,.07,1,,,,396,.07,.09,,,,,.85,,,146]); // Pickup 135
    }

    openDoor(){
        zzfx(...[2.1,,73,.02,.01,.56,2,3.6,,3,,,,.8,,.5,.27,.45,.17]); // Explosion 317
    }

    monsterHit(){
        zzfx(...[1.5,,378,.02,.09,.15,,2.8,-9,,,,,1.7,,.4,.07,.81,.02,,-1900]); // Hit 342
    }

    monsterDie(){
        zzfx(...[2,,89,.02,.01,.54,4,1.6,,8,,,,.8,,.3,.36,.49,.17]); // Explosion 344
    }

    monsterAggro(){
        //zzfx(...[1.2,,63,.06,.25,.41,3,1.6,,5,,,,1.3,3.2,.5,.47,.37,.12,,-3066]); // Explosion 404
    }

    playerHurt(){
        zzfx(...[2,.5,185,.01,.04,.07,,.8,-4,,,,,.7,7.4,.4,,.59,.03]); // Hit 439
    }

    healthPickedUp(){
        zzfx(...[.3,.45,672,.02,.02,.2,1,.6,,,324,.06,.02,,,,,.91,.03]); // Pickup 521
    }

    pickedUp(thing){
        this.ui.queueMessage("PICKED UP "+thing+".");
    }

    switchLevel(){
        if (this.levelSwitchDelay >0) return;
        this.currentLevel++;
        var lArgs = this.levels[this.currentLevel];
        this.level = new Level(this,lArgs[0],this.player,lArgs[1],lArgs[2],lArgs[3],lArgs[4],lArgs[5],lArgs[6]);
        this.levelSwitchDelay = 1;
    }
}