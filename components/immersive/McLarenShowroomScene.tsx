"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {RoomEnvironment} from "three/addons/environments/RoomEnvironment.js";
import type {WorldSceneProps} from "./WorldScene";
import {McLarenLoadingUI} from "./McLarenLoadingUI";

const MODEL_PATH="/models/mclaren.glb?v=20261029-p1-vecarz";
type SceneState="loading"|"ready"|"fallback";
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
const wrapAngle=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));

function makeStage(){
 const stage=new THREE.Group();
 // A broad, low-contrast floor gradient suggests a real cyclorama without a
 // hard horizon line or an expensive screen-space reflection pass.
 const groundCanvas=document.createElement("canvas");
 groundCanvas.width=512;groundCanvas.height=512;
 const groundCtx=groundCanvas.getContext("2d");
 if(groundCtx){
  // Fade the cyclorama into the canvas instead of drawing a square backdrop.
   const spill=groundCtx.createRadialGradient(256,256,10,256,256,252);
   spill.addColorStop(0,"rgba(66,71,77,.36)");
   spill.addColorStop(.44,"rgba(39,44,51,.19)");
   spill.addColorStop(.8,"rgba(22,26,30,.045)");
   spill.addColorStop(1,"rgba(12,14,18,0)");
   groundCtx.fillStyle=spill;groundCtx.fillRect(0,0,512,512);
 }
 const groundTexture=new THREE.CanvasTexture(groundCanvas);
 groundTexture.colorSpace=THREE.SRGBColorSpace;
 const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(24,24),
  new THREE.MeshBasicMaterial({map:groundTexture,transparent:true,depthWrite:false,toneMapped:false})
 );
 ground.rotation.x=-Math.PI/2;
 ground.position.y=-.06;
 stage.add(ground);

 const canvas=document.createElement("canvas");
 canvas.width=256;canvas.height=256;
 const ctx=canvas.getContext("2d");
 if(ctx){
  const gradient=ctx.createRadialGradient(128,128,8,128,128,128);
  gradient.addColorStop(0,"rgba(0,0,0,.94)");
  gradient.addColorStop(.36,"rgba(0,0,0,.72)");
  gradient.addColorStop(.72,"rgba(0,0,0,.20)");
  gradient.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);
 }
 const tex=new THREE.CanvasTexture(canvas);
 const shadow=new THREE.Mesh(
  new THREE.PlaneGeometry(5.5,3.1),
  new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.43,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1})
 );
 shadow.rotation.x=-Math.PI/2;
 shadow.position.y=-.045;
 stage.add(shadow);
 // A single underbody shadow replaces the four dark contact blobs.
  return {stage,tex,groundTexture};
}

function addStudioReflectionPanels(studio:THREE.Scene){
 // Long softboxes make the shape of the painted surfaces readable without a
 // white hotspot on every curved panel. These exist only in the PMREM scene.
 const specs:[number,number,number,number,number,number,number][]=[
  [7.2,1.1,-4.8,5.5,2.8,1.7,0xf0f5ff],
  [5.1,.75,2.8,5.8,-3.5,1.5,0xffffff],
  [1.1,5.3,5.8,3.0,1.5,1.15,0xcbd9ef],
  [2.5,.85,-3.3,2.8,-5.2,.85,0xffdec9]
 ];
 return specs.map(([w,h,x,y,z,strength,color])=>{
  const material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),side:THREE.DoubleSide,toneMapped:false});
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
  panel.position.set(x,y,z);panel.lookAt(0,0,0);
  studio.add(panel);
  return panel;
 });
}

