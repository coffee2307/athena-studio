import * as THREE from "three";

/**
 * Exact directional support points from the original GLB geometry.
 * Samples every vertex against all 162 support directions, but computes
 * each world transform once and avoids millions of Vector3.dot calls.
 * Fidelity and optical framing are unchanged; only CPU overhead is reduced.
 */
export function buildCarSilhouetteSupports(root:THREE.Object3D,pivot:THREE.Object3D):THREE.Vector3[]{
 pivot.updateMatrixWorld(true);
 root.updateMatrixWorld(true);
 const inverse=pivot.matrixWorld.clone().invert();
 const directions:THREE.Vector3[]=[];
 for(let step=0;step<32;step++){
  const angle=step*Math.PI*2/32;
  for(const elevation of [-5,-1.5,0,1.5,5]){
   directions.push(new THREE.Vector3(Math.cos(angle),elevation,Math.sin(angle)).normalize());
  }
 }
 directions.push(new THREE.Vector3(0,1,0),new THREE.Vector3(0,-1,0));
 const dx=directions.map(direction=>direction.x);
 const dy=directions.map(direction=>direction.y);
 const dz=directions.map(direction=>direction.z);
 const scores=directions.map(()=>-Infinity);
 const supports=directions.map(()=>new THREE.Vector3());
 const transform=new THREE.Matrix4();
 root.traverse(object=>{
  if(!(object instanceof THREE.Mesh))return;
  const positions=object.geometry?.getAttribute("position");
  if(!positions)return;
  transform.multiplyMatrices(inverse,object.matrixWorld);
  const e=transform.elements;
  for(let index=0;index<positions.count;index++){
   const x=positions.getX(index),y=positions.getY(index),z=positions.getZ(index);
   const w=1/(e[3]*x+e[7]*y+e[11]*z+e[15]);
   const px=(e[0]*x+e[4]*y+e[8]*z+e[12])*w;
   const py=(e[1]*x+e[5]*y+e[9]*z+e[13])*w;
   const pz=(e[2]*x+e[6]*y+e[10]*z+e[14])*w;
   for(let directionIndex=0;directionIndex<directions.length;directionIndex++){
    const score=px*dx[directionIndex]+py*dy[directionIndex]+pz*dz[directionIndex];
    if(score>scores[directionIndex]){
     scores[directionIndex]=score;
     supports[directionIndex].set(px,py,pz);
    }
   }
  }
 });
 const seen=new Set<string>();
 return supports.filter((point,index)=>{
  if(!Number.isFinite(scores[index]))return false;
  const key=[point.x,point.y,point.z].map(value=>value.toFixed(4)).join(":");
  if(seen.has(key))return false;
  seen.add(key);
  return true;
 });
}

export function projectCarSilhouette(
 points:readonly THREE.Vector3[],pivot:THREE.Object3D,camera:THREE.Camera
){
 pivot.updateMatrixWorld(true);
 camera.updateMatrixWorld(true);
 const world=new THREE.Vector3();
 let left=Infinity,right=-Infinity,bottom=Infinity,top=-Infinity;
 for(const point of points){
  world.copy(point).applyMatrix4(pivot.matrixWorld).project(camera);
  left=Math.min(left,world.x);right=Math.max(right,world.x);
  bottom=Math.min(bottom,world.y);top=Math.max(top,world.y);
 }
 return {left,right,bottom,top,centerX:(left+right)/2,centerY:(bottom+top)/2};
}
