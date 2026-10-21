import sharp from "sharp";
import {readFile,writeFile} from "node:fs/promises";
const owl=await readFile("public/branding/logo-symbol-black.svg");
const emblem=await sharp(owl).resize(440,440).png().toBuffer();
const surface=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f7f7f5"/><rect width="1200" height="1" y="80" fill="#d0d0d0"/><rect width="1200" height="1" y="550" fill="#d0d0d0"/><text x="85" y="135" fill="#555" font-size="17" font-family="Arial, sans-serif" letter-spacing="3">STUDIO THIẾT KẾ &amp; CÔNG NGHỆ</text><text x="84" y="324" fill="#111" font-size="109" font-weight="700" font-family="Arial, sans-serif">ATHENA</text><text x="86" y="398" fill="#777" font-size="40" font-family="Arial, sans-serif">Nhìn xa. Kiến tạo khác biệt.</text><text x="85" y="589" fill="#555" font-size="15" font-family="Arial, sans-serif" letter-spacing="2">ATHENA STUDIO   /   VIỆT NAM</text><circle cx="963" cy="316" r="184" fill="#fff" stroke="#dedede"/></svg>`);
const result=await sharp(surface).composite([{input:emblem,left:743,top:96}]).png().toBuffer();
await writeFile("public/og-athena.png",result);
console.log("Created 1200×630 OG image:",result.length,"bytes");