function tuneMaterials(model:THREE.Object3D,renderer:THREE.WebGLRenderer){
 // Keep the supplied color and texture maps intact; tame chrome-like carbon
 // reflections and sharpen sampled texture detail at oblique camera angles.
 const anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
 model.traverse(child=>{
  if(!(child instanceof THREE.Mesh))return;
  child.castShadow=false;
  child.receiveShadow=false;
  const materials=Array.isArray(child.material)?child.material:[child.material];
  for(const mat of materials){
   if(!(mat instanceof THREE.MeshStandardMaterial))continue;
   const blackBase=mat.color.r<.03&&mat.color.g<.03&&mat.color.b<.03;
   if(mat.name==="Carpaint"){
    // The source GLB combines extremely rough orange basecoat with an almost
    // mirror-smooth clearcoat. Balance the layers for automotive lacquer.
    mat.roughness=.34;mat.metalness=.28;mat.envMapIntensity=.8;
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.clearcoat=.82;mat.clearcoatRoughness=.16;
    }
   }else if(mat.name==="Carpaint_Black"){
    mat.roughness=.36;mat.metalness=.48;mat.envMapIntensity=.66;
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.clearcoat=.65;mat.clearcoatRoughness=.2;
    }
   }else if(["carbon_1","INT_carbon","Carbon_Mult50"].includes(mat.name)){
    // glTF defaults an omitted metallicFactor to 1. Carbon is not polished metal.
    mat.metalness=Math.min(mat.metalness,.18);
    mat.roughness=Math.max(mat.roughness,.42);
    mat.envMapIntensity=.38;
    if(mat instanceof THREE.MeshPhysicalMaterial){
     mat.clearcoat=Math.min(mat.clearcoat,.35);
     mat.clearcoatRoughness=Math.max(mat.clearcoatRoughness,.3);
    }
   }else if(["Windows","Windows_alpha","Clear_Glass"].includes(mat.name)){
    mat.roughness=Math.max(mat.roughness,.16);
    mat.envMapIntensity=.55;
    if(mat instanceof THREE.MeshPhysicalMaterial)mat.clearcoatRoughness=Math.max(mat.clearcoatRoughness,.12);
   }else if(["Plastics","Brake_Disk","Chrome"].includes(mat.name)){
    mat.roughness=Math.max(mat.roughness,mat.name==="Brake_Disk"?.34:.24);
    mat.envMapIntensity=.55;
   }else if(blackBase||mat.name==="plastic_gloss"){
    mat.metalness=Math.min(mat.metalness,.22);
    mat.roughness=Math.max(mat.roughness,.34);
    mat.envMapIntensity=.4;
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
   mat.needsUpdate=true;
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
    canvas,alpha:true,antialias:true,
    powerPreference:isMobile?"low-power":"high-performance",preserveDrawingBuffer:false
   });
  }catch(error){
   console.warn("Athena McLaren: WebGL unavailable",error);
   setStatus("fallback");finishLoading();return;
  }
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.94;
  renderer.shadowMap.enabled=false;
  // Chromium can expose a WebGL 2 context backed by a CPU rasterizer. Such a
  // context is functional, but repeatedly easing the camera queues expensive
  // GPU work and can make the surrounding DOM controls unresponsive.
  const gl=renderer.getContext();
  const rendererInfo=gl.getExtension("WEBGL_debug_renderer_info");
  const rendererName=String(rendererInfo?gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER));
  const softwareRenderer=/swiftshader|llvmpipe|softpipe|software|lavapipe/i.test(rendererName);

  const scene=new THREE.Scene();
  // One CSS stage background covers the whole viewport behind transparent WebGL.
  scene.background=null;
  renderer.setClearColor(0x0c0e12,0);
  const camera=new THREE.PerspectiveCamera(34,1,.1,85);
  // Orbit around the actual model center. Use a lens shift for desktop copy
  // clearance; moving the look-at point instead makes the car orbit off-axis.
  const isWideHero=()=>scrollRootId==="bv-cinematic-track"&&window.innerWidth>820;
  const target=new THREE.Vector3(0,isWideHero()?.47:.68,0);
  let wideDistance=1;
  canvas.dataset.cameraTargetX=target.x.toFixed(2);
  camera.position.set(5.6,2.5,5.8);camera.lookAt(target);

  const ambient=new THREE.HemisphereLight(0xf4f6fc,0x272e35,.62);
  scene.add(ambient);
  const key=new THREE.DirectionalLight(0xf9fbff,2.15);
  key.position.set(-4.5,7,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffdfcc,.85);
  rim.position.set(4.5,3,-4.2);scene.add(rim);
  const cool=new THREE.DirectionalLight(0xd8e6ff,.95);
  cool.position.set(-3,2.5,-5.5);scene.add(cool);
  const floor=makeStage();
  // On small screens the finite ground plane causes a hard horizontal stripe
  // wherever the moving WebGL canvas ends. The shared CSS studio background
  // replaces it; retain only the smooth underbody shadow inside transparent WebGL.
  if(isMobile)floor.stage.children[0].visible=false;
  scene.add(floor.stage);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const studio=new RoomEnvironment();
  const panels=addStudioReflectionPanels(studio);
  const generated=pmrem.fromScene(studio,.04);
  for(const panel of panels){
   studio.remove(panel);
   panel.geometry.dispose();
   (panel.material as THREE.Material).dispose();
  }
  studio.dispose();
  scene.environment=generated.texture;
  scene.environmentIntensity=.78;

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
  let loaded=false,disposed=false,model:THREE.Object3D|null=null;
  let request=0,visible=true,frameTime=0,drawn=false;
  let expensiveFrames=0,preferImmediateCamera=softwareRenderer;
  let queuedContinuation=false;
  let drag=false,previousX=0,manualOrbit=1.02,displayOrbit=1.02,manualActive=false;
  let currentMode=modeRef.current,currentProgress=0,goalProgress=0;
  // Desktop renders on every requested RAF during active interaction, not at an
  // artificial 38 FPS ceiling. Mobile retains a 30 FPS cap and pixel budget.
  // Offscreen/idle rendering remains stopped by schedule()/IntersectionObserver.
  const limit=isMobile?30:softwareRenderer?100:0;
  // The former 650k desktop pixel ceiling rendered a 1440x900 chapter below
  // native 1x resolution. Preserve sharp geometry on a capable GPU; on a
  // software renderer retain the bounded compatibility tier used by CI.
  let renderBudget=softwareRenderer?(isMobile?140000:240000):isMobile?2100000:5200000;

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
   const natural=Math.min(window.devicePixelRatio||1,2);
   const fit=Math.min(1,Math.sqrt(renderBudget/Math.max(1,rect.width*rect.height*natural*natural)));
   const effectiveDpr=natural*fit;
   renderer.setPixelRatio(effectiveDpr);
   renderer.setSize(Math.round(rect.width),Math.round(rect.height),false);
   canvas.dataset.renderDpr=effectiveDpr.toFixed(3);
   canvas.dataset.renderPixels=String(Math.round(rect.width*rect.height*effectiveDpr*effectiveDpr));
   canvas.dataset.renderQuality=softwareRenderer?"compatibility":"adaptive-high";
   const widthProgress=clamp((window.innerWidth-820)/780,0,1);
   const wide=isWideHero();
   wideDistance=wide?1.6-.6*widthProgress:1;
   camera.filmOffset=wide?-3-4*widthProgress:scrollRootId&&!isMobile?-1:0;
   target.y=wide?.47:.68;
   canvas.dataset.cameraFilmOffset=camera.filmOffset.toFixed(2);
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
   const angles=[1.02,2.0,4.9];
   // Five signed-off narrative keyframes, sampled directly from scroll progress.
   // Reversing scroll settles on the same pose once the glide catches up.
   const journeyAngles=[1.02,1.42,2.12,3.82,5.42];
   const journeyElevations=[2.35,1.98,2.48,2.18,2.55];
   // Narrow mobile views need more camera clearance at every chapter.
    const journeyDistances=isMobile?[.94,1,.98,1,1]:[1,.93,.71,.88,1.04];
   // The camera performs the chapter motion. Keep the physical car pivot fixed.
   const position=clamp(currentProgress*4,0,4);
   const lower=Math.min(3,Math.floor(position));
   const fraction=position-lower;
   const smoothFraction=fraction*fraction*(3-2*fraction);
   const scrollOrbit=THREE.MathUtils.lerp(journeyAngles[lower],journeyAngles[lower+1],smoothFraction);
   const scrollHeight=THREE.MathUtils.lerp(journeyElevations[lower],journeyElevations[lower+1],smoothFraction);
   const scrollDistance=THREE.MathUtils.lerp(journeyDistances[lower],journeyDistances[lower+1],smoothFraction);
   // Keep the mesh at the world origin so drag and scroll share one true pivot.
   // Preset changes should travel between camera poses, not snap halfway.
   const modePosition=clamp(currentMode,0,2);
   const modeLower=Math.min(1,Math.floor(modePosition));
   const modeT=modePosition-modeLower;
   const easedMode=modeT*modeT*(3-2*modeT);
   const heroOrbit=angles[modeLower]+(angles[modeLower+1]-angles[modeLower])*easedMode;
   // Drag temporarily controls an absolute camera orbit. Any new scroll input
   // releases it and glides to the authored chapter angle (never B + C).
   const desiredOrbit=manualActive?manualOrbit:(scrollRootId?scrollOrbit:heroOrbit+currentProgress*.20);
   if(!drawn)displayOrbit=wrapAngle(desiredOrbit);
   else{
    const angularStep=drag?1:preferImmediateCamera?1:1-Math.exp(-travelStep/175);
    displayOrbit=wrapAngle(displayOrbit+wrapAngle(desiredOrbit-displayOrbit)*angularStep);
   }
   if(canvas){
    canvas.dataset.scrollProgress=currentProgress.toFixed(4);
    canvas.dataset.modelX=car.position.x.toFixed(4);
    canvas.dataset.manualOrbit=manualOrbit.toFixed(4);
    canvas.dataset.cameraOrbit=displayOrbit.toFixed(4);
    canvas.dataset.cameraGoalOrbit=wrapAngle(desiredOrbit).toFixed(4);
    canvas.dataset.orbitSource=manualActive?"drag":"scroll";
   }
   const baseDistance=Math.max(6.75,6.75*.93/Math.max(.60,camera.aspect))*(isMobile?1.05:1);
   const dist=baseDistance*wideDistance*(scrollRootId?scrollDistance:1)*(1-clamp(zoomRef.current,-1,2)*(isMobile?.04:.09));
   const y=scrollRootId?scrollHeight:(isMobile?2.6:2.42);
   const wanted=new THREE.Vector3(Math.cos(displayOrbit)*dist,y,Math.sin(displayOrbit)*dist);
   if(scrollRootId)camera.position.copy(wanted);
   else camera.position.lerp(wanted,lerp);
   camera.lookAt(target);
   // As the camera reaches the rear, dim broad studio-panel reflections so
   // black bodywork stays graphite instead of turning silver from that angle.
   scene.environmentIntensity=scrollRootId?THREE.MathUtils.lerp(.78,.56,currentProgress):.78;
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
   const movement=Math.abs(currentMode-modeRef.current)+Math.abs(currentProgress-goalProgress)+Math.abs(wrapAngle(desiredOrbit-displayOrbit))+camera.position.distanceTo(wanted);
   if(movement>.006){queuedContinuation=true;schedule();}
  }

  const pointerDown=(event:PointerEvent)=>{
   drag=true;previousX=event.clientX;
   manualOrbit=displayOrbit;manualActive=true;
   canvas.setPointerCapture(event.pointerId);
  };
  const pointerMove=(event:PointerEvent)=>{
   if(!drag)return;
   // Change the absolute viewing angle directly; discard complete revolutions.
   manualOrbit=wrapAngle(manualOrbit+clamp(event.clientX-previousX,-45,45)*.006);
   previousX=event.clientX;schedule();
  };
  const pointerUp=()=>{drag=false;};
  const onScroll=()=>{
   measureProgress();
   // Scroll returns to the authored absolute angle via the shortest arc.
   // Neither the dragged angle nor its number of turns shifts the keyframes.
   manualActive=false;
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
   // The original car pivot is untouched; contact reads as one soft footprint.
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
   floor.tex.dispose();floor.groundTexture.dispose();generated.texture.dispose();pmrem.dispose();
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
