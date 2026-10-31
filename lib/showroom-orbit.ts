/** Canonical camera chapter angles and angular interpolation for BLACK VELOCITY.
 * Invariant: drag revolutions never enter scroll state. */
export const CHAPTER_YAWS=[.72,-.16,2.12,3.82,5.42] as const;
export const CHAPTER_ELEVATIONS=[2.35,1.98,2.48,2.18,2.55] as const;
export const CHAPTER_DISTANCES=[1,1.04,.99,1.02,1.08] as const;
export const clamp01=(x:number)=>Math.max(0,Math.min(1,x));
export const wrapOrbit=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));
export const shortestOrbitDelta=(from:number,to:number)=>wrapOrbit(to-from);
export const smooth=(t:number)=>{const x=clamp01(t);return x*x*(3-2*x);};
export const interpolateOrbit=(from:number,to:number,t:number)=>
 wrapOrbit(from+shortestOrbitDelta(from,to)*smooth(t));
export function narrativeOrbit(progress:number){
 const segment=clamp01(progress)*4;
 const i=Math.min(3,Math.floor(segment));
 return interpolateOrbit(CHAPTER_YAWS[i],CHAPTER_YAWS[i+1],segment-i);
}
export function nextScrollChapter(fromProgress:number,direction:1|-1){
 const p=clamp01(fromProgress)*4;
 return direction===1?Math.min(4,Math.floor(p+1e-5)+1):Math.max(0,Math.ceil(p-1e-5)-1);
}
export function scrollTransition(fromAngle:number,toAngle:number,startProgress:number,endProgress:number,currentProgress:number){
 if(Math.abs(endProgress-startProgress)<1e-5)return wrapOrbit(toAngle);
 return interpolateOrbit(fromAngle,toAngle,(currentProgress-startProgress)/(endProgress-startProgress));
}
