/** Stable zoom factor for BLACK VELOCITY's camera. Zoom is never a component of orbit state. */
export const SHOWROOM_ZOOM_MIN=-2;
export const SHOWROOM_ZOOM_MAX=2;
export const SHOWROOM_ZOOM_STEP=.18;
export const normalizeShowroomZoom=(level:number)=>
 Math.min(SHOWROOM_ZOOM_MAX,Math.max(SHOWROOM_ZOOM_MIN,Number.isFinite(level)?level:0));
export const showroomZoomFactor=(level:number)=>
 1-normalizeShowroomZoom(level)*SHOWROOM_ZOOM_STEP;
export const showroomZoomRadius=(canonicalRadius:number,level:number)=>
 canonicalRadius*showroomZoomFactor(level);
export const showroomCanonicalRadius=(displayedRadius:number,level:number)=>
 displayedRadius/showroomZoomFactor(level);
