//A Webgl Texture which is a part of an texture atlas (x,y position of the atlas with a width and height)
export default class Texture{
    constructor(texture, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.dirty = true;
    }

    getUVs(){
        if(this.dirty){
            var u=this.x/64,v=this.y/64,U=this.width/64+u,V=this.height/64+v;
            this.uvs=[[u,V,0],[U,V,0],[U,v,0],[u,v,0]];
            this.dirty=0
        }
        return this.uvs
}

}