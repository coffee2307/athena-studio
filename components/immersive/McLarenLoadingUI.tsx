"use client";

type Props={progress?:number;phase?:string;slow?:boolean;failed?:boolean;onFallback?:()=>void;};

/** Loader visibility follows actual first WebGL frame, not a fabricated percent. */
export function McLarenLoadingUI({progress=0,slow=false,failed=false,onFallback}:Props){
 const value=Math.max(0,Math.min(99,Math.round(progress)));
 return <div className={"ix-car-load bv-load-spinner"+(failed?" is-failed":"")} data-model-loading={failed?"failed":"loading"} role="status" aria-live="polite" aria-atomic="true">
  {!failed?<><span className="bv-spinner-ring" aria-hidden="true"/><strong>Đang tải mô hình McLaren</strong><span className="bv-spinner-description">{slow?"Đang hoàn thiện vật liệu và ánh sáng 3D…":"Đang chuẩn bị trải nghiệm 3D…"}</span><span className="bv-spinner-a11y" role="progressbar" aria-label="Tiến độ tải mô hình McLaren" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}/></>:
  <><strong>Không thể hiển thị mô hình 3D</strong><p>Bạn có thể thử tải lại hoặc chuyển sang nền studio tĩnh.</p><div className="bv-spinner-actions"><button type="button" onClick={()=>window.location.reload()}>Thử lại</button>{onFallback&&<button type="button" onClick={onFallback}>Dùng nền tĩnh</button>}</div></>}
 </div>;
}
