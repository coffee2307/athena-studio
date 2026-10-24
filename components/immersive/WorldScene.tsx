"use client";

import dynamic from "next/dynamic";
import {ImmersiveScene} from "./ImmersiveScene";
import {McLarenLoadingUI} from "./McLarenLoadingUI";

type World="creative-studio"|"architecture-studio"|"auto-showroom";
export type WorldSceneProps={slug:World;preset:number;enabled?:boolean;scrollRootId?:string;onRequestFallback?:()=>void};
const McLarenScene=dynamic(()=>import("./McLarenShowroomScene").then(x=>x.McLarenShowroomScene),{
 ssr:false,
 loading:()=> <><canvas className="ix-3d-canvas" data-renderer="loading" data-scene-type="auto-showroom" aria-hidden="true"/><McLarenLoadingUI/></>,
});

/** Keeps the non-automotive WebGL mesh worlds unchanged. The Three.js bundle
 * and GLB asset are fetched only after a user explicitly enables 3D. */
export function WorldScene(props:WorldSceneProps){
 if(props.slug!=="auto-showroom")return <ImmersiveScene {...props}/>;
 if(props.enabled===false)return <canvas className="ix-3d-canvas" data-renderer="fallback" data-scene-type="auto-showroom" aria-hidden="true"/>;
 return <McLarenScene {...props}/>;
}
