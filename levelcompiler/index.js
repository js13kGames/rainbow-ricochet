#!/usr/bin/env node
//Compiles the level image to two text files. One with the leveltiles and the other one with metadata using the alpha value of the color.
//The resulting files will be 8kb but zip will compress them alot resulting in two files much smaller than using the png itself.
const { createCanvas, loadImage,ImageData } = require('canvas');
const width = 64;
const height = 64;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
canvas.imageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let level = new Array(width*height);
level.fill(" ");
let metaData = new Array(width*height);
metaData.fill(" ");

loadImage("level1.png").then((image) => {
    ctx.drawImage(image, 0, 0);
        //Draw the image and then loop over it
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                //console.log(x+" "+y);
                //Get the color of the pixel
                let c = new Uint32Array(ctx.getImageData(x, y, 1, 1).data.buffer);
                //Bit shift the color to extract just the alpha value
                let alpha = (c >>> 24 );
                //If we have an alpha value save it to the metadata values using the matching asciicode of the alpha value. Also substract 126 from the asciivalue to avoid using weird characters (had some issues with this)
                if (alpha != 0 && alpha < 255){
                    addToLevel(metaData,x,y,String.fromCharCode(126-(255-alpha)));
                    let b = 126-(255-alpha);
                }
                //Bitmask the color so we don't have to use the alpha value in the rest of the checks
                c = (c & 0x0FFFFFF);

                //Based on the color set an asciicharacter in the level textfile
                if (c == 0xffffff) addToLevel(level,x,y,"#"); // Wall 
                if (c == 0x00ffff) addToLevel(level,x,y,"l"); // Lightsource
                if (c == 0x00ff00) addToLevel(level,x,y,"p"); // Player start position

            }
        }
    
        saveLevel("../src/l.js",getLevelString(level));
        saveLevel("../src/m.js",getMetadataString(metaData));
});

// Save the metadata and level data to a text file that will be used in the game.
function saveLevel(filename, data){
    fs = require('fs');
    fs.writeFile(filename, data, "ascii", function (err) {
        if (err) return console.log(err);
        console.log("save successfully");
      });   
}

function addToLevel(level,x,y,data){
    console.log(x+ " "+y+" "+data);
    level[x + (y*width)] = data;
}

function getLevelString(level){
    let txt = "const l=\"";
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            txt += level[y + (x*height)];
        }
    }
    txt += "\";"
    return txt;
}

function getMetadataString(level){
    let txt = "const m=\"";
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            txt += level[y + (x*height)];
        }
    }
    txt += "\";"
    return txt;
}

