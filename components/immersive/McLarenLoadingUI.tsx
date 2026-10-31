"use client";

type Props={
 progress?:number;
 phase?:string;
 slow?:boolean;
 failed?:boolean;
 onFallback?:()=>void;
};

/** Lightweight UI that does not import Three.js or initialize WebGL.
 * A static studio backdrop stays available beneath the panel until the first frame. */
export function McLarenLoadingUI({
 progress=0,phase="Đang chuẩn bị không gian 3D",slow=false,failed=false,onFallback
}:Props){
 const value=Math.max(0,Math.min(99,Math.round(progress)));
 return <div className={"ix-car-load"+(failed?" is-failed":"")} data-model-loading={failed?"failed":"loading"} role="status" aria-live="polite">
  <div className="ix-car-load-head">
   <span>McLAREN / VISION GT</span><span>{failed?"CHẾ ĐỘ TĨNH":String(value).padStart(2,"0")+"%"}</span>
  </div>
  <div className="ix-car-load-track" role="progressbar" aria-label="Tiến độ tải mô hình McLaren"
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={failed?0:value}>
   <span style={{transform:"scaleX("+value/100+")"}}/>
  </div>
  <p>{failed?"Không thể mở mô hình 3D trên thiết bị này. Bạn vẫn có thể xem nội dung trên nền studio tĩnh.":phase}</p>
  {slow&&!failed&&<small>Đang xử lý mô hình và các bề mặt phản chiếu. Bạn vẫn có thể chuyển sang nền tĩnh hoặc xem trang khác.</small>}
  {onFallback&&<button type="button" onClick={onFallback}>Dùng nền tĩnh <span aria-hidden="true"></span></button>}
 </div>;
}
