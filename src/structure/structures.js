import DoorBlock from "./doorblock.js";
import Floor from "./floor.js";
import Glassblock from "./glassblock.js";
import Poision from "./poision.js";
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
    static poision;

    constructor(glTexture){
        Structures.wall = new Wall(glTexture);
        Structures.floor = new Floor(glTexture,0);
        for(var i=0;i<8;i++)Structures['floor'+(i+1)]=new Floor(glTexture,i/2+.75)
        Structures.glassBlock = new Glassblock(glTexture);
        Structures.doorBlock = new DoorBlock();
        Structures.poision = new Poision(glTexture);
    }
}