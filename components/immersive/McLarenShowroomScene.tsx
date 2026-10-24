"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";
import type {WorldSceneProps} from "./WorldScene";

const MODEL_PATH="/models/mclaren-ultimate-vision-gt.glb";
type SceneState="loading"|"ready"|"fallback";
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

function makeStage(){
 const stage=new THREE.Group();
 // Black brushed-metal display platform, low draw-call budget.
 const platform=new THREE.Mesh(
  new THREE.CylinderGeometry(3.25,3.31,.075,96),
  new THREE.MeshPhysicalMaterial({color:0x0a1018,metalness:.62,roughness:.27,clearcoat:.45})
 );
 platform.position.y=-.07;
 stage.add(platform);
 const ring=new THREE.Mesh(
  new THREE.TorusGeometry(3.20,.016,8,128),
  new THREE.MeshBasicMaterial({color:0xf0802b,toneMapped:false})
 );
 ring.rotation.x=Math.PI/2;ring.position.y=-.023;
 stage.add(ring);
 const outerRing=new THREE.Mesh(
  new THREE.TorusGeometry(3.47,.009,6,128),
  new THREE.MeshBasicMaterial({color:0x516277,toneMapped:false})
 );
 outerRing.rotation.x=Math.PI/2;outerRing.position.y=-.087;stage.add(outerRing);

 // Single subtle contact shadow, not an expensive real-time shadow pass.
 const shadowCanvas=document.createElement("canvas");
 shadowCanvas.width=128;shadowCanvas.height=128;
 const ctx=shadowCanvas.getContext("2d");
 if(ctx){
  const grad=ctx.createRadialGradient(64,64,8,64,64,64);
  grad.addColorStop(0,"rgba(0,0,0,.74)");
  grad.addColorStop(.57,"rgba(0,0,0,.40)");
  grad.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
 }
 const tex=new THREE.CanvasTexture(shadowCanvas);
 const contact=new THREE.Mesh(
  new THREE.PlaneGeometry(4.8,2.8),
  new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.7,depthWrite:false})
 );
 contact.rotation.x=-Math.PI/2;contact.position.y=.015;stage.add(contact);
 return {stage,tex};
}

function tuneMaterials(model:THREE.Object3D){
 model.traverse(child=>{
  if(!(child instanceof THREE.Mesh))return;
  child.castShadow=false;child.receiveShadow=false;
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const mat of materials){
   if(!(mat instanceof THREE.MeshStandardMaterial))continue;
   const n=(mat.name||"").toLowerCase();
   // Preserve textures and original livery; only adjust physical lighting.
   if(/^body_[12]$/.test(n)||n==="body_1"||n==="body_2"){
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.metalness=.54;
     mat.roughness=.24;
     mat.clearcoat=.95;
     mat.clearcoatRoughness=.085;
     mat.envMapIntensity=1.8;
     mat.needsUpdate=true;
    }else{
     mat.metalness=.48;mat.roughness=.25;mat.envMapIntensity=1.6;
    }
   }else if(n.includes("carbon")){
    mat.metalness=.36;mat.roughness=.29;mat.envMapIntensity=1.0;
   }else if(n.includes("glass")){
    mat.metalness=.18;mat.roughness=.12;mat.envMapIntensity=1.65;
   }else if(n.includes("headlight")||n.includes("rear_light")){
    if(mat instanceof THREE.MeshPhysicalMaterial)mat.clearcoat=1;
    mat.emissiveIntensity=Math.max(mat.emissiveIntensity,.85);
   }else if(n.includes("wheel")||n.includes("rims")){
    mat.metalness=.72;mat.roughness=.30;mat.envMapIntensity=1.28;
   }
  }
 });
}

/**
 * A self-hosted, compressed McLaren Ultimate Vision GT model.
 * Interactive lighting is physically based, with ACES tonemapping and a
 * procedural PMREM studio. It deliberately renders on demand, not at 60 FPS
 * while idle, and keeps the editorial photo as a graceful WebGL fallback.
 */
