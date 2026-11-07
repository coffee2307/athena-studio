/* Qrio frontend-only adapter for the Athena preview.
 * Browser-local QR generation; NEVER connects to private Flask/backend APIs.
 * Other Qrio business APIs deliberately return 503 so this demo can't create
 * tickets, orders, payments, uploads or contacts. */
(function(){
 "use strict";
 const realFetch=window.fetch.bind(window);
 const permitted=new Set(["/api/generate","/api/track-download","/api/file/upload"]);
 function json(payload,status=200){
  return new Response(JSON.stringify(payload),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
 }
 function normalizeColor(value,fallback){
  return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value):fallback;
 }
 async function localGenerate(body){
  if(typeof qrcode!=="function")return json({error:"Bộ mã hóa QR chưa sẵn sàng trong bản xem trước."},503);
  const form=body instanceof FormData?body:new FormData();
  const type=String(form.get("qr_type")||"").toLowerCase();
  if(type==="vietqr")return json({error:"VietQR cần kết nối API ngân hàng và không khả dụng trong bản demo Athena."},503);
  let content=String(form.get("data")||"https://qrio.site").trim();
  if(!content||new TextEncoder().encode(content).length>2400)return json({error:"Nội dung QR trống hoặc vượt quá giới hạn của bản trình diễn."},400);
  const correction=String(form.get("ecc_level")||"H");
  const ecc=/^[LMQH]$/.test(correction)?correction:"H";
  const color=normalizeColor(form.get("qr_color"),"#0c6c3b");
  const background=normalizeColor(form.get("bg_color"),"#ffffff");
  const dot=String(form.get("dot_type")||"square").toLowerCase();
  try{
   qrcode.stringToBytes=value=>Array.from(new TextEncoder().encode(value));
   const qr=qrcode(0,ecc);
   qr.addData(content,"Byte");
   qr.make();
   const modules=qr.getModuleCount();
   const quiet=4;const cell=Math.max(5,Math.min(15,Number(form.get("box_size"))||10));
   const side=(modules+quiet*2)*cell;
   const canvas=document.createElement("canvas");canvas.width=side;canvas.height=side;
   const ctx=canvas.getContext("2d",{alpha:false});if(!ctx)throw Error("Canvas unavailable");
   ctx.fillStyle=background;ctx.fillRect(0,0,side,side);ctx.fillStyle=color;
   for(let y=0;y<modules;y++)for(let x=0;x<modules;x++)if(qr.isDark(y,x)){
    const px=(x+quiet)*cell,py=(y+quiet)*cell;
    if(/circle|round/.test(dot)){
     const radius=dot.includes("circle")?cell*.41:cell*.25;
     if(dot.includes("circle")){ctx.beginPath();ctx.arc(px+cell/2,py+cell/2,radius,0,Math.PI*2);ctx.fill();}
     else{ctx.beginPath();ctx.roundRect(px+.1,py+.1,cell-.2,cell-.2,radius);ctx.fill();}
    }else ctx.fillRect(px,py,cell,cell);
   }
   return json({image:canvas.toDataURL("image/png")});
  }catch(err){
   return json({error:"Không thể tạo mã QR với nội dung này trên bản trình diễn."},400);
  }
 }
 window.fetch=async function(resource,options){
  let input;
  try{input=new URL(resource instanceof Request?resource.url:String(resource),location.href);}
  catch{return realFetch(resource,options);}
  if(input.origin!==location.origin)return realFetch(resource,options);
  if(input.pathname==="/api/generate")return localGenerate(options?.body??(resource instanceof Request?await resource.clone().formData():undefined));
  if(input.pathname==="/api/track-download")return json({status:"local-only"});
  if(input.pathname.startsWith("/api/")){
   return json({error:"Đây là bản xem trước giao diện Qrio. Chức năng máy chủ, tài khoản, vé, thanh toán và quản trị chưa được kết nối."},503);
  }
  return realFetch(resource,options);
 };
})();
