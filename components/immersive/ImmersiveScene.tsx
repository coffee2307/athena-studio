"use client";

import {useEffect,useRef,useState} from "react";
import {makeWorldMesh} from "./mesh-worlds";

type WorldSlug="creative-studio"|"architecture-studio"|"auto-showroom";
type StageStatus="loading"|"ready"|"fallback";
const vertexSource="#version 300 es\nprecision highp float;\nlayout(location=0) in vec3 aPosition;\nlayout(location=1) in vec3 aNormal;\nlayout(location=2) in vec3 aColor;\nuniform vec2 uResolution;\nuniform vec2 uPointer;\nuniform float uProgress;\nuniform float uMode;\nuniform int uScene;\nout vec3 vNormal;\nout vec3 vColor;\nout vec3 vViewPosition;\nmat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}\nmat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}\nvoid main(){\n vec3 p=aPosition;\n float mode=clamp(uMode,0.,2.);\n if(uScene==0 && p.y > -1.1){p.x+=sin(p.y*1.8+mode*1.4)*.08;p.z+=cos(p.x*2.+mode)*.045;}\n if(uScene==1 && p.y>1.20){p.y+=mode*.30;}\n float yaw=.12+mode*.18+uPointer.x*.29+uProgress*.28;\n if(uScene==1)yaw=-.23+mode*.11+uPointer.x*.26+uProgress*.17;\n if(uScene==2)yaw=-.40+mode*.18+uPointer.x*.23+uProgress*.20;\n mat3 rotation=rx(-.17+uPointer.y*.08+uProgress*.06)*ry(yaw);\n vec3 view=rotation*(p+vec3(0.,.22,0.))+vec3(0.,-.05,-7.6);\n float aspect=uResolution.x/max(1.,uResolution.y);\n float focal=1.9,near=0.1,far=30.;\n gl_Position=vec4(view.x*focal/aspect,view.y*focal,(-view.z*(far+near)-2.*far*near)/(far-near),-view.z);\n vNormal=normalize(rotation*aNormal);\n vViewPosition=view;\n vec3 color=aColor;\n if(uScene==2 && color.r>.59 && color.b>.6){\n   color=mix(color,vec3(.25,.29,.34),smoothstep(.2,.95,mode));\n   color=mix(color,vec3(.69,.13,.11),smoothstep(1.1,1.95,mode));\n }\n vColor=color;\n}";
const fragmentSource="#version 300 es\nprecision highp float;\nin vec3 vNormal;\nin vec3 vColor;\nin vec3 vViewPosition;\nout vec4 outColor;\nuniform int uScene;\nvoid main(){\n vec3 N=normalize(vNormal), V=normalize(-vViewPosition);\n vec3 key=normalize(vec3(-.48,.76,.82)),fill=normalize(vec3(.81,.36,-.45));\n float diffuse=max(dot(N,key),0.),bounce=max(dot(N,fill),0.);\n float rim=pow(1.-max(dot(N,V),0.),3.);\n vec3 halfway=normalize(key+V);\n float spec=pow(max(dot(N,halfway),0.),40.)*.29;\n vec3 base=vColor*(.27+diffuse*.56+bounce*.16)+vec3(.97,.92,.84)*spec+vec3(.31,.40,.50)*rim*.29;\n if(uScene==1)base+=vec3(.055,.043,.031)*diffuse;\n outColor=vec4(pow(max(base,vec3(0.)),vec3(.90)),1.);\n}";

