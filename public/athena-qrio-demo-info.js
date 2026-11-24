/* Athena information card for the standalone Qrio demonstration.
   Lives outside Qrio's original interface and is not included in embedded previews. */
(function(){
  if(window.self!==window.top || new URLSearchParams(location.search).get("embed")==="1")return;
  const key="athena-demo-info:saas-product",id="athena-qrio-info-panel";
  const host=document.createElement("aside");
  host.className="athena-demo-float is-expanded";
  host.dataset.athenaDemoInfo="saas-product";
  host.setAttribute("aria-label","Thông tin bản mẫu Qrio");
  const lens=(out)=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/>'+(out?'':'<path d="M7.8 10.8h6M10.8 7.8v6"/>')+'</svg>';
  host.innerHTML='<div id="'+id+'" class="athena-demo-float-panel">'+
   '<div class="athena-demo-float-header"><span>ATHENA STUDIO · BẢN XEM TRƯỚC</span>'+
   '<button type="button" class="athena-demo-float-toggle" aria-label="Thu nhỏ thông tin mẫu" aria-controls="'+id+'" aria-expanded="true">'+lens(true)+'</button></div>'+
   '<p class="athena-demo-float-brand">SẢN PHẨM CÔNG NGHỆ</p>'+
   '<h2>Qrio</h2><p class="athena-demo-float-category">Website công cụ tạo mã QR · Trải nghiệm dùng thử</p>'+
   '<div class="athena-demo-float-price"><span>Chi phí dự kiến</span><strong>Theo phạm vi triển khai</strong></div>'+
   '<div class="athena-demo-float-links"><a href="/contact?service=web-development&template=saas-product">Tùy biến mẫu này</a>'+
   '<a href="/services/web-development/templates">Quay lại thư viện</a></div>'+
   '<p class="athena-demo-float-note">Bản demo Qrio · Không kết nối backend riêng tư</p></div>'+
   '<button type="button" class="athena-demo-float-handle" aria-label="Phóng to thông tin mẫu" aria-controls="'+id+'" aria-expanded="false">'+lens(false)+'</button>';
  const panel=host.querySelector(".athena-demo-float-panel");
  const minimize=host.querySelector(".athena-demo-float-toggle");
  const maximize=host.querySelector(".athena-demo-float-handle");
  function expand(open){
    host.classList.toggle("is-expanded",open);
    host.classList.toggle("is-collapsed",!open);
    panel.inert=!open;
    panel.setAttribute("aria-hidden",String(!open));
    minimize.setAttribute("aria-expanded",String(open));
    maximize.setAttribute("aria-expanded",String(open));
    maximize.setAttribute("aria-hidden",String(open));
    maximize.tabIndex=open?-1:0;
    try{sessionStorage.setItem(key,open?"expanded":"collapsed");}catch{}
  }
  const mount=()=>{
    document.body.appendChild(host);
    let start=true;try{start=sessionStorage.getItem(key)!=="collapsed"}catch{}
    expand(start);
    minimize.addEventListener("click",()=>expand(false));
    maximize.addEventListener("click",()=>expand(true));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&host.classList.contains("is-expanded"))expand(false)});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
})();