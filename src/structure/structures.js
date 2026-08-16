import Floor from "./floor.js";
import Wall from "./wall.js";

export default class Structures{
    static wall;
    static floor;

    constructor(glTexture){
        Structures.wall = new Wall(glTexture,[0.7,0.7,0.9,1.0]);
        Structures.floor = new Floor(glTexture,[0.5,0.8,0.9,1.0]);
    }
}