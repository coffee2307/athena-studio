"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";
import type {WorldSceneProps} from "./WorldScene";
import {McLarenLoadingUI} from "./McLarenLoadingUI";
import {CHAPTER_YAWS,CHAPTER_ELEVATIONS,CHAPTER_DISTANCES,narrativeOrbit,wrapOrbit,nextScrollChapter,scrollTransition,clamp01,smooth} from "@/lib/showroom-orbit";

const MODEL_PATH="/models/mclaren.glb?v=20261029-p1-vecarz";
type SceneState="loading"|"ready"|"fallback";
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
// Never store accumulated revolutions. The camera only needs the signed
// orientation within one turn; otherwise scrolling can unwind three rotations.
// Chapter yaw state and shortest-path math live in lib/showroom-orbit.ts.

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

function tuneMaterials(model:THREE.Object3D,renderer:THREE.WebGLRenderer){
 // Keep the supplied color and texture maps intact; tame chrome-like carbon
 // reflections and sharpen sampled texture detail at oblique camera angles.
 const anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 model.traverse(child=>{
  if(!(child instanceof THREE.Mesh))return;
  child.castShadow=false;
  child.receiveShadow=false;
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const mat of materials){
   if(!(mat instanceof THREE.MeshStandardMaterial))continue;
   const blackBase=mat.color.r<.03&&mat.color.g<.03&&mat.color.b<.03;
   if(mat.name==="carbon_1"){
    // glTF defaults an omitted metallicFactor to 1. Carbon is not polished metal.
    mat.metalness=Math.min(mat.metalness,.18);
    mat.color.multiplyScalar(.55);
    mat.envMapIntensity=.3;
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.clearcoat=Math.min(mat.clearcoat,.32);
     mat.clearcoatRoughness=Math.max(mat.clearcoatRoughness,.38);
    }
   }else if(blackBase||mat.name==="plastic_gloss"){
    mat.metalness=Math.min(mat.metalness,.22);
    mat.envMapIntensity=.36;
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.clearcoat=Math.min(mat.clearcoat,.4);
     mat.clearcoatRoughness=Math.max(mat.clearcoatRoughness,.34);
    }
   }
   for(const texture of [mat.map,mat.normalMap,mat.roughnessMap,mat.metalnessMap,mat.aoMap]){
    if(!texture)continue;
    texture.anisotropy=anisotropy;
    texture.needsUpdate=true;
   }
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
  renderer.toneMappingExposure=1.02;
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
  // Orthographic mobile product stage: constant apparent size at every yaw.
  // No perspective dolly or per-frame zoom can be triggered by finger dragging.
  const camera=isMobile
   ?new THREE.OrthographicCamera(-2.85,2.85,3.2,-3.2,.1,85)
   :new THREE.PerspectiveCamera(34,1,.1,85);
  // Aim slightly left of the car on wide showroom screens so the model sits
  // to the right of the editorial headline. Other journeys keep their pose.
  const heroWide=scrollRootId==="bv-cinematic-track"&&!isMobile&&window.innerWidth>=1100;
  const target=new THREE.Vector3(0,.68,0);
  canvas.dataset.cameraTargetX=target.x.toFixed(2);
  camera.position.set(5.6,2.5,5.8);camera.lookAt(target);

  const ambient=new THREE.HemisphereLight(0xf5f6fa,0x30343a,.85);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,2.55);
  key.position.set(-4.5,7,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff8037,1.3);
  rim.position.set(4.5,3,-4.2);scene.add(rim);
  const cool=new THREE.DirectionalLight(0xe0ebff,1.15);
  cool.position.set(-3,2.5,-5.5);scene.add(cool);
  const floor=makeStage();
  scene.add(floor.stage);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const studio=new RoomEnvironment();
  const generated=pmrem.fromScene(studio,.04);
  studio.dispose();
  scene.environment=generated.texture;
  scene.environmentIntensity=.95;

  // A GLTFLoader can finish with a "ready" scene even when individual
  // embedded WebP textures failed. Track those failures explicitly.
  let assetErrors=0;
  const manager=new THREE.LoadingManager();
  manager.onError=url=>{
   assetErrors+=1;
   console.warn("Athena McLaren asset failed:",url.startsWith("blob:")?"embedded texture":url);
  };
  const loader=new GLTFLoader(manager);
  const draco=new DRACOLoader(manager);
  draco.setDecoderPath("/draco/");
  draco.setDecoderConfig({type:"wasm"});
  loader.setDRACOLoader(draco);

  const car=new THREE.Group();
  scene.add(car);
  // Cached local-space geometry bounds follow the car pivot at each camera pose.
  let frameCorners:THREE.Vector3[]=[];
  let loaded=false,disposed=false,model:THREE.Object3D|null=null;
  let request=0,visible=true,frameTime=0,drawn=false;
  let expensiveFrames=0,preferImmediateCamera=softwareRenderer;
  let queuedContinuation=false;
  let drag=false,dragPointer:number|null=null,previousX=0;
  let cameraYaw=.72,manualMode=false,manualRadius=0,manualHeight=0;
  let yawTransition:{start:number;end:number;startP:number;endP:number;direction:1|-1;radius:number;height:number;startedAt:number}|null=null;
  let currentMode=modeRef.current,currentProgress=0,goalProgress=0;
  // Desktop renders on every requested RAF during active interaction, not at an
  // artificial 38 FPS ceiling. Mobile retains a 30 FPS cap and pixel budget.
  // Offscreen/idle rendering remains stopped by schedule()/IntersectionObserver.
  const limit=isMobile?30:softwareRenderer?100:0;
  // The former 650k desktop pixel ceiling rendered a 1440x900 chapter below
  // native 1x resolution. Preserve sharp geometry on a capable GPU; on a
  // software renderer retain the bounded compatibility tier used by CI.
  let renderBudget=softwareRenderer?(isMobile?140000:240000):isMobile?1600000:4700000;

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
   if(camera instanceof THREE.PerspectiveCamera){
    camera.aspect=rect.width/rect.height;
    camera.filmOffset=heroWide?-4:0;
   }else{
    // Constant horizontal world-space framing across portrait phone sizes.
    const halfWidth=2.74,halfHeight=halfWidth*rect.height/rect.width;
    camera.left=-halfWidth;camera.right=halfWidth;
    camera.top=halfHeight;camera.bottom=-halfHeight;
   }
   camera.updateProjectionMatrix();
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
   // Follow the native scroll target with a short, frame-rate-independent
   // camera glide. Cap idle gaps so the first frame after a wheel event cannot
   // consume the entire transition. The initial frame starts at the true pose.
   const travelStep=Math.min(Math.max(elapsed,0),48);
   const scrollFollow=preferImmediateCamera?1:1-Math.exp(-travelStep/145);
   currentMode=scrollRootId?modeRef.current:currentMode+(modeRef.current-currentMode)*lerp;
   currentProgress=scrollRootId
    ?(drawn?currentProgress+(goalProgress-currentProgress)*scrollFollow:goalProgress)
    :currentProgress+(goalProgress-currentProgress)*lerp;
   if(Math.abs(goalProgress-currentProgress)<.0005)currentProgress=goalProgress;
   // Stable authored keyframes. Manual orbit is a separate camera state.
   const angles=[.72,2.0,4.9];
   // Five signed-off narrative keyframes, sampled directly from scroll progress.
   // Reversing scroll settles on the same pose once the glide catches up.
   const journeyElevations=CHAPTER_ELEVATIONS;
   const journeyDistances=CHAPTER_DISTANCES;
   const journeyX=[0,.12,-.08,-.12,0];
   const journeyZ=[0,-.08,.02,.08,0];
   const journeyYaw=[0,-.09,.06,.11,0];
   const position=clamp(currentProgress*4,0,4);
   const lower=Math.min(3,Math.floor(position));
   const fraction=position-lower;
   const smoothFraction=fraction*fraction*(3-2*fraction);
   const scrollOrbit=narrativeOrbit(currentProgress);
   const scrollHeight=THREE.MathUtils.lerp(journeyElevations[lower],journeyElevations[lower+1],smoothFraction);
   const scrollDistance=THREE.MathUtils.lerp(journeyDistances[lower],journeyDistances[lower+1],smoothFraction);
   if(scrollRootId){
    // A small, reversible glide accompanies the dolly. No fake wheel spin:
    // this GLB exposes no separately named wheel pivots.
    if(isMobile){
     // Mobile is a centered product stage, not the asymmetric desktop editorial rig.
     // Chapter direction is controlled by camera yaw only, never by the desktop
     // camera-track translation or mesh spin.
     car.position.set(0,0,0);
     car.rotation.y=0;
    }else{
     car.position.set(THREE.MathUtils.lerp(journeyX[lower],journeyX[lower+1],smoothFraction),0,
      THREE.MathUtils.lerp(journeyZ[lower],journeyZ[lower+1],smoothFraction));
     car.rotation.y=THREE.MathUtils.lerp(journeyYaw[lower],journeyYaw[lower+1],smoothFraction);
    }
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
   const baseDistance=isMobile?8:Math.max(8.2,10*.93/Math.max(.72,(camera as THREE.PerspectiveCamera).aspect));
   const authoredRadius=isMobile?baseDistance:baseDistance*(scrollRootId?scrollDistance:1)*(1-clamp(zoomRef.current,-1,2)*.09);
   let radius=authoredRadius;
   let height=scrollRootId?scrollHeight:(isMobile?2.6:2.42);
   if(scrollRootId){
    if(manualMode){
     radius=manualRadius;height=manualHeight;
    }else if(yawTransition){
     const tx=yawTransition;
     const phase=clamp01((currentProgress-tx.startP)/Math.max(.00001,Math.abs(tx.endP-tx.startP))*(tx.direction));
     // Prevent an oversized wheel delta from completing an orbit in one GPU frame.
     const fraction=smooth(Math.min(phase,clamp01((now-tx.startedAt)/420)));
     cameraYaw=scrollTransition(tx.start,tx.end,tx.startP,tx.endP,currentProgress);
     radius=THREE.MathUtils.lerp(tx.radius,authoredRadius,fraction);
     height=THREE.MathUtils.lerp(tx.height,scrollHeight,fraction);
     if(fraction>=.9999)yawTransition=null;
    }else cameraYaw=scrollOrbit;
   }else if(!manualMode)cameraYaw=wrapOrbit(heroOrbit+currentProgress*.20);
   const wanted=new THREE.Vector3(Math.cos(cameraYaw)*radius,height,Math.sin(cameraYaw)*radius);
   if(scrollRootId)camera.position.copy(wanted);
   else camera.position.lerp(wanted,lerp);
   camera.lookAt(target);
   // The camera radius is fixed during dragging. No per-frame auto-fit/dolly.
   if(canvas){
    canvas.dataset.cameraRadius=radius.toFixed(4);
    canvas.dataset.cameraYaw=cameraYaw.toFixed(5);
    canvas.dataset.cameraMode=manualMode?"manual":yawTransition?"transition":"scroll";
    canvas.dataset.cameraTargetYaw=scrollOrbit.toFixed(5);
   }
   // Projection is diagnostic, never a hidden second camera controller.
   if(frameCorners.length){
    // Optical framing is a MOBILE-ONLY lens correction. Reset on each frame
    // before projection so prior drag/scroll frames cannot accumulate offsets.
    if(isMobile&&camera instanceof THREE.OrthographicCamera){
     camera.projectionMatrix.elements[12]=0;
     camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }
    car.updateMatrixWorld(true);camera.updateMatrixWorld(true);
    let left=Infinity,right=-Infinity,bottom=Infinity,top=-Infinity;
    for(const corner of frameCorners){
     const p=corner.clone().applyMatrix4(car.matrixWorld).project(camera);
     left=Math.min(left,p.x);right=Math.max(right,p.x);
     bottom=Math.min(bottom,p.y);top=Math.max(top,p.y);
    }
    if(isMobile&&camera instanceof THREE.OrthographicCamera){
     // The GLB's actual projected bounds, not its origin or the desktop hero
     // alignment, define the visible horizontal midpoint on small screens.
     // Translation in the projection matrix does not affect orbit yaw/radius.
     const opticalCenter=(left+right)/2;
     camera.projectionMatrix.elements[12]=-opticalCenter;
     camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
     left-=opticalCenter;
     right-=opticalCenter;
    }
    const safeX=isMobile?.96:.90,safeTop=isMobile?.82:.87,safeBottom=isMobile?.80:.85;
    if(canvas){
     canvas.dataset.layoutRig=isMobile?"mobile-centered":"desktop-editorial";
     canvas.dataset.modelCenterX=((left+right)/2).toFixed(5);
     canvas.dataset.modelFrame=[left,right,bottom,top].map(v=>v.toFixed(4)).join(",");
     canvas.dataset.modelSafe=String(left>=-safeX&&right<=safeX&&bottom>=-safeBottom&&top<=safeTop);
     canvas.dataset.modelPivot="car-bounds-center";
    }
   }
   // As the camera reaches the rear, dim broad studio-panel reflections so
   // black bodywork stays graphite instead of turning silver from that angle.
   scene.environmentIntensity=scrollRootId?THREE.MathUtils.lerp(.95,.5,currentProgress):.95;
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
   const movement=Math.abs(currentMode-modeRef.current)+Math.abs(currentProgress-goalProgress)+(scrollRootId?0:camera.position.distanceTo(wanted));
   if(movement>.006||yawTransition){queuedContinuation=true;schedule();}
  }

  const pointerDown=(event:PointerEvent)=>{
   if(event.pointerType==="mouse"&&event.button!==0)return;
   drag=true;dragPointer=event.pointerId;previousX=event.clientX;
   manualMode=true;yawTransition=null;
   cameraYaw=wrapOrbit(Math.atan2(camera.position.z,camera.position.x));
   manualRadius=Math.hypot(camera.position.x,camera.position.z);
   manualHeight=camera.position.y;
   canvas.setPointerCapture(event.pointerId);
  };
  const pointerMove=(event:PointerEvent)=>{
   if(!drag||dragPointer!==event.pointerId)return;
   const delta=clamp(event.clientX-previousX,-45,45);
   previousX=event.clientX;
   if(Math.abs(delta)<.01)return;
   // Rotate immediately around the true model pivot. Normalizing at every
   // move guarantees three complete turns still have a bounded angle.
   cameraYaw=wrapOrbit(cameraYaw+delta*(isMobile?.0075:.0065));
   canvas.dataset.orbitOffset=cameraYaw.toFixed(5);
   schedule();
  };
  const pointerUp=(event:PointerEvent)=>{
   if(dragPointer!==event.pointerId)return;
   drag=false;dragPointer=null;
   if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  };
  const onScroll=()=>{
   const previous=goalProgress;
   measureProgress();
   if(scrollRootId&&!drag&&Math.abs(goalProgress-previous)>.00015){
    const direction:1|-1=goalProgress>previous?1:-1;
    if(manualMode||yawTransition&&yawTransition.direction!==direction){
     const destination=nextScrollChapter(previous,direction);
     const endpoint=destination/4;
     yawTransition={
      start:cameraYaw,end:CHAPTER_YAWS[destination],
      startP:previous,endP:endpoint,direction,
      radius:Math.hypot(camera.position.x,camera.position.z),
      height:camera.position.y,startedAt:performance.now()
     };
     manualMode=false;
    }
   }
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

  // This CC BY 4.0 McLaren P1 GLB uses Draco-compressed geometry and WebP textures.
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
   model=gltf.scene;tuneMaterials(model,renderer);
   const bounds=new THREE.Box3().setFromObject(model);
   const dims=bounds.getSize(new THREE.Vector3());
   const center=bounds.getCenter(new THREE.Vector3());
   const scalar=4.35/Math.max(dims.x,dims.z,0.001);
   model.scale.multiplyScalar(scalar);
   model.position.set(-center.x*scalar,.07-bounds.min.y*scalar,-center.z*scalar);
   car.add(model);
   car.updateMatrixWorld(true);
   const box=new THREE.Box3().setFromObject(car,true);
   frameCorners=[];
   for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])
    frameCorners.push(new THREE.Vector3(x,y,z));
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
   draco.dispose();
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
