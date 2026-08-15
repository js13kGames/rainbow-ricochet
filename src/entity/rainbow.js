import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Weapon from "./weapon.js";

export default class Rainbow extends Weapon{
    constructor(gl,shaderprogram,glTexture,x,y,z,direction,speed){
        super(x,y,z,direction,speed);
        this.shaderprogram = shaderprogram;
        this.glTexture = glTexture;
        this.texture = new Texture(glTexture,63,0,1,1);

        let meshBuild = MeshBuilder.start(gl,x,y,z,0.25);

        let alpha = 0.8;
        let light = 2;
        this.addBox(meshBuild,-0.5,0,-0.5,1.0,0.8,0.1,alpha,light);
        this.addBox(meshBuild,-1.0,0,-1.0,1.0,0.5,0.0,alpha,light);
        this.addBox(meshBuild,-1.5,0,-1.5,1.0,0.1,0.1,alpha,light);
        this.addBox(meshBuild,0,0,0,0.0,0.8,0.4,alpha,light);
        this.addBox(meshBuild,0.5,0,-0.5,0.0,0.7,0.9,alpha,light);
        this.addBox(meshBuild,1.0,0,-1.0,0.0,0.3,0.5,alpha,light);
        this.addBox(meshBuild,1.5,0,-1.5,0.4,0.1,0.5,alpha,light);

        this.mesh = MeshBuilder.build(meshBuild);
        this.mesh.setS(0.15);

        this.counter = 0;
    
    }

    addBox(meshBuild,x,y,z,r,g,b,alpha,light){
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.top(this.texture.getUVs(),meshBuild,x,y,z,light,[r,g,b,alpha],null);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuild,x,y,z,light,[r,g,b,alpha],null);
    }

    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.counter += deltaTime;
        this.mesh.setRotationY(this.mesh.rotY+(5*deltaTime));
        //this.mesh.setRotationX(this.mesh.rotX+(1.0*deltaTime));
        this.mesh.setPos(this.position.x,this.position.y,this.position.z);
    }

    render(gl){
        super.render(gl);
        this.mesh.render(gl,this.shaderprogram, this.glTexture);
    }
}