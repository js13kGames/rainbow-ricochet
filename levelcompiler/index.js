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


let levelId = process.argv[2];
if (!levelId){
    console.log("Enter a levelId as first argument");
    return;
}

console.log("Building level " + levelId);

loadImage("level"+levelId+".png").then((image) => {
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
                if (c == 0x5c5c5e) addToLevel(level,x,y,"g"); // Glassblock
                if (c == 0x98ff98) addToLevel(level,x,y,"o"); // Poison


                if (c == 0x00ff00) addToLevel(level,x,y,"p"); // Player start position
                if (c == 0xffd700) addToLevel(level,x,y,"e"); // Level exit
                if (c == 0x0000ff) addToLevel(level,x,y,"m"); // Monster

                if (c == 0x007700) addToLevel(level,x,y,"x"); // Green door
                if (c == 0x00bb00) addToLevel(level,x,y,"u"); // Green key
                if (c == 0xdd6e93) addToLevel(level,x,y,"y"); // Blue door
                if (c == 0xe03971) addToLevel(level,x,y,"v"); // Blue key
                if (c == 0x6eddc8) addToLevel(level,x,y,"z"); // Yellow door
                if (c == 0x4aaaaa) addToLevel(level,x,y,"w"); // Yellow key
                if (c == 0x777777) addToLevel(level,x,y,"t"); // Secret door

                if (c == 0x00bdff) addToLevel(level,x,y,"h"); // Unicorn horn
                if (c == 0x7dddff) addToLevel(level,x,y,"r"); // Rainbow
                if (c == 0x9d9dff) addToLevel(level,x,y,"s"); // Health     
                // Height floor

                if (c == 0xff5555) addToLevel(level,x,y,"1");
                if (c == 0xff6666) addToLevel(level,x,y,"2");
                if (c == 0xff7777) addToLevel(level,x,y,"3");
                if (c == 0xff8888) addToLevel(level,x,y,"4");
                if (c == 0xff9999) addToLevel(level,x,y,"5");
                if (c == 0xffaaaa) addToLevel(level,x,y,"6");
                if (c == 0xffbbbb) addToLevel(level,x,y,"7");
                if (c == 0xffcccc) addToLevel(level,x,y,"8");

            }
        }
    
        saveLevel("../src/l"+levelId+".js",getLevelString(level,levelId));
        //saveLevel("../src/m.js",getMetadataString(metaData));
});

// Save the metadata and level data to a text file that will be used in the game.
function saveLevel(filename, data){
    fs = require('fs');
    fs.writeFile(filename, data, "ascii", function (err) {
        if (err) return console.log(err);
        console.log("saved successfully: "+filename);
      });   
}

function addToLevel(level,x,y,data){
    console.log(x+ " "+y+" "+data);
    level[x + (y*width)] = data;
}

function getLevelString(level,levelId){
    let txt = "const l"+levelId+"=\"";
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

