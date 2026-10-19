import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const root=path.resolve("public");
const source=path.join(root,"branding","logo-symbol-black.svg");
const raw=await readFile(source,"utf8");
// Preserve the exact supplied official owl vectors, adding only a circular white background.
const vector=raw.replace(/(<svg[^>]*>)/,"$1<circle cx=\"1000\" cy=\"1000\" r=\"1000\" fill=\"#ffffff\"/>");
await writeFile(path.join(root,"branding","favicon.svg"),vector,"utf8");
async function raster(size,filepath){
 const circle=Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ffffff"/></svg>`);
 const mark=await sharp(Buffer.from(raw)).resize(size,size).png().toBuffer();
 const png=await sharp({create:{width:size,height:size,channels:4,background:"#00000000"}}).composite([{input:circle},{input:mark}]).png().toBuffer();
 await writeFile(filepath,png);
 return png;
}
const p16=await raster(16,path.join(root,"favicon-16x16.png"));
const p32=await raster(32,path.join(root,"favicon-32x32.png"));
await raster(180,path.join(root,"apple-touch-icon.png"));
await raster(192,path.join(root,"android-chrome-192x192.png"));
await raster(512,path.join(root,"android-chrome-512x512.png"));
const header=Buffer.alloc(6);header.writeUInt16LE(0,0);header.writeUInt16LE(1,2);header.writeUInt16LE(2,4);
const e1=Buffer.alloc(16);e1[0]=16;e1[1]=16;e1.writeUInt16LE(1,4);e1.writeUInt16LE(32,6);e1.writeUInt32LE(p16.length,8);e1.writeUInt32LE(38,12);
const e2=Buffer.alloc(16);e2[0]=32;e2[1]=32;e2.writeUInt16LE(1,4);e2.writeUInt16LE(32,6);e2.writeUInt32LE(p32.length,8);e2.writeUInt32LE(38+p16.length,12);
await writeFile(path.join(root,"branding","favicon.ico"),Buffer.concat([header,e1,e2,p16,p32]));
console.log("Generated Athena owl SVG/PNG/ICO icons from",source);
