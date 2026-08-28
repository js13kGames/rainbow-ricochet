import Game from "../game.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import MathUtil from "../mathutil.js";
import Bullet from "./bullet.js";
import Darkness from "./darkness.js";

export default class Rainbow extends Bullet{
    constructor(x,y,z,direction,speed,alpha=0.8,pickup=false){
        super(x,y,z,direction,speed,null,true);
        this.texture = new Texture(Game.glTexture,63,0,1,1);
        this.inHand = true;
        this.inHandYOffset = 0;
        this.inHandXOffset = 0;
        this.pickup = pickup;

        let meshBuild = MeshBuilder.start(Game.gl,x,y,z,0.25);

        let light = 2;
        this.addBox(meshBuild,-0.5,0,-0.5,Game.rainbowColors[0],alpha,light);
        this.addBox(meshBuild,-1.0,0,-1.0,Game.rainbowColors[1],alpha,light);
        this.addBox(meshBuild,-1.5,0,-1.5,Game.rainbowColors[2],alpha,light);
        this.addBox(meshBuild,0,0,0,Game.rainbowColors[3],alpha,light);
        this.addBox(meshBuild,0.5,0,-0.5,Game.rainbowColors[4],alpha,light);
        this.addBox(meshBuild,1.0,0,-1.0,Game.rainbowColors[5],alpha,light);
        this.addBox(meshBuild,1.5,0,-1.5,Game.rainbowColors[6],alpha,light);

        this.mesh = MeshBuilder.build(meshBuild);
        this.mesh.setS(0.15);

        this.bounces = 0;
    
    }

    addBox(meshBuild,x,y,z,rgb,alpha,light){
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        MeshBuilder.left(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.right(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.front(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.back(this.texture.getUVs(),meshBuild,x,y,z,light,1,[r,g,b,alpha],null);
        MeshBuilder.top(this.texture.getUVs(),meshBuild,x,y,z,light,[r,g,b,alpha],null);
        MeshBuilder.bottom(this.texture.getUVs(),meshBuild,x,y,z,light,[r,g,b,alpha],null);
    }

    onStructureHit(game, pos){
        if (this.pickup) return;
        game.playWallHit();
        this.bounces++;
        this.explode(game,0.01);
    }


    tick(game,deltaTime){
        super.tick(game,deltaTime);
        this.mesh.setRotationY(this.mesh.rotY+(5*deltaTime));
        if (this.pickup){
            this.mesh.setS(0.30);
            this.mesh.setRotationX(this.mesh.rotX+(2*deltaTime));
            this.move(0,0,0);
            return;
        };
        if (this.bounces > 4){
            this.ignoreCollisions = true;
            this.direction = {x: this.position.x - game.player.position.x, y: this.position.y - game.player.position.y, z: this.position.z - game.player.position.z};
            MathUtil.normalize(this.direction);
            this.position.y = game.player.position.y+0.9;
        }
    }

    onEntityHit(game,entity){
        super.onEntityHit(game,entity);
        if (entity instanceof Darkness) this.bounces++;
        console.log(this.bounces);
    }

    render(){
        super.render();
        this.mesh.render();
    }

    renderinHand(){
        this.mesh.setS(0.2);
        this.mesh.setPos(1.1+this.inHandXOffset,-0.55+this.inHandYOffset,-1);
        this.mesh.setRotationX(-0.1);
        this.mesh.setRotationY(-1.2+(this.inHandXOffset));
        Game.gl.enable(Game.gl.BLEND)
        Game.gl.disable(Game.gl.DEPTH_TEST);
        this.mesh.render(Game.uiCamera);
        Game.gl.enable(Game.gl.DEPTH_TEST);
        Game.gl.disable(Game.gl.BLEND);
    }
}