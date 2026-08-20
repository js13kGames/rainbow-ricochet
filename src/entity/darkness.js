import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Entity from "./entity.js";
import Particle from "./particle.js";
export default class Darkness extends Entity{
    constructor(gl,shaderprogram,glTexture,x,y,z) {
        super(x,y,z);
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.texture = new Texture(glTexture,16,16,16,16);
        this.eyesTexture = new Texture(glTexture,63,0,1,1);
        var tint = [1.0, 1.0, 1.0, 1.0];

        var headCounter = Math.random()*10;
        this.meshMoveCounter = [Math.random()*10,Math.random()*10,headCounter,headCounter];
        this.meshes = [];

        var meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
        
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,+0.5,0,0,0,1,tint,null);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,-0.5,0,0,0,1,tint,null);
        var m = MeshBuilder.build(meshBuild);
        m.scale[0] = 0.4;
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(gl,x,y,z,0.5);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0.1,0.8,0,0,1,tint,null);
        var m = MeshBuilder.build(meshBuild);
        this.meshes.push(m);

        meshBuild = MeshBuilder.start(gl,x,y,z,0.25);
        MeshBuilder.billboard(this.texture.getUVs(),meshBuild,0,1.5,0,0,1,tint,null);

        var m = MeshBuilder.build(meshBuild);
       //m.setS(0.7);
        this.meshes.push(m);


        meshBuild = MeshBuilder.start(gl,x,y,z,0.02);

        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,-0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0],null);
        MeshBuilder.billboard(this.eyesTexture.getUVs(),meshBuild,0.1,1.5,0.02,2,1,[1.0,0.0,0.0,1.0],null);
        var m = MeshBuilder.build(meshBuild);
        this.meshes.push(m);
    }

    tick(game,deltaTime){
        
        super.tick(game,deltaTime);
        var i = 0;
        this.meshes.forEach(m=>{
            this.meshMoveCounter[i]+=deltaTime;
            var xOffset = Math.sin(this.meshMoveCounter[i]);
            var yOffset = Math.cos(this.meshMoveCounter[i]);
            var zOffset = Math.sin(this.meshMoveCounter[i]+0.5);
            m.setRotationY(-game.gl.camera.currentRot);
            m.setPos(this.position.x+xOffset/14,this.position.y+0.1+yOffset/14,this.position.z+zOffset/14);
            if (i >1) m.scale[0] += yOffset/300;
            i++;
        })

        if (Math.random()< 0.05){
            var p = new Particle(game.gl,game.shaderProgram,game.glTexture,this.position.x,this.position.y+0.5,this.position.z,0.8,{x:MathUtil.getRandom(-0.2,0.2), y: Math.random()/1.5, z: MathUtil.getRandom(-0.2,0.2)},0.05,[0.01,0.01,0.01,1.0],MathUtil.getRandom(0.05,0.2));
            game.level.addParticle(p);
        }
        
    }

     render(gl){
        super.render(gl);

        this.meshes.forEach(m=>{
            m.render(gl,this.shaderprogram, this.glTexture);
        });


    }
}