const messages=["THIẾT KẾ WEBSITE","WEBSITE CARE","TÍCH HỢP AI","TỰ ĐỘNG HÓA","SHOPIFY","SẢN PHẨM SỐ","TRẢI NGHIỆM KHÁCH HÀNG"];
export function ServiceTicker(){
 return <section className="athena-ticker" aria-label="Các lĩnh vực Athena hỗ trợ">
  <div className="athena-ticker-track" aria-hidden="true">
   {Array.from({length:4},(_,group)=><div className="athena-ticker-group" key={group}>
    {messages.map((item,i)=><span key={item}><span className="athena-ticker-symbol">{i%2===0?"✳":"↗"}</span>{item}</span>)}
   </div>)}
  </div>
 </section>;
}