function compile(gl:WebGL2RenderingContext,kind:number,source:string){
 const s=gl.createShader(kind);if(!s)return null;
 gl.shaderSource(s,source);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn("Athena shader",gl.getShaderInfoLog(s));gl.deleteShader(s);return null;}
 return s;
}
function link(gl:WebGL2RenderingContext){
 const a=compile(gl,gl.VERTEX_SHADER,vertexSource),b=compile(gl,gl.FRAGMENT_SHADER,fragmentSource);
 if(!a||!b){if(a)gl.deleteShader(a);if(b)gl.deleteShader(b);return null;}
 const p=gl.createProgram();if(!p){gl.deleteShader(a);gl.deleteShader(b);return null;}
 gl.attachShader(p,a);gl.attachShader(p,b);gl.linkProgram(p);
 gl.detachShader(p,a);gl.detachShader(p,b);gl.deleteShader(a);gl.deleteShader(b);
 if(!gl.getProgramParameter(p,gl.LINK_STATUS)){console.warn("Athena program",gl.getProgramInfoLog(p));gl.deleteProgram(p);return null;}
 return p;
}
export function ImmersiveScene({slug,preset,enabled=true,scrollRootId}:{
 slug:WorldSlug;preset:number;enabled?:boolean;scrollRootId?:string
}){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const presetRef=useRef(preset);
 const wakeRef=useRef<()=>void>(()=>{});
 const [status,setStatus]=useState<StageStatus>("loading");
 presetRef.current=preset;
 useEffect(()=>{wakeRef.current();},[preset]);
 useEffect(()=>{
  const candidate=canvasRef.current;if(!candidate)return;
  const canvas:HTMLCanvasElement=candidate;
  if(!enabled||window.matchMedia("(prefers-reduced-motion: reduce)").matches){setStatus("fallback");return;}
  const gl=canvas.getContext("webgl2",{
   alpha:false,depth:true,stencil:false,antialias:true,powerPreference:"low-power",preserveDrawingBuffer:false,
  });
  if(!gl){setStatus("fallback");return;}
  const program=link(gl);
  if(!program){setStatus("fallback");return;}
  const geometry=makeWorldMesh(slug);
  const buffer=gl.createBuffer();
  if(!buffer){gl.deleteProgram(program);setStatus("fallback");return;}
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,geometry,gl.STATIC_DRAW);
  for(let i=0;i<3;i++){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,3,gl.FLOAT,false,36,i*12);}
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
  const u={
   resolution:gl.getUniformLocation(program,"uResolution"),
   pointer:gl.getUniformLocation(program,"uPointer"),
   progress:gl.getUniformLocation(program,"uProgress"),
   mode:gl.getUniformLocation(program,"uMode"),
   scene:gl.getUniformLocation(program,"uScene"),
  };
  gl.uniform1i(u.scene,{"creative-studio":0,"architecture-studio":1,"auto-showroom":2}[slug]);
  let frame=0,alive=true,onScreen=true,drawn=false,last=0;
  let mode=presetRef.current,px=0,py=0,tx=0,ty=0,progress=0,goalProgress=0;
  const mobile=window.matchMedia("(max-width: 760px)").matches;
  const minInterval=mobile?1000/24:1000/40;
  const schedule=()=>{if(alive&&onScreen&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);};
  wakeRef.current=schedule;
  const measure=()=>{
   const root=scrollRootId?document.getElementById(scrollRootId):canvas;
   if(!root)return;
   const rect=root.getBoundingClientRect();
   goalProgress=Math.max(0,Math.min(1,-rect.top/Math.max(1,scrollRootId?rect.height-window.innerHeight:rect.height)));
  };
  function draw(now:number){
   frame=0;
   if(!alive||!onScreen||document.hidden)return;
   const elapsed=now-last;
   if(elapsed<minInterval){schedule();return;}
   last=now;
   const rect=canvas.getBoundingClientRect();
   if(rect.width<5||rect.height<5)return;
   const cap=mobile?170000:420000;
   const scale=Math.min(window.devicePixelRatio||1,mobile?1:1.25);
   const fit=Math.min(1,Math.sqrt(cap/Math.max(1,rect.width*rect.height*scale*scale)));
   const w=Math.max(1,Math.floor(rect.width*scale*fit));
   const h=Math.max(1,Math.floor(rect.height*scale*fit));
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   const k=Math.min(.24,Math.max(.05,elapsed*.007));
   px+=(tx-px)*k;py+=(ty-py)*k;
   progress+=(goalProgress-progress)*k;
   mode+=(presetRef.current-mode)*k;
   gl!.viewport(0,0,w,h);
   gl!.clearColor(slug==="architecture-studio"?.08:.025,slug==="architecture-studio"?.073:.037,.055,1);
   gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
   gl!.uniform2f(u.resolution,w,h);gl!.uniform2f(u.pointer,px,py);
   gl!.uniform1f(u.progress,progress);gl!.uniform1f(u.mode,mode);
   gl!.drawArrays(gl!.TRIANGLES,0,geometry.length/9);
   if(!drawn){drawn=true;setStatus("ready");}
   // No idle GPU work: settle the camera, then stop requesting frames.
   if(Math.abs(tx-px)+Math.abs(ty-py)+Math.abs(goalProgress-progress)+Math.abs(presetRef.current-mode)>.003)schedule();
  }
  const onPointer=(e:PointerEvent)=>{
   if(e.pointerType==="touch")return;
   const r=canvas.getBoundingClientRect();
   if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
   tx=Math.max(-1,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width)*2-1));
   ty=Math.max(-1,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)*2-1));
   schedule();
  };
  const onScroll=()=>{measure();schedule();};
  const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();};
  const onLoss=(event:Event)=>{event.preventDefault();alive=false;cancelAnimationFrame(frame);setStatus("fallback");};
  const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion=()=>{if(motion.matches){alive=false;cancelAnimationFrame(frame);setStatus("fallback");}};
  const observer=new IntersectionObserver(entries=>{
   onScreen=entries.some(e=>e.isIntersecting);
   if(onScreen){measure();schedule();}else{cancelAnimationFrame(frame);frame=0;}
  },{rootMargin:"30px"});
  observer.observe(canvas);
  window.addEventListener("pointermove",onPointer,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",onScroll);
  document.addEventListener("visibilitychange",onVisibility);
  canvas.addEventListener("webglcontextlost",onLoss);
  motion.addEventListener("change",onMotion);
  measure();schedule();
  return()=>{
   alive=false;wakeRef.current=()=>{};cancelAnimationFrame(frame);
   observer.disconnect();window.removeEventListener("pointermove",onPointer);
   window.removeEventListener("scroll",onScroll);
   window.removeEventListener("resize",onScroll);
   document.removeEventListener("visibilitychange",onVisibility);
   canvas.removeEventListener("webglcontextlost",onLoss);
   motion.removeEventListener("change",onMotion);
   gl.deleteBuffer(buffer);gl.deleteProgram(program);
  };
 },[slug,enabled,scrollRootId]);
 return <canvas ref={canvasRef}
  className={"ix-3d-canvas"+(status==="ready"?" is-active":"")}
  data-renderer={status} data-geometry="triangle-mesh" data-scene-type={slug} aria-hidden="true"/>;
}
