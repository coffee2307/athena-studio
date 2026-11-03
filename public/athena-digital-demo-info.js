/* Athena overlay for Digital Creators' standalone static Vite demo.
 * Native site React components, menus, 3D and CSS remain untouched.
 */
(function(){
  if(window.self!==window.top || new URLSearchParams(window.location.search).get("embed")==="1")return;
  const key="athena-demo-info:digital-creators";
  const host=document.createElement("aside");
  host.className="athena-demo-float is-expanded";
  host.dataset.athenaDemoInfo="digital-creators";
  host.setAttribute("aria-label","Thông tin mẫu Digital Creators");
  const inquiry="/contact?service=web-development&template=digital-creators";
  const lens=(out)=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/><path d="M7.8 10.8h6"/>'+(out?'':'<path d="M10.8 7.8v6"/>')+'</svg>';
  host.innerHTML='<div id="athena-dc-float-panel" class="athena-demo-float-panel">'+
   '<div class="athena-demo-float-header"><span>ATHENA / WEBSITE DEMO</span>'+
   '<button type="button" class="athena-demo-float-toggle" aria-label="Thu nhỏ bảng thông tin mẫu" aria-expanded="true" aria-controls="athena-dc-float-panel" title="Thu nhỏ">'+lens(true)+'</button></div>'+
   '<p class="athena-demo-float-brand">DIGITAL CREATORS</p>'+
   '<h2>Digital Creators — Không gian sáng tạo số</h2>'+
   '<p class="athena-demo-float-category">Sáng tạo &amp; giáo dục · Immersive 3D</p>'+
   '<div class="athena-demo-float-price"><span>Chi phí dự kiến</span><strong>Theo phạm vi tùy biến</strong></div>'+
   '<div class="athena-demo-float-links"><a href="'+inquiry+'">Tùy biến mẫu này <span aria-hidden="true">↗</span></a>'+
   '<a href="/services/web-development/templates">Thư viện mẫu</a></div>'+
   '<p class="athena-demo-float-note">Bản trình diễn · Chưa phải báo giá chính thức</p></div>'+
   '<button type="button" class="athena-demo-float-handle" aria-controls="athena-dc-float-panel" aria-expanded="true" aria-label="Phóng to thông tin mẫu Digital Creators" title="Phóng to thông tin mẫu">'+lens(false)+'</button>';
  const panel=host.querySelector(".athena-demo-float-panel");
  const closeButton=host.querySelector(".athena-demo-float-toggle");
  const openButton=host.querySelector(".athena-demo-float-handle");
  function setExpanded(expanded){
    try{window.sessionStorage.setItem(key,expanded?"expanded":"collapsed");}catch{}
    host.classList.toggle("is-expanded",expanded);
    host.classList.toggle("is-collapsed",!expanded);
    panel.inert=!expanded;
    panel.setAttribute("aria-hidden",String(!expanded));
    closeButton.setAttribute("aria-expanded",String(expanded));
    openButton.setAttribute("aria-expanded",String(expanded));
    openButton.setAttribute("aria-hidden",String(expanded));
    openButton.tabIndex=expanded?-1:0;
  }
  function mount(){
    document.body.appendChild(host);
    let expanded=true;
    try{expanded=window.sessionStorage.getItem(key)!=="collapsed";}catch{}
    setExpanded(expanded);
    closeButton.addEventListener("click",()=>setExpanded(false));
    openButton.addEventListener("click",()=>setExpanded(true));
    document.addEventListener("keydown",(event)=>{
      if(event.key==="Escape"&&host.classList.contains("is-expanded"))setExpanded(false);
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
})();
