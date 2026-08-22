import DoorBlock from "./doorblock.js";
import Floor from "./floor.js";
import Glassblock from "./glassblock.js";
import Wall from "./wall.js";

export default class Structures{
    static wall;
    static floor;
    static floor1;
    static floor2;
    static floor3;
    static floor4;
    static glassBlock;
    static doorBlock;

    constructor(glTexture){
        Structures.wall = new Wall(glTexture,[0.5,0.5,0.8,1.0]);
        Structures.floor = new Floor(glTexture,[0.5,0.5,0.7,1.0],0);
        Structures.floor1 = new Floor(glTexture,[0.5,0.5,0.7,1.0],0.75);
        Structures.floor2 = new Floor(glTexture,[0.5,0.5,0.7,1.0],1.25);
        Structures.floor3 = new Floor(glTexture,[0.5,0.5,0.7,1.0],1.75);
        Structures.floor4 = new Floor(glTexture,[0.5,0.5,0.7,1.0],2.25);
        Structures.glassBlock = new Glassblock(glTexture,[0.4,0.4,1.0,1.0]);
        Structures.doorBlock = new DoorBlock();
    }
}