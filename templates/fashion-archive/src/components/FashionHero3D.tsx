"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import type * as THREE from "three";
import s from "./FashionHero3D.module.css";

const MODELS=[
 {id:"pose-floor",title:"THE SCULPTURAL POSE",caption:"Người mẫu ngồi — nghiên cứu hình thể",file:"pose-floor.glb"},
 {id:"flowers",title:"THE GARDEN STUDY",caption:"Người mẫu và hoa — nghiên cứu chuyển động",file:"flowers.glb"},
 {id:"squat",title:"THE QUIET FORM",caption:"Dáng ngồi thấp — nghiên cứu đường nét",file:"squat.glb"}
] as const;

type ThreeEngine={switchModel:(index:number)=>void;rotateBy:(deltaX:number)=>void;releaseDrag:()=>void;dispose:()=>void};
type Props={modelBase:string;collectionUrl:string};

export default function FashionHero3D({modelBase,collectionUrl}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);
 const host=useRef<HTMLDivElement>(null);
 const engine=useRef<ThreeEngine|null>(null);
 const activeRef=useRef(0);
 const pointerRef=useRef<{id:number;x:number}|null>(null);
 const [active,setActive]=useState(0);
 const [status,setStatus]=useState<"loading"|"ready"|"unavailable">("loading");


 useEffect(()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>{};
  update();
  reduce.addEventListener("change",update);
  return()=>reduce.removeEventListener("change",update);
 },[]);

 useEffect(()=>{
  if(!canvas.current||!host.current)return;
  let destroyed=false,renderer:THREE.WebGLRenderer|null=null,raf=0;
  let observer:IntersectionObserver|null=null,resize:ResizeObserver|null=null;
  let loaderDispose:(()=>void)|null=null;
  let isVisible=true,reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reduceQuery=window.matchMedia("(prefers-reduced-motion: reduce)");
  const onReduce=()=>{reduced=reduceQuery.matches;syncLoop()};
  const onVisibility=()=>syncLoop();
  let syncLoop=()=>{};
  const onContextLost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(raf);setStatus("unavailable")};
  canvas.current.addEventListener("webglcontextlost",onContextLost);
  const watchedCanvas=canvas.current;

  async function initialize(){
   const [T,loaderModule,dracoModule]=await Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js")
   ]);
   if(destroyed)return;
   const gl=new T.WebGLRenderer({canvas:watchedCanvas,alpha:true,antialias:true,powerPreference:"high-performance"});
   renderer=gl;
   gl.outputColorSpace=T.SRGBColorSpace;
   gl.toneMapping=T.ACESFilmicToneMapping;
   gl.toneMappingExposure=1.13;
   const scene=new T.Scene();
   const camera=new T.PerspectiveCamera(35,1,.01,120);
   // Z is the studio vertical, not the camera-facing roll axis.
   camera.up.set(0,0,1);
   camera.position.set(0,-6,1.05);
   camera.lookAt(0,0,0);
   scene.add(new T.HemisphereLight(0xffffff,0xa89a85,2.2));
   const key=new T.DirectionalLight(0xffffff,2.5);key.position.set(2,5,7);scene.add(key);
   const rim=new T.DirectionalLight(0xf0d4b6,1.5);rim.position.set(-5,-2,3);scene.add(rim);
   const pivot=new T.Group();scene.add(pivot);
   const draco=new dracoModule.DRACOLoader();
   draco.setDecoderPath(modelBase+"/draco/");
   draco.preload();
   const gltfLoader=new loaderModule.GLTFLoader();
   gltfLoader.setDRACOLoader(draco);
   const cache=new Map<number,{group:THREE.Group;radius:number}>();
   let requestId=0,frameBefore=0,currentRadius=1.8,objectLoaded=false;
   let dragging=false,freezeUntil=0;

   function fit(){
    const node=host.current;
    if(!node||destroyed)return;
    const width=Math.max(1,node.clientWidth),height=Math.max(1,node.clientHeight);
    gl.setPixelRatio(Math.min(window.devicePixelRatio||1,width<520?1.45:1.8));
    gl.setSize(width,height,false);
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
    const vfov=T.MathUtils.degToRad(camera.fov);
    const hfov=2*Math.atan(Math.tan(vfov/2)*camera.aspect);
    const distance=Math.max(4.5,currentRadius*1.24/Math.sin(Math.min(vfov,hfov)/2));
    camera.position.set(0,-distance,distance*.16);
    camera.lookAt(0,0,0);
    gl.render(scene,camera);
   }
   function disposeScene(group:THREE.Group){
    group.traverse(obj=>{const mesh=obj as THREE.Mesh;if(!mesh.isMesh)return;mesh.geometry?.dispose();
     const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
     for(const material of materials){if(!material)continue;for(const value of Object.values(material)){if(value&&typeof value==="object"&&"isTexture" in value){(value as THREE.Texture).dispose()}}material.dispose()}
    });
   }
   const render=(timestamp:number)=>{
    raf=0;
    if(destroyed||document.hidden||!isVisible)return;
    const dt=frameBefore?Math.min((timestamp-frameBefore)/1000,.05):0;
    frameBefore=timestamp;
    // Clockwise viewed from the Z+ end: negative world-Z yaw.
    if(!reduced&&objectLoaded&&!dragging&&timestamp>=freezeUntil){pivot.rotation.z-=dt*.28}
    if(host.current)host.current.dataset.rotation=pivot.rotation.z.toFixed(4);
    gl.render(scene,camera);
    if(!reduced)raf=requestAnimationFrame(render);
   };
   syncLoop=()=>{
    cancelAnimationFrame(raf);raf=0;frameBefore=0;
    if(!destroyed&&!document.hidden&&isVisible)raf=requestAnimationFrame(render);
   };
   function show(index:number){
    const serial=++requestId;
    setStatus("loading");
    function present(item:{group:THREE.Group;radius:number}){
     if(destroyed||serial!==requestId)return;
     while(pivot.children.length)pivot.remove(pivot.children[0]);
     pivot.add(item.group);currentRadius=item.radius;
     pivot.rotation.z=0;dragging=false;freezeUntil=0;objectLoaded=true;fit();setStatus("ready");syncLoop();
    }
    if(cache.has(index)){present(cache.get(index)!);return}
    gltfLoader.load(modelBase+"/"+MODELS[index].file,gltf=>{
     if(destroyed){disposeScene(gltf.scene);return}
     const group=new T.Group();
     const subject=gltf.scene;
     subject.updateMatrixWorld(true);
     const bounds=new T.Box3().setFromObject(subject);
     const size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
     const longest=Math.max(size.x,size.y,size.z);
     if(!isFinite(longest)||longest<=.001){setStatus("unavailable");return}
     subject.position.sub(center);
     // GLTF is Y-up. Orient it once into our Z-up showroom coordinate system.
     const orient=new T.Group();orient.rotation.x=Math.PI/2;orient.add(subject);
     group.add(orient);
     const scale=3.3/longest;group.scale.setScalar(scale);
     const radius=Math.max(.7,Math.hypot(size.x,size.y,size.z)*scale/2);
     cache.set(index,{group,radius});
     present({group,radius});
    },undefined,err=>{if(!destroyed&&serial===requestId){console.error("FASHION_MODEL_LOAD",MODELS[index].id,err);setStatus("unavailable")}});
   }
   engine.current={switchModel:show,rotateBy:(deltaX:number)=>{
    if(!objectLoaded)return;
    dragging=true;
    // Dragging right turns the model counterclockwise; dragging left turns it clockwise.
    pivot.rotation.z+=deltaX*.009;
    if(host.current)host.current.dataset.rotation=pivot.rotation.z.toFixed(4);
    gl.render(scene,camera);
   },releaseDrag:()=>{dragging=false;freezeUntil=performance.now()+1200;syncLoop()},dispose:()=>{}};
   observer=new IntersectionObserver(entries=>{isVisible=entries[0]?.isIntersecting??false;syncLoop()},{threshold:.01});
   if(host.current)observer.observe(host.current);
   resize=new ResizeObserver(fit);if(host.current)resize.observe(host.current);
   document.addEventListener("visibilitychange",onVisibility);
   reduceQuery.addEventListener("change",onReduce);
   loaderDispose=()=>{
    cancelAnimationFrame(raf);observer?.disconnect();resize?.disconnect();
    document.removeEventListener("visibilitychange",onVisibility);
    reduceQuery.removeEventListener("change",onReduce);
    draco.dispose();
    for(const entry of cache.values())disposeScene(entry.group);
    cache.clear();gl.dispose();gl.forceContextLoss();
   };
   fit();show(activeRef.current);
  }
  initialize().catch(error=>{if(!destroyed){console.error("FASHION_WEBGL_INIT",error);setStatus("unavailable")}});
  return()=>{
   destroyed=true;engine.current=null;cancelAnimationFrame(raf);
   loaderDispose?.();watchedCanvas.removeEventListener("webglcontextlost",onContextLost);
  };
 },[modelBase]);

 function finishDrag(){
  if(pointerRef.current)engine.current?.releaseDrag();
  pointerRef.current=null;
  if(host.current)host.current.dataset.dragging="false";
 }
 function onPointerDown(event:React.PointerEvent<HTMLDivElement>){
  if(event.pointerType==="mouse"&&event.button!==0)return;
  pointerRef.current={id:event.pointerId,x:event.clientX};
  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.dataset.dragging="true";
 }
 function onPointerMove(event:React.PointerEvent<HTMLDivElement>){
  const drag=pointerRef.current;
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x;
  drag.x=event.clientX;
  if(Math.abs(dx)>0){engine.current?.rotateBy(dx)}
 }
 function onPointerUp(event:React.PointerEvent<HTMLDivElement>){
  if(pointerRef.current?.id!==event.pointerId)return;
  if(event.currentTarget.hasPointerCapture(event.pointerId)){event.currentTarget.releasePointerCapture(event.pointerId)}
  finishDrag();
 }
 function onKeyDown(event:React.KeyboardEvent<HTMLDivElement>){
  if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
  event.preventDefault();
  engine.current?.rotateBy(event.key==="ArrowRight"?40:-40);
  engine.current?.releaseDrag();
 }
 function choose(index:number){
  if(index===active)return;
  activeRef.current=index;setActive(index);engine.current?.switchModel(index);
 }
 return <section className={s.hero} aria-labelledby="fashion-hero-title" data-fashion-3d-hero>
  <div className={s.heroGrid}>
   <div className={s.copy}>
    <div className={s.index}><span>ATELIER ARCHIVE</span><span>STUDY / 01—03</span></div>
    <h1 id="fashion-hero-title">FORM<br/><em>IN MOTION.</em></h1>
    <p>Khám phá hình thể, tỷ lệ và phom dáng qua ba nghiên cứu thời trang trong không gian 3D.</p>
    <div className={s.actions}><Link href={collectionUrl} className={s.primary}>KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true"></span></Link><a className={s.secondary} href="#fashion-collection">XEM CÁC LOOK <span aria-hidden="true">↓</span></a></div>
    <div className={s.edition}><span>THREE FIGURES</span><span>ONE MOVING GALLERY</span></div>
   </div>
   <div className={s.modelColumn}>
    <div className={s.modelStage} ref={host} role="group" tabIndex={0}
      aria-label="Mô hình 3D. Kéo ngang hoặc dùng mũi tên trái phải để xoay quanh trục đứng"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={finishDrag}
      onKeyDown={onKeyDown} data-dragging="false"
      data-model-state={status} data-active-model={MODELS[active].id}>
      <div className={s.stageBackdrop} aria-hidden="true"/>
      <canvas ref={canvas} className={s.canvas} aria-label={MODELS[active].caption} role="img"/>
      {status!=="ready"&&<div className={s.loading} role="status">{status==="loading"?"ĐANG DỰNG MÔ HÌNH 3D":"KHÔNG THỂ HIỂN THỊ 3D TRÊN THIẾT BỊ NÀY"}</div>}
      <span className={s.stageCorner}>STUDIO / 3D OBJECT</span>
      <span className={s.stageCounter}>0{active+1} / 03</span>
      <span className={s.dragHint}>KÉO NGANG ĐỂ XOAY 360°</span>
    </div>
    <div className={s.modelFooter}>
     <div className={s.modelText}><span>SCULPTURAL STUDIES / {MODELS[active].id.toUpperCase()}</span><strong>{MODELS[active].title}</strong><p>{MODELS[active].caption}</p></div>
     <div className={s.controls} role="group" aria-label="Chọn mô hình 3D">{MODELS.map((model,index)=><button type="button" key={model.id} onClick={()=>choose(index)} aria-label={`Mô hình ${index+1}: ${model.caption}`} aria-pressed={active===index} data-selected={active===index}><span/></button>)}</div>
    </div>
    <div className={s.attribution}><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Models: CC BY 4.0</a><a href="https://sketchfab.com/3d-models/woman-posing-sitting-on-the-floor-d2cb341b9ff44f04ac5cb92ad69a1161" target="_blank" rel="noopener noreferrer">Pose: ustunmesut0</a><a href="https://sketchfab.com/3d-models/woman-picking-flowers-low-poly-f39b34790d464ad7ae84f504413ffc60" target="_blank" rel="noopener noreferrer">Flowers: Fadly.W</a><a href="https://sketchfab.com/3d-models/graceful-squatting-female-2c75128e56224662a5f27d613dd0f505" target="_blank" rel="noopener noreferrer">Squatting: Fadly.W</a></div>
   </div>
  </div>
 </section>
}
