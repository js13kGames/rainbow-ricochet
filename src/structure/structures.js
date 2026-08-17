import Floor from "./floor.js";
import Lightblock from "./lightblock.js";
import Wall from "./wall.js";

export default class Structures{
    static wall;
    static floor;
    static lightBlock;

    constructor(glTexture){
        Structures.wall = new Wall(glTexture,[0.5,0.5,0.8,1.0]);
        Structures.floor = new Floor(glTexture,[0.5,0.5,0.7,1.0]);
        Structures.lightBlock = new Lightblock(glTexture,[0.4,0.4,1.0,0.7]);
    }
}