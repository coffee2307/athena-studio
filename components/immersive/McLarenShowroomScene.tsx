"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";
import type {WorldSceneProps} from "./WorldScene";
import {McLarenLoadingUI} from "./McLarenLoadingUI";

const MODEL_PATH="/models/mclaren.glb";
type SceneState="loading"|"ready"|"fallback";
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

function makeStage(){
 const stage=new THREE.Group();
 // A nearly-black seamless studio ground instead of a lit grey plane or toy podium.
 // One simple receiver and a very small procedural contact shadow; no SSR pass.
 const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(24,24),
  new THREE.MeshBasicMaterial({color:0x101318,toneMapped:false})
 );
 ground.rotation.x=-Math.PI/2;
 ground.position.y=-.06;
 stage.add(ground);

 const canvas=document.createElement("canvas");
 canvas.width=128;canvas.height=128;
 const ctx=canvas.getContext("2d");
 if(ctx){
  const gradient=ctx.createRadialGradient(64,64,4,64,64,64);
  gradient.addColorStop(0,"rgba(0,0,0,.8)");
  gradient.addColorStop(.55,"rgba(0,0,0,.35)");
  gradient.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 }
 const tex=new THREE.CanvasTexture(canvas);
 const shadow=new THREE.Mesh(
  new THREE.PlaneGeometry(5.7,3.5),
  new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.85,depthWrite:false})
 );
 shadow.rotation.x=-Math.PI/2;
 shadow.position.y=-.045;
 stage.add(shadow);
 return {stage,tex};
}

function tuneMaterials(model:THREE.Object3D){
 // Do not repaint the user-supplied vehicle: retain original material color,
 // texture maps, roughness, metallic factor and glTF clearcoat settings.
 model.traverse(child=>{
  if(!(child instanceof THREE.Mesh))return;
  child.castShadow=false;
  child.receiveShadow=false;
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const mat of materials){
   if(!(mat instanceof THREE.MeshStandardMaterial))continue;
   // Black paint needs broad studio reflections to retain a readable silhouette.
   // Leave baseColor, metalness, roughness and clearcoat from the GLB untouched.
   mat.envMapIntensity=Math.max(1.35,Math.min((mat.envMapIntensity??1)*1.65,2));
  }
 });
}

/**
 * A self-hosted McLaren GLB model with WebP textures.
 * Interactive lighting is physically based, with ACES tonemapping and a
 * procedural PMREM studio. It deliberately renders on demand, not at 60 FPS
 * while idle, and keeps the editorial photo as a graceful WebGL fallback.
 */
export function McLarenShowroomScene({preset,enabled=true,scrollRootId,onRequestFallback,zoom=0}:WorldSceneProps){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const modeRef=useRef(preset);
 const zoomRef=useRef(zoom);
 const wakeRef=useRef<()=>void>(()=>{});
 const [status,setStatus]=useState<SceneState>("loading");
 const [percent,setPercent]=useState(0);
 const [phase,setPhase]=useState("Đang chuẩn bị bộ dựng 3D");
 const [slow,setSlow]=useState(false);
 modeRef.current=preset;
 zoomRef.current=zoom;
 useEffect(()=>{wakeRef.current();},[preset,zoom]);

 useEffect(()=>{
  const canvas=canvasRef.current;
  if(!canvas||!enabled)return;
  const slowTimer=window.setTimeout(()=>setSlow(true),8500);
  const finishLoading=()=>window.clearTimeout(slowTimer);
  const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(motion.matches){setStatus("fallback");finishLoading();return;}
  const isMobile=window.matchMedia("(max-width:760px)").matches;

  let renderer:THREE.WebGLRenderer;
  try{
   renderer=new THREE.WebGLRenderer({
    canvas,alpha:false,antialias:!isMobile,
    powerPreference:isMobile?"low-power":"high-performance",preserveDrawingBuffer:false
   });
  }catch(error){
   console.warn("Athena McLaren: WebGL unavailable",error);
   setStatus("fallback");finishLoading();return;
  }
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.32;
  renderer.shadowMap.enabled=false;
  // Chromium can expose a WebGL 2 context backed by a CPU rasterizer. Such a
  // context is functional, but repeatedly easing the camera queues expensive
  // GPU work and can make the surrounding DOM controls unresponsive.
  const gl=renderer.getContext();
  const rendererInfo=gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName=String(rendererInfo?gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
  const softwareRenderer=/swiftshader|llvmpipe|softpipe|software|lavapipe/i.test(rendererName);

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x11151a);
  const camera=new THREE.PerspectiveCamera(34,1,.1,85);
  const target=new THREE.Vector3(scrollRootId&&!isMobile?-.28:0,.68,0);
  camera.position.set(5.6,2.5,5.8);camera.lookAt(target);

  const ambient=new THREE.HemisphereLight(0xf5f6fa,0x30343a,1.45);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,3.9);
  key.position.set(-4.5,7,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff8037,2.25);
  rim.position.set(4.5,3,-4.2);scene.add(rim);
  const cool=new THREE.DirectionalLight(0xe0ebff,2.1);
  cool.position.set(-3,2.5,-5.5);scene.add(cool);
  const floor=makeStage();
  scene.add(floor.stage);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const studio=new RoomEnvironment();
  const generated=pmrem.fromScene(studio,.04);
  studio.dispose();
  scene.environment=generated.texture;
  scene.environmentIntensity=1.55;

  // A GLTFLoader can finish with a "ready" scene even when individual
  // embedded WebP textures failed. Track those failures explicitly.
  let assetErrors=0;
  const manager=new THREE.LoadingManager();
  manager.onError=url=>{
   assetErrors+=1;
   console.warn("Athena McLaren asset failed:",url.startsWith("blob:")?"embedded texture":url);
  };
  const loader=new GLTFLoader(manager);

  const car=new THREE.Group();
  scene.add(car);
  let loaded=false,disposed=false,model:THREE.Object3D|null=null;
  let request=0,visible=true,frameTime=0,drawn=false;
  let expensiveFrames=0,preferImmediateCamera=softwareRenderer;
  let queuedContinuation=false;
  let drag=false,previousX=0,turn=0,dragTurn=0;
  let currentMode=modeRef.current,currentProgress=0,goalProgress=0;
  // Desktop renders on every requested RAF during active interaction, not at an
  // artificial 38 FPS ceiling. Mobile retains a 30 FPS cap and pixel budget.
  // Offscreen/idle rendering remains stopped by schedule()/IntersectionObserver.
  const limit=isMobile?30:softwareRenderer?100:0;
  // The former 650k desktop pixel ceiling rendered a 1440x900 chapter below
  // native 1x resolution. Preserve sharp geometry on a capable GPU; on a
  // software renderer retain the bounded compatibility tier used by CI.
  let renderBudget=softwareRenderer?(isMobile?140000:240000):isMobile?1250000:3200000;

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
   const natural=Math.min(window.devicePixelRatio||1,isMobile?1.7:2);
   const fit=Math.min(1,Math.sqrt(renderBudget/Math.max(1,rect.width*rect.height*natural*natural)));
   const effectiveDpr=natural*fit;
   renderer.setPixelRatio(effectiveDpr);
   renderer.setSize(Math.round(rect.width),Math.round(rect.height),false);
   canvas.dataset.renderDpr=effectiveDpr.toFixed(3);
   canvas.dataset.renderPixels=String(Math.round(rect.width*rect.height*effectiveDpr*effectiveDpr));
   canvas.dataset.renderQuality=softwareRenderer?"compatibility":"adaptive-high";
   camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
  };
  function draw(now:number){
   request=0;
   if(disposed||!loaded||!visible||document.hidden)return;
   const elapsed=now-frameTime;
   if(elapsed<limit){schedule();return;}
   // GPU submission can return quickly even when rasterization/compositing
   // stalls subsequent animation frames. Catch that signal as well as slow
   // synchronous renders, and finish each camera move without an easing loop.
   if(!preferImmediateCamera&&queuedContinuation&&elapsed>150){
    preferImmediateCamera=true;
    renderBudget=isMobile?180000:300000;
    resize();
   }
   queuedContinuation=false;
   frameTime=now;
   // A software WebGL renderer can spend hundreds of milliseconds on each
   // frame. Repeated camera easing would monopolize the main thread and
   // delay real controls, so settle camera moves in one frame after two
   // consecutive slow renders. Fast GPUs keep the cinematic easing.
   const lerp=preferImmediateCamera?1:clamp(elapsed*.007,.07,.23);
   // Scroll chapter camera is seekable: the current document position is the
   // sole source of truth, without a second trailing animation clock.
   currentMode=scrollRootId?modeRef.current:currentMode+(modeRef.current-currentMode)*lerp;
   currentProgress=scrollRootId?goalProgress:currentProgress+(goalProgress-currentProgress)*lerp;
   turn+=(dragTurn-turn)*lerp;
   const angles=[.72,2.0,4.9];
   // Five signed-off narrative keyframes, sampled directly from scroll progress.
   // Reversing the document scroll immediately produces the same camera pose.
   const journeyAngles=[.72,1.42,2.12,3.82,5.42];
   const journeyElevations=[2.35,1.98,2.48,2.18,2.55];
   const journeyDistances=[1,.93,.71,.88,1.04];
   const journeyX=[0,.55,-.12,-.44,0];
   const journeyZ=[0,-.2,.04,.18,0];
   const journeyYaw=[0,-.09,.06,.11,0];
   const position=clamp(currentProgress*4,0,4);
   const lower=Math.min(3,Math.floor(position));
   const fraction=position-lower;
   const smoothFraction=fraction*fraction*(3-2*fraction);
   const scrollOrbit=THREE.MathUtils.lerp(journeyAngles[lower],journeyAngles[lower+1],smoothFraction);
   const scrollHeight=THREE.MathUtils.lerp(journeyElevations[lower],journeyElevations[lower+1],smoothFraction);
   const scrollDistance=THREE.MathUtils.lerp(journeyDistances[lower],journeyDistances[lower+1],smoothFraction);
   if(scrollRootId){
    // A small, reversible glide accompanies the dolly. No fake wheel spin:
    // this GLB exposes no separately named wheel pivots.
    car.position.set(THREE.MathUtils.lerp(journeyX[lower],journeyX[lower+1],smoothFraction),0,
     THREE.MathUtils.lerp(journeyZ[lower],journeyZ[lower+1],smoothFraction));
    car.rotation.y=THREE.MathUtils.lerp(journeyYaw[lower],journeyYaw[lower+1],smoothFraction);
   }
   if(canvas){
    canvas.dataset.scrollProgress=currentProgress.toFixed(4);
    canvas.dataset.modelX=car.position.x.toFixed(4);
   }
   // Preset changes should travel between camera poses, not snap halfway.
   const modePosition=clamp(currentMode,0,2);
   const modeLower=Math.min(1,Math.floor(modePosition));
   const modeT=modePosition-modeLower;
   const easedMode=modeT*modeT*(3-2*modeT);
   const heroOrbit=angles[modeLower]+(angles[modeLower+1]-angles[modeLower])*easedMode;
   const orbit=(scrollRootId?scrollOrbit:heroOrbit+currentProgress*.20)+turn;
   const baseDistance=Math.max(6.75,6.75*.93/Math.max(.60,camera.aspect));
   const dist=baseDistance*(scrollRootId?scrollDistance:1)*(1-clamp(zoomRef.current,-1,2)*.09);
   const y=scrollRootId?scrollHeight:(isMobile?2.6:2.42);
   const wanted=new THREE.Vector3(Math.cos(orbit)*dist,y,Math.sin(orbit)*dist);
   if(scrollRootId)camera.position.copy(wanted);
   else camera.position.lerp(wanted,lerp);
   camera.lookAt(target);
   cool.intensity=1.18;
   rim.intensity=2.2;
   const renderStarted=performance.now();
   renderer.render(scene,camera);
   if(!preferImmediateCamera){
    expensiveFrames=performance.now()-renderStarted>120?expensiveFrames+1:0;
    if(expensiveFrames>=2){
     preferImmediateCamera=true;
     // Software WebGL can monopolize the main thread at the normal pixel
     // budget. Lower only slow renderers so buttons remain responsive, while
     // hardware-accelerated browsers retain the original full-resolution art.
     renderBudget=isMobile?220000:420000;
     resize();
    }
   }
   if(!drawn){drawn=true;finishLoading();setPercent(100);setStatus("ready");}
   const movement=Math.abs(currentMode-modeRef.current)+Math.abs(currentProgress-goalProgress)+Math.abs(turn-dragTurn)+camera.position.distanceTo(wanted);
   if(movement>.006){queuedContinuation=true;schedule();}
  }

  const pointerDown=(event:PointerEvent)=>{
   drag=true;previousX=event.clientX;
   canvas.setPointerCapture(event.pointerId);
  };
  const pointerMove=(event:PointerEvent)=>{
   if(!drag)return;
   dragTurn+=clamp(event.clientX-previousX,-45,45)*.006;
   previousX=event.clientX;schedule();
  };
  const pointerUp=()=>{drag=false;};
  const onScroll=()=>{
   measureProgress();
   // Scroll owns the narrative camera; manual drag is a temporary exploration
   // offset and must not alter the pose when scrolling back to the same p.
   if(scrollRootId){turn=0;dragTurn=0;}
   schedule();
  };
  const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(request);request=0;}else schedule();};
  const onLost=(event:Event)=>{event.preventDefault();finishLoading();setStatus("fallback");cancelAnimationFrame(request);request=0;visible=false;};
  const onMotion=()=>{if(motion.matches){finishLoading();setStatus("fallback");visible=false;cancelAnimationFrame(request);request=0;}};
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

  // The replacement GLB is self-hosted with WebP textures; no Draco decoder is needed.
  setPhase("Đang tải mô hình và vật liệu");
  loader.load(MODEL_PATH,gltf=>{
   if(disposed)return;
   if(assetErrors>0){
    finishLoading();
    console.warn("Athena McLaren: refusing an incomplete 3D render because embedded textures did not load.");
    setStatus("fallback");
    return;
   }
   setPercent(94);setPhase("Đang hoàn thiện ánh sáng và bề mặt sơn");
   model=gltf.scene;tuneMaterials(model);
   const bounds=new THREE.Box3().setFromObject(model);
   const dims=bounds.getSize(new THREE.Vector3());
   const center=bounds.getCenter(new THREE.Vector3());
   const scalar=4.35/Math.max(dims.x,dims.z,0.001);
   model.scale.multiplyScalar(scalar);
   model.position.set(-center.x*scalar,.07-bounds.min.y*scalar,-center.z*scalar);
   car.add(model);
   loaded=true;resize();measureProgress();schedule();
  },event=>{
   if(disposed||!event.total)return;
   const next=Math.min(90,Math.round(event.loaded/event.total*90));
   setPercent(previous=>next>=previous+3?next:previous);
   if(next>=87)setPhase("Đang xử lý hình học và texture");
  },error=>{
   if(disposed)return;
   console.warn("Athena McLaren model unavailable:",error);
   finishLoading();setStatus("fallback");
  });

  const dispose=()=>{
   disposed=true;finishLoading();wakeRef.current=()=>{};
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
   floor.tex.dispose();generated.texture.dispose();pmrem.dispose();
   renderer.dispose();
  };
  return dispose;
 },[enabled,scrollRootId]);

 return <>
  <canvas ref={canvasRef}
   aria-hidden="true" data-scene-type="auto-showroom"
   data-renderer={status} data-geometry="gltf-webp-mclaren"
   className={"ix-3d-canvas ix-auto-3d-canvas"+(status==="ready"?" is-active":"")}
  />
  {status!=="ready"&&
    <McLarenLoadingUI progress={percent} phase={phase} slow={slow}
      failed={status==="fallback"} onFallback={onRequestFallback}/>}
 </>;
}