export function McLarenShowroomScene({preset,enabled=true,scrollRootId}:WorldSceneProps){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const modeRef=useRef(preset);
 const wakeRef=useRef<()=>void>(()=>{});
 const [status,setStatus]=useState<SceneState>("loading");
 modeRef.current=preset;
 useEffect(()=>{wakeRef.current();},[preset]);

 useEffect(()=>{
  const canvas=canvasRef.current;
  if(!canvas||!enabled)return;
  const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(motion.matches){setStatus("fallback");return;}

  let renderer:THREE.WebGLRenderer;
  try{
   renderer=new THREE.WebGLRenderer({
    canvas,alpha:false,antialias:!window.matchMedia("(max-width:760px)").matches,
    powerPreference:"low-power",preserveDrawingBuffer:false
   });
  }catch(error){
   console.warn("Athena McLaren: WebGL unavailable",error);
   setStatus("fallback");return;
  }
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.32;
  renderer.shadowMap.enabled=false;

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x070b12);
  const camera=new THREE.PerspectiveCamera(37,1,.1,85);
  const target=new THREE.Vector3(0,.73,0);
  camera.position.set(6.8,3.0,6.9);camera.lookAt(target);

  const ambient=new THREE.HemisphereLight(0xb4c8ed,0x29241d,1.5);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xfff3e4,3.6);
  key.position.set(-4.5,7,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff7c38,2.4);
  rim.position.set(4.5,3,-4.2);scene.add(rim);
  const cool=new THREE.DirectionalLight(0xa8cbff,2.2);
  cool.position.set(-3,2.5,-5.5);scene.add(cool);
  const floor=makeStage();
  scene.add(floor.stage);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const studio=new RoomEnvironment();
  const generated=pmrem.fromScene(studio,.04);
  studio.dispose();
  scene.environment=generated.texture;
  scene.environmentIntensity=1.35;

  const loader=new GLTFLoader();
  const draco=new DRACOLoader();
  draco.setDecoderPath("/draco/");
  draco.setDecoderConfig({type:"wasm"});
  loader.setDRACOLoader(draco);

  const car=new THREE.Group();
  scene.add(car);
  let loaded=false,disposed=false,model:THREE.Object3D|null=null;
  let request=0,visible=true,frameTime=0,drawn=false;
  let drag=false,previousX=0,turn=0,dragTurn=0;
  let currentMode=modeRef.current,currentProgress=0,goalProgress=0;
  const isMobile=window.matchMedia("(max-width:760px)").matches;
  const limit=isMobile?1000/24:1000/38;

  const schedule=()=>{
   if(!disposed&&loaded&&visible&&!document.hidden&&!request)request=requestAnimationFrame(draw);
  };
  wakeRef.current=schedule;

  const measureProgress=()=>{
   const el=scrollRootId?document.getElementById(scrollRootId):canvas;
   if(!el)return;
   const rect=el.getBoundingClientRect();
   goalProgress=clamp(-rect.top/Math.max(1,scrollRootId?rect.height-innerHeight:rect.height),0,1);
  };
  const resize=()=>{
   const rect=canvas.getBoundingClientRect();
   if(rect.width<5||rect.height<5)return;
   const pixelBudget=isMobile?220000:650000;
   const natural=Math.min(window.devicePixelRatio||1,isMobile?1:1.4);
   const fit=Math.min(1,Math.sqrt(pixelBudget/Math.max(1,rect.width*rect.height*natural*natural)));
   renderer.setPixelRatio(natural*fit);
   renderer.setSize(Math.round(rect.width),Math.round(rect.height),false);
   camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
  };
  function draw(now:number){
   request=0;
   if(disposed||!loaded||!visible||document.hidden)return;
   const elapsed=now-frameTime;
   if(elapsed<limit){schedule();return;}
   frameTime=now;
   const lerp=clamp(elapsed*.007,.07,.23);
   currentMode+= (modeRef.current-currentMode)*lerp;
   currentProgress+=(goalProgress-currentProgress)*lerp;
   turn+=(dragTurn-turn)*lerp;
   // Three cinematic camera presets; no model deformation or texture loss.
   const angle=[.72,2.0,4.9][Math.round(clamp(currentMode,0,2))];
   const orbit=angle+turn+currentProgress*.20;
   const dist=isMobile?10.6:8.3;
   const y=(isMobile?3.7:2.8)+currentProgress*.35;
   const wanted=new THREE.Vector3(Math.cos(orbit)*dist,y,Math.sin(orbit)*dist);
   camera.position.lerp(wanted,lerp);
   camera.lookAt(target);
   cool.intensity=2+currentMode*.26;
   rim.intensity=2.15+currentMode*.30;
   renderer.render(scene,camera);
   if(!drawn){drawn=true;setStatus("ready");}
   const movement=Math.abs(currentMode-modeRef.current)+Math.abs(currentProgress-goalProgress)+Math.abs(turn-dragTurn)+camera.position.distanceTo(wanted);
   if(movement>.006)schedule();
  }

  const pointerDown=(event:PointerEvent)=>{
   if(event.pointerType==="touch")return;
   drag=true;previousX=event.clientX;
   canvas.setPointerCapture(event.pointerId);
  };
  const pointerMove=(event:PointerEvent)=>{
   if(!drag)return;
   dragTurn+=clamp(event.clientX-previousX,-45,45)*.006;
   previousX=event.clientX;schedule();
  };
  const pointerUp=()=>{drag=false;};
  const onScroll=()=>{measureProgress();schedule();};
  const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(request);request=0;}else schedule();};
  const onLost=(event:Event)=>{event.preventDefault();setStatus("fallback");cancelAnimationFrame(request);request=0;visible=false;};
  const onMotion=()=>{if(motion.matches){setStatus("fallback");visible=false;cancelAnimationFrame(request);request=0;}};
  const intersection=new IntersectionObserver(entries=>{
   visible=entries.some(item=>item.isIntersecting);
   if(visible){measureProgress();schedule();}else{cancelAnimationFrame(request);request=0;}
  },{rootMargin:"30px"});
  const resizeObserver=new ResizeObserver(()=>{resize();schedule();});
  intersection.observe(canvas);resizeObserver.observe(canvas);
  window.addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("visibilitychange",onVisibility);
  canvas.addEventListener("webglcontextlost",onLost);
  canvas.addEventListener("pointerdown",pointerDown);
  canvas.addEventListener("pointermove",pointerMove);
  canvas.addEventListener("pointerup",pointerUp);
  canvas.addEventListener("pointercancel",pointerUp);
  motion.addEventListener("change",onMotion);

  // All Draco/WebP assets are served by Athena; no third-party runtime calls.
  loader.load(MODEL_PATH,gltf=>{
   if(disposed)return;
   model=gltf.scene;tuneMaterials(model);
   const bounds=new THREE.Box3().setFromObject(model);
   const dims=bounds.getSize(new THREE.Vector3());
   const center=bounds.getCenter(new THREE.Vector3());
   const scalar=4.9/Math.max(dims.x,dims.z,0.001);
   model.scale.multiplyScalar(scalar);
   model.position.set(-center.x*scalar,.07-bounds.min.y*scalar,-center.z*scalar);
   car.add(model);
   loaded=true;resize();measureProgress();schedule();
  },undefined,error=>{
   if(disposed)return;
   console.warn("Athena McLaren model unavailable:",error);
   setStatus("fallback");
  });

  const dispose=()=>{
   disposed=true;wakeRef.current=()=>{};
   cancelAnimationFrame(request);
   intersection.disconnect();resizeObserver.disconnect();
   window.removeEventListener("scroll",onScroll);
   document.removeEventListener("visibilitychange",onVisibility);
   canvas.removeEventListener("webglcontextlost",onLost);
   canvas.removeEventListener("pointerdown",pointerDown);
   canvas.removeEventListener("pointermove",pointerMove);
   canvas.removeEventListener("pointerup",pointerUp);
   canvas.removeEventListener("pointercancel",pointerUp);
   motion.removeEventListener("change",onMotion);
   // Avoid disposing glTF materials globally while a fetch is pending.
   if(model)model.traverse(obj=>{
    if(obj instanceof THREE.Mesh){
     obj.geometry.dispose();
     for(const m of (Array.isArray(obj.material)?obj.material:[obj.material])){
      if(!m)continue;
      for(const key of ["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap"] as const){
       const tex=m[key as keyof typeof m];
       if(tex instanceof THREE.Texture)tex.dispose();
      }
      m.dispose();
     }
    }
   });
   floor.stage.traverse(obj=>{
    if(obj instanceof THREE.Mesh){obj.geometry.dispose();(obj.material as THREE.Material).dispose();}
   });
   floor.tex.dispose();generated.texture.dispose();pmrem.dispose();draco.dispose();
   renderer.dispose();
  };
  return dispose;
 },[enabled,scrollRootId]);

 return <canvas ref={canvasRef}
  aria-hidden="true" data-scene-type="auto-showroom"
  data-renderer={status} data-geometry="gltf-draco-mclaren"
  className={"ix-3d-canvas ix-auto-3d-canvas"+(status==="ready"?" is-active":"")}
 />;
}
