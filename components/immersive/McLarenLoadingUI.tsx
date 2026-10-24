"use client";

type Props={
 progress?:number;
 phase?:string;
 slow?:boolean;
 failed?:boolean;
 onFallback?:()=>void;
};

/** Lightweight UI that does not import Three.js or initialize WebGL.
 * The editorial poster remains visible beneath this panel until the first frame. */
export function McLarenLoadingUI({
 progress=0,phase="Đang chuẩn bị không gian 3D",slow=false,failed=false,onFallback
}:Props){
 const value=Math.max(0,Math.min(99,Math.round(progress)));
 return <div className={"ix-car-load"+(failed?" is-failed":"")} data-model-loading={failed?"failed":"loading"} role="status" aria-live="polite">
  <div className="ix-car-load-head">
   <span>McLAREN / VISION GT</span><span>{failed?"ẢNH DỰ PHÒNG":String(value).padStart(2,"0")+"%"}</span>
  </div>
  <div className="ix-car-load-track" role="progressbar" aria-label="Tiến độ tải mô hình McLaren"
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={failed?0:value}>
   <span style={{transform:"scaleX("+value/100+")"}}/>
  </div>
  <p>{failed?"Không thể mở mô hình 3D trên thiết bị này. Ảnh xe vẫn có thể xem bình thường.":phase}</p>
  {slow&&!failed&&<small>Đang xử lý mô hình và các bề mặt phản chiếu. Bạn vẫn có thể xem ảnh hoặc chuyển trang.</small>}
  {onFallback&&<button type="button" onClick={onFallback}>Xem ảnh thay thế <span aria-hidden="true">↗</span></button>}
 </div>;
}
