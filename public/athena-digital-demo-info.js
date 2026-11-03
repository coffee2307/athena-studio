/* Athena preview overlay for Digital Creators' standalone Vite build.
 * This does not touch the independent club's React app or navigation.
 */
(function(){
  if(window.self!==window.top || new URLSearchParams(window.location.search).get("embed")==="1")return;
  const key="athena-demo-info:digital-creators";
  const host=document.createElement("aside");
  host.className="athena-demo-float";
  host.dataset.athenaDemoInfo="digital-creators";
  host.setAttribute("aria-label","Thông tin mẫu Digital Creators");
  const inquiry="/contact?service=web-development&template=digital-creators";
  function setExpanded(expanded){
    try{window.sessionStorage.setItem(key,expanded?"expanded":"collapsed");}catch{}
    host.className="athena-demo-float "+(expanded?"is-expanded":"is-collapsed");
    if(expanded){
      host.innerHTML='<div id="athena-dc-float-panel" class="athena-demo-float-panel">'+
        '<div class="athena-demo-float-header"><span>ATHENA / WEBSITE DEMO</span>'+
        '<button type="button" class="athena-demo-float-toggle" aria-label="Thu gọn thông tin mẫu thành dấu ba chấm" aria-expanded="true" aria-controls="athena-dc-float-panel" title="Thu gọn">•••</button></div>'+
        '<p class="athena-demo-float-brand">DIGITAL CREATORS</p>'+
        '<h2>Digital Creators — Không gian sáng tạo số</h2>'+
        '<p class="athena-demo-float-category">Sáng tạo &amp; giáo dục · Immersive 3D</p>'+
        '<div class="athena-demo-float-price"><span>Chi phí dự kiến</span><strong>Theo phạm vi tùy biến</strong></div>'+
        '<div class="athena-demo-float-links"><a href="'+inquiry+'">Tùy biến mẫu này <span aria-hidden="true">↗</span></a>'+
        '<a href="/services/web-development/templates">Thư viện mẫu</a></div>'+
        '<p class="athena-demo-float-note">Bản trình diễn · Chưa phải báo giá chính thức</p></div>';
    }else{
      host.innerHTML='<button type="button" class="athena-demo-float-handle" aria-label="Mở thông tin mẫu Digital Creators" aria-expanded="false" title="Thông tin mẫu">•••</button>';
    }
    host.querySelector("button")?.addEventListener("click",()=>setExpanded(!expanded));
  }
  function mount(){
    let expanded=true;
    try{expanded=window.sessionStorage.getItem(key)!=="collapsed";}catch{}
    document.body.appendChild(host);
    setExpanded(expanded);
    document.addEventListener("keydown",(event)=>{
      if(event.key==="Escape"&&host.classList.contains("is-expanded"))setExpanded(false);
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
})();
