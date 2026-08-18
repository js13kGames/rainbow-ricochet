export default class Camera{
    constructor(gl, x,y,z){
        this.gl = gl;
        this.position = {x,y,z};
        this.heightOverGround = y;
        this.currentRot = 0;
        this.currentRotX = 0;
    }

    //Increase the rotatation of the camera. Rotation is stored as radians
    rotate(rot){
        this.currentRot += rot;
        this.updateRotation();
    }

    //Increase the rotatation of the camera. Rotation is stored as radians
    rotateX(rot){
        if (this.currentRotX + rot < -1.2) return;
        if (this.currentRotX + rot > 1.2) return;
        this.currentRotX += rot;
        this.updateRotation();
    }

    // Set the rotation of the camera
    setRotation(rot){
        this.currentRot = rot * Math.PI / 180;
        this.updateRotation();
    }

    //Update the rotation
    updateRotation(){
        this.currentRot = this.currentRot%(Math.PI*2);
        this.currentRotX = this.currentRotX%(Math.PI*2);
    }

    //Get the rotation in degrees instead of radians
    getRotationDeg(){
        return this.currentRot* (180/Math.PI);
    }
    getRotationXDeg(){
        return this.currentRotX* (180/Math.PI);
    }

    //Set the position of the camera
    setPos(position){
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    }

    //Return the camera direction as a vector using Sin and Cos to calculate the vector based on the camera rotation in radians.
    getDirection(){
        return {x:Math.sin(this.currentRot)*Math.cos(this.currentRotX),y:-Math.sin(this.currentRotX),z:Math.cos(this.currentRot)*Math.cos(this.currentRotX)};
    }
}