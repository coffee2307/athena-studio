import * as THREE from "three";

/**
 * A compact support cloud derived from actual GLB mesh vertices, rather
 * than eight corners of a model-wide axis-aligned bounding box.
 *
 * The extrema are cached once, before interaction begins. Projecting the
 * cloud each frame keeps drag responsive even on software WebGL.
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
 const scores=directions.map(()=>-Infinity);
 const supports=directions.map(()=>new THREE.Vector3());
 const vertex=new THREE.Vector3();
 const transform=new THREE.Matrix4();
 root.traverse(object=>{
  if(!(object instanceof THREE.Mesh))return;
  const positions=object.geometry?.getAttribute("position");
  if(!positions)return;
  transform.multiplyMatrices(inverse,object.matrixWorld);
  for(let index=0;index<positions.count;index++){
   vertex.fromBufferAttribute(positions,index).applyMatrix4(transform);
   for(let directionIndex=0;directionIndex<directions.length;directionIndex++){
    const score=vertex.dot(directions[directionIndex]);
    if(score>scores[directionIndex]){
     scores[directionIndex]=score;
     supports[directionIndex].copy(vertex);
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
