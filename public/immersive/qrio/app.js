"use strict";
(function(){
 const $=id=>document.getElementById(id);
 const params=new URLSearchParams(location.search);
 let language=params.get("lang")==="en"?"en":"vi";
 const translations={
 vi:{
  navStudio:"QR Studio",navSolutions:"Giải pháp",navAbout:"Về Qrio",navCreate:"Tạo QR ngay",
  heroLine1:"Một mã QR.",heroLine2:"Vô vàn",heroLine3:"khả năng.",
  heroDescription:"Thiết kế mã QR theo phong cách riêng. Tùy chỉnh màu sắc, xem trước tức thì và tải xuống ngay trong trình duyệt.",
  heroAction:"Bắt đầu thiết kế",heroExplore:"Khám phá Qrio",factOne:"QR tùy biến trực tiếp",factTwo:"Xem trước tức thì",factThree:"Tải xuống PNG / SVG",
  studioTitle:"Thiết kế mã QR<br><em>theo cách của bạn.</em>",
  studioIntro:"Một không gian làm việc thực tế: nhập nội dung, đổi màu và xuất QR sử dụng được. Không cần tài khoản.",
  editorTitle:"Tùy chỉnh QR",ready:"Sẵn sàng",inputLabel:"Đường dẫn hoặc nội dung",inputHint:"Có thể nhập đường dẫn, văn bản hoặc thông tin liên hệ ngắn.",colorCode:"Màu mã QR",colorBackground:"Màu nền",qrSize:"Kích thước xuất ảnh",errorLevel:"Mức sửa lỗi",generate:"Tạo mã QR",reset:"Mặc định",localPrivacy:"Dữ liệu được xử lý ngay trong trình duyệt. Không gửi tới máy chủ.",previewTitle:"Xem trước trực tiếp",live:"Trực tiếp",scanHint:"Dùng camera để quét mã QR",
  capabilitiesTitle:"Hơn cả một<br><em>mã QR.</em>",capabilitiesIntro:"Qrio còn được xây dựng cho những quy trình quản lý vé và kiểm soát lượt vào. Phần này giới thiệu năng lực của dự án gốc.",
  featureQrTitle:"Thiết kế tự do",featureQrBody:"Mã QR cho liên kết và nội dung, với tùy chỉnh màu sắc và xuất ảnh trực tiếp.",tryNow:"Thử ngay",featureTicketTitle:"Vé điện tử",featureTicketBody:"Dự án gốc có hệ thống tạo sự kiện, đặt vé và quản lý đơn hàng. Chưa kết nối vào bản demo này.",featureScanTitle:"Quét & kiểm soát",featureScanBody:"Hệ thống gốc hỗ trợ quét và xác thực vé. Bản giới thiệu không truy cập dữ liệu khách hàng.",sourceSystem:"Tính năng của hệ thống gốc",
  aboutTitle:"Một sản phẩm thật.<br>Một trải nghiệm rõ ràng.",aboutBody:"Đây là bản trình diễn độc lập do Athena xây dựng để giới thiệu Qrio. Công cụ tạo QR hoạt động trong trình duyệt; máy chủ, thanh toán, cơ sở dữ liệu và quản trị Qrio không được tích hợp vào bản công khai.",footerNote:"Bản trình diễn bởi Athena Studio · Không phải dịch vụ vé trực tuyến",backTop:"Lên đầu ↑",
  empty:"Hãy nhập nội dung để tạo mã QR.",generated:"Mã QR đã sẵn sàng để tải xuống.",invalid:"Nội dung quá dài hoặc không thể mã hóa.",contrast:"Lưu ý: độ tương phản thấp có thể khiến mã QR khó quét.",downloaded:"Đã tạo tệp tải xuống.",error:"Không thể tạo mã QR."},
 en:{
  navStudio:"QR Studio",navSolutions:"Solutions",navAbout:"About Qrio",navCreate:"Create a QR",
  heroLine1:"One QR code.",heroLine2:"Endless",heroLine3:"possibilities.",
  heroDescription:"Create your own distinctive QR code. Customize the colors, preview it instantly and download it without leaving your browser.",
  heroAction:"Start designing",heroExplore:"Explore Qrio",factOne:"Custom QR codes",factTwo:"Instant previews",factThree:"PNG / SVG downloads",
  studioTitle:"Design QR codes<br><em>your way.</em>",
  studioIntro:"A real interactive workspace: enter content, choose colors and export a usable QR code. No account needed.",
  editorTitle:"Customize QR",ready:"Ready",inputLabel:"Link or content",inputHint:"Enter a website, short message or contact information.",colorCode:"Code color",colorBackground:"Background color",qrSize:"Export size",errorLevel:"Error correction",generate:"Generate QR",reset:"Reset",localPrivacy:"Everything is processed in this browser. No data is sent to a server.",previewTitle:"Live preview",live:"Live",scanHint:"Use your camera to scan this code",
  capabilitiesTitle:"More than<br><em>a QR code.</em>",capabilitiesIntro:"The original Qrio project also provides ticket operations and check-in tools. This section introduces those capabilities.",
  featureQrTitle:"Designed your way",featureQrBody:"Generate QR codes for URLs and text, customize their colors and download instantly.",tryNow:"Try it now",featureTicketTitle:"Digital ticketing",featureTicketBody:"The original project provides event creation, ticket ordering and order management. Those backends are not connected in this showcase.",featureScanTitle:"Scan & verify",featureScanBody:"The original project includes ticket scanning and verification. This showcase cannot access customer information.",sourceSystem:"Original platform feature",
  aboutTitle:"A real product.<br>A focused experience.",aboutBody:"This is an independent showcase created by Athena Studio to introduce Qrio. QR generation runs entirely in your browser; the original Qrio backend, payments, database and admin tools are not included.",footerNote:"Showcase by Athena Studio · Not an online ticketing service",backTop:"Back to top ↑",
  empty:"Enter content to generate a QR code.",generated:"Your QR code is ready for download.",invalid:"Content is too long or cannot be encoded.",contrast:"Warning: low contrast may make the QR hard to scan.",downloaded:"The download file has been created.",error:"Failed to generate a QR code."}
 };
 let currentQr=null;
 const data=$("qr-data"),fg=$("foreground"),bg=$("background"),size=$("qr-size"),ecc=$("qr-ecc"),canvas=$("qr-canvas");
 const defaults={text:"https://example.com",foreground:"#8b5cf6",background:"#ffffff",size:"512",ecc:"M"};
 let debounce;
 function locale(){
  document.documentElement.lang=language;
  document.title=language==="en"?"Qrio — QR Studio | Athena Showcase":"Qrio — Công cụ tạo QR | Athena Showcase";
  $("language").firstChild.textContent=language.toUpperCase()+" ";
  for(const element of document.querySelectorAll("[data-i18n]")){
   const key=element.getAttribute("data-i18n"),translated=translations[language][key];if(!translated)continue;
   if(["studioTitle","capabilitiesTitle","aboutTitle"].includes(key))element.innerHTML=translated;
   else element.textContent=translated;
  }
  const url=new URL(location.href);url.searchParams.set("lang",language);
  history.replaceState(null,"",url.pathname+url.search+url.hash);
 }
 function feedback(message,error=false){
  const n=$("feedback");n.textContent=message;n.classList.toggle("error",error);
 }
 function contrast(c1,c2){
  const lum=c=>{const rgb=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  const a=lum(c1),b=lum(c2);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 }
 function draw(qr){
  const total=qr.getModuleCount(),output=Math.max(256,Math.min(1024,Number(size.value)));
  const edge=4,scale=output/(total+edge*2),ctx=canvas.getContext("2d",{alpha:false});
  canvas.width=output;canvas.height=output;ctx.fillStyle=bg.value;ctx.fillRect(0,0,output,output);ctx.fillStyle=fg.value;
  for(let row=0;row<total;row++)for(let col=0;col<total;col++)if(qr.isDark(row,col)){
   const x0=Math.round((col+edge)*scale),x1=Math.round((col+edge+1)*scale),y0=Math.round((row+edge)*scale),y1=Math.round((row+edge+1)*scale);
   ctx.fillRect(x0,y0,x1-x0,y1-y0);
  }
 }
 function svg(qr,output=256,foreground=fg.value,background=bg.value){
  const n=qr.getModuleCount(),edge=4,extent=n+edge*2,segments=[];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x))segments.push("M"+(x+edge)+" "+(y+edge)+"h1v1h-1z");
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+output+'" height="'+output+'" viewBox="0 0 '+extent+' '+extent+'"><rect width="'+extent+'" height="'+extent+'" fill="'+background+'"/><path fill="'+foreground+'" d="'+segments.join("")+'"/></svg>';
 }
 function generate(){
  const value=data.value.trim();
  $("foreground-code").value=fg.value.toUpperCase();
  $("background-code").value=bg.value.toUpperCase();
  $("qr-size-label").textContent=size.value+"px";
  if(!value){feedback(translations[language].empty,true);currentQr=null;return;}
  if(typeof qrcode!=="function"){feedback(translations[language].error,true);return;}
  try{
   qrcode.stringToBytes=s=>Array.from(new TextEncoder().encode(s));
   const qr=qrcode(0,ecc.value);qr.addData(value,"Byte");qr.make();
   currentQr=qr;draw(qr);$("hero-qr").innerHTML=svg(qr,240,"#6541bd","#ffffff");
   feedback(contrast(fg.value,bg.value)<4?translations[language].contrast:translations[language].generated,contrast(fg.value,bg.value)<4);
  }catch(error){console.error("Qrio demo QR generation:",error);feedback(translations[language].invalid,true);currentQr=null;}
 }
 function download(blob,name){
  if(!currentQr){feedback(translations[language].empty,true);return;}
  const url=URL.createObjectURL(blob),anchor=document.createElement("a");
  anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  feedback(translations[language].downloaded);
 }
 $("generate").addEventListener("click",generate);
 $("reset").addEventListener("click",()=>{
  data.value=defaults.text;fg.value=defaults.foreground;bg.value=defaults.background;size.value=defaults.size;ecc.value=defaults.ecc;generate();
 });
 for(const el of [data,fg,bg,size,ecc])el.addEventListener("input",()=>{clearTimeout(debounce);debounce=setTimeout(generate,130);});
 $("download-png").addEventListener("click",()=>{if(!currentQr)return;canvas.toBlob(blob=>{if(blob)download(blob,"qrio-code.png");},"image/png");});
 $("download-svg").addEventListener("click",()=>{if(currentQr)download(new Blob([svg(currentQr,Number(size.value))],{type:"image/svg+xml;charset=utf-8"}),"qrio-code.svg");});
 $("language").addEventListener("click",()=>{language=language==="vi"?"en":"vi";locale();generate();});
 locale();generate();
})();
