
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
import LevelSwitch from "./ui/levelswitch.js";

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
    static fogColor;


    constructor(){
        this.canvas = document.getElementById("c");
        Game.gl = this.canvas.getContext("webgl",{antialias: false});

        this.input = new Input();
        this.canvas.addEventListener('click', (e) => { this.canvas.requestPointerLock(); this.mouseLocked = true;});

        this.intro = new Intro();
        this.ui = new UI();
        this.levelSwitch = new LevelSwitch();

        this.state = "intro";

        Game.uiCamera = new Camera(0,0,0);
        Game.shaderProgram = new ShaderProgram(Game.gl,`precision highp float;attribute vec4 p,c,l,f;attribute vec2 u;uniform float rX,rY,crX,crY;uniform vec3 cp,mp,ms;uniform vec4 o;varying vec4 vc,fc;varying vec2 uv;varying float cz;varying vec4 li;mat4 rmX(float rX){return mat4(1,0,0,0,0,cos(rX),-sin(rX),0,0,sin(rX),cos(rX),0,0,0,0,1);}mat4 rmY(float rY){return mat4(cos(rY),0,sin(rY),0,0,1,0,0,-sin(rY),0,cos(rY),0,0,0,0,1);}mat4 cpm(float fov,float aspect,float near,float far){float f=1./tan(fov/2.);return mat4(f/aspect,0.,0.,0.,0.,f,0.,0.,0.,0.,(far+near)/(near-far),-1.,0.,0.,(2.*far*near)/(near-far),0.);}void main(){vec4 rp=rmX(rX)*rmY(rY)*vec4(p.x*ms.x,p.y*ms.y,p.z*ms.z,p.w)+vec4(mp-cp,1.);mat4 proj=cpm(1.2,2.,0.1,40.)*rmX(crX)*rmY(crY);gl_Position=proj*rp;vc=c;li=l;uv=u;fc=o;cz=-rp.z;}`,`precision highp float;varying vec4 vc,li,fc;varying vec2 uv;varying float cz;uniform sampler2D s;uniform float t;void main(){float fogFactor=exp2(-.0035*cz*cz);vec4 col=texture2D(s,uv);if(col.a==0.)discard;vec4 c=col*vc*li;c.rgb*=.8+.04*sin(t*.005)+.07*cos(t*.003)+.05*sin(t*.006);gl_FragColor=mix(fc,c,fogFactor);}`);

        {
       //The shader program above expanded:
        // Game.shaderProgram = new ShaderProgram(Game.gl,`
        //     precision highp float; 
        //     attribute vec4 p,c,l,f; //p=vertexPosition,c=color,l=light strength
        //     attribute vec2 u; //u=uv texture coordinates
        //     uniform float rX,rY,crX,crY; //rX,rY=mesh rotation, crX, crY=camera rotation
        //     uniform vec3 cp,mp,ms; //cp=cameraPosition, mp=meshPosition,ms=meshScale
        //     uniform vec4 o; //o=fog color
        //     varying vec4 vc,fc; //varying to fragment shader vc=color,fc=fog color
        //     varying vec2 uv; // varying to fragment shader uv=uv texture coordinates
        //     varying float cz; //varying to fragment shader cz=camera z-depth buffer
        //     varying vec4 li; // varying to fragment shader li=light strength
        //     //x rotation matrix
        //     mat4 rmX(float rX){ 
        //         return mat4( 1,0,0,0, 0,cos(rX),-sin(rX),0, 0,sin(rX),cos(rX),0, 0,0,0,1); 
        //     }
        //     //y rotation matrix
        //     mat4 rmY(float rY){ 
        //         return mat4( cos(rY),0,sin(rY),0, 0,1,0,0, -sin(rY),0,cos(rY),0, 0,0,0,1 ); 
        //     }
        //     // camera projection matrix
        //     mat4 cpm(float fov, float aspect, float near, float far) { 
        //         float f = 1.0 / tan(fov / 2.0);
        //         return mat4( f / aspect, 0., 0., 0., 0., f, 0., 0., 0., 0., (far + near) / (near - far), -1., 0., 0., (2. * far * near) / (near - far), 0. ); 
        //     }
            
        //     void main(){ 
        //         // rotation matrix of the vertex with x and y rotation plus scaling
        //         vec4 rp = rmX(rX) * rmY(rY) * vec4(p.x*ms.x,p.y*ms.y,p.z*ms.z,p.w) + vec4(mp-cp,1.);
        //         // projection matrix with field of view of 1.2 (about 90°)
        //         mat4 proj = cpm(1.2,2.,0.1,40.) * rmX(crX) * rmY(crY);
        //         // finally assign this vertex position my multiplying projection matrix with rotation matrix
        //         gl_Position = proj * rp;
        //         assign the different varying variables we need in the fragment shader
        //         vc=c;
        //         li=l;
        //         uv=u;
        //         fc=o;
        //         cz = -rp.z;
        //     }
                
        //     `,`

        //     precision highp float;    
        //     varying vec4 vc,li,fc; // varying from vertex shader vc=color,li=light strength,fc=fog color
        //     varying vec2 uv; // varying from vertex shader uv=uv texture coordinates
        //     varying float cz; //varying from vertex shader cz=camera z-depth buffer
        //     uniform sampler2D s; // the texture sent to the fragment shader by the shaderprogram

        //     uniform float t; // a timer counting upwards, comes from performance.now() during rendering

        //     void main(){
        //         // calculare the ammount of fog based on the camera z-buffer
        //         float fogFactor = exp2(-.0035*cz*cz);
        //         // get the color of the texture pixel that is processed on this position of the screen
        //         vec4 col=texture2D(s,uv);
        //         // don't draw fully transparent pixels (used by the billboarded sprites for example)
        //         if (col.a == 0.) discard;
        //         // multiply texture pixel color with vertexcolor (tint) and the lightstrength
        //         vec4 c=col*vc*li; 
        //         // this one just varies the strength of RGB by doing SIN and COS math using the timer
        //         // this will create a small ammount of smooth light flickering. Since it's using
        //         // three SIN and COS calculation it's not static blinking
        //         c.rgb *= .8+.03*sin(t*.005)+.06*cos(t*.003)+.04*sin(t*.006);
        //         // finally mix the texture color(with tint,light and flickering) with the fog color
        //         gl_FragColor=mix(fc,c,fogFactor);
        //       }
            
        //     `);
        }

        Game.glTexture = new GlTexture(Game.gl, "t.png");
        this.structures = new Structures(Game.glTexture);
        
        this.last = performance.now();
        this.accumulator = this.counter = this.fps = this.tickTime = this.levelSwitchDelay = 0;

        this.levels = [
        // size,ambientlight,height,wallColor,floorColor,glassColor,fogColor,levelData,levelName
            [64,0.2,5,[0.2,0.2,0.8,1.0],[0.1,0.5,0.8,1.0],[0.1,0.1,0.5,1.0],[0.2,0.2,1.0,1],l1,"Blue"],
            [64,0.4,5,[0.2,0.4,0.2,1.0],[0.1,0.8,0.5,1.0],[0.1,0.5,0.1,1.0],[0.0,1.0,0.0,1],l2,"Green"],
            [64,0.1,8,[0.7,0.7,0.2,1.0],[0.8,0.8,0.5,1.0],[0.9,0.9,0.1,1.0],[1.0,1.0,0.0,1],l3,"Yellow"],
            [64,0.3,8,[0.7,0.2,0.2,1.0],[0.8,0.5,0.5,1.0],[0.9,0.1,0.3,1.0],[1.0,0.0,0.1,1],l4,"Red"],
        ];

        this.currentLevel = 1;
        
        this.alreadySeenUnicornMessage = false;
        this.alreadySeenRainbowMessage = false;   
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

        //DEBUG this.counter += deltaTime;


        this.stepTime = deltaTime;
        if (Math.abs(this.stepTime - TICK_RATE) < 0.5) this.stepTime = TICK_RATE;
        this.accumulator += this.stepTime;

        this.time = deltaTime - TICK_RATE;

        this.input.tick(this);
        if (this.state == "game"){
            this.level.player.updateCamera(this);
            if (this.levelSwitchDelay >0) this.levelSwitchDelay -= this.stepTime/1000;
        }
        
        
        var steps = 0;
        //DEBUG var tickStart = performance.now();


        while (this.accumulator >= TICK_RATE && steps < MAX_STEPS) {
            this.tick(TICK_RATE / 1000);
            this.accumulator -= TICK_RATE;
            steps++;

        }
        if (steps === MAX_STEPS) this.accumulator = 0;

        
        //DEBUG this.tickTime = performance.now() - tickStart;


            //DEBUG var renderStart = performance.now();
            Game.gl.clear(Game.gl.COLOR_BUFFER_BIT | Game.gl.DEPTH_BUFFER_BIT);
            if (this.state == "game") Game.gl.clearColor(0.7,0.7,1.0,1.0);
            else if (this.state == "intro") Game.gl.clearColor(0.0,0.0,0.0,1.0);

            Game.gl.enable(Game.gl.DEPTH_TEST);
            Game.gl.depthFunc(Game.gl.LESS);
            Game.gl.enable(Game.gl.CULL_FACE);

            Game.gl.blendFunc(Game.gl.SRC_ALPHA, Game.gl.ONE_MINUS_SRC_ALPHA);
            this.render();

            //DEBUG this.renderTime = performance.now() - renderStart;
            //DEBUG this.fps++;
      //  }

        // FPS and tick counter
        //DEBUG if (this.counter > 1000){
        //DEBUG     this.stableFPS = this.fps;
        //DEBUG     this.stableTick = this.tickTime;
        //DEBUG     this.stableRend = this.renderTime;
        //DEBUG     this.counter = this.fps = 0;
        //DEBUG }
    }

    tick(frameTime){
        if (this.state == "game"){
            this.level.tick(this,frameTime);
            this.ui.tick(frameTime);
        }else if (this.state == "intro"){
            this.intro.tick(frameTime);
        }else if (this.state == "levelswitch"){
            this.levelSwitch.tick(frameTime);
        }

    }

    render(){
        if (this.state == "game"){
            this.level.render();
            this.ui.render(this);
        }else if (this.state == "intro"){
            this.intro.render(this);
        }else if (this.state == "levelswitch"){
            this.levelSwitch.render(this);
        }
    }

    playShoot(){
        zzfx(...[,.45,330,.02,.03,.18,,1.9,,-32,,,,.2,,,,.94,.03]); // Pickup 58
    }

    //playRainbowWallHit(){
    //    zzfx(...[1.1,,81,.01,.07,.38,4,3.4,,,,,,.5,,.6,,.44,.08]); // Explosion 77
   // }

    playWallHit(){
        zzfx(...[3.2,,446,.02,.04,.17,,1.1,,,,,,1.8,,.4,,.56,.02,,-1623]); // Hit 492
    }

    playGlassHit(){
        zzfx(...[.5,,232,.01,.02,.08,1,.7,-9,41,,,,,,,,.71,.07,,100]); // Shoot 641
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
       zzfx(...[.2,0,43,1,0.6,.29,4,.7,-3.6,,,,,.7,,.6,,.7,,,-2968]); // Explosion 842
    }

    monsterHit(){
        zzfx(...[.4,,110,.01,,.19,1,2.5,,-1,,,,1.3,,.2,,.77,.03]); // Hit 859
    }

    monsterDie(){
        //zzfx(...[2,,89,.02,.01,.54,4,1.6,,8,,,,.8,,.3,.36,.49,.17]); // Explosion 344
        zzfx(...[.4,.75,31,.06,.14,.59,,3.8,-6,5,,,,1,,.2,.02,.43,.07]); // Explosion 683
    }

    playerHurt(){
        zzfx(...[2,.5,185,.01,.04,.07,,.8,-4,,,,,.7,7.4,.4,,.59,.03]); // Hit 439
    }

    healthPickedUp(){
        zzfx(...[.3,.45,672,.02,.02,.2,1,.6,,,324,.06,.02,,,,,.91,.03]); // Pickup 521
    }

    pickedUp(thing){
        this.ui.queueMessage("PICKED UP A "+thing+".");
    }

    switchLevel(){
        if (this.levelSwitchDelay >0) return;
        this.levelSwitchDelay = 1;
        this.currentLevel++;
        this.state = "levelswitch";
        if (this.level)this.level.endTime = performance.now();
        
    }

    startLevel(){
        this.playerDead = false;
        var lArgs = this.levels[this.currentLevel];
        this.level = new Level(this,lArgs[0],lArgs[1],lArgs[2],lArgs[3],lArgs[4],lArgs[5],lArgs[7],lArgs[8]);
        Game.fogColor = lArgs[6];
        this.state = "game";
    }

    playerDied(){
        this.playerDead = true;
        this.state = "levelswitch";
        this.ui.clearMessages();
    }
}