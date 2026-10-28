const MODEL_URL="https://sketchfab.com/3d-models/mclaren-p1-wwwvecarzcom-adae2edc721e4ce7b31c1d06a581e30a";
const LICENSE_URL="https://creativecommons.org/licenses/by/4.0/";

/** User-reported source for the self-hosted demo model. */
export function ModelAttribution({compact=false}:{compact?:boolean}){
 return <p className={compact?"ix-glb-credit ix-glb-credit-compact":"ix-glb-credit"}>
  {compact?"3D model: ":"Nguồn mô hình 3D được cung cấp: "}
  <a href="https://sketchfab.com/heynic" target="_blank" rel="noopener noreferrer">vecarz (@heynic)</a>
  {" · "}<a href={MODEL_URL} target="_blank" rel="noopener noreferrer">McLaren P1</a>
  {" · "}<a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
  {!compact&&". Bản trình diễn điều chỉnh ánh sáng và vật liệu hiển thị; VELAR không liên kết với McLaren Automotive hoặc tác giả mô hình."}
 </p>;
}
