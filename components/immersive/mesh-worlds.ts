/**
 * Original low-poly, material-colored triangle meshes for Athena's demo worlds.
 * Built once per WebGL context; no SDF ray marching or external 3D assets.
 * Coordinates: X horizontal, Y up, Z depth. Vehicle front faces +X.
 */
type V3 = [number, number, number];
type RGB = [number, number, number];
type Vertex = {p:V3; n:V3; c:RGB};
const palette = {
  ink:[0.055,0.075,0.095] as RGB,
  steel:[0.62,0.70,0.77] as RGB,
  silver:[0.85,0.89,0.94] as RGB,
  dark:[0.14,0.18,0.23] as RGB,
  gold:[0.71,0.53,0.30] as RGB,
  cream:[0.87,0.81,0.68] as RGB,
  glass:[0.19,0.31,0.40] as RGB,
  wood:[0.48,0.32,0.21] as RGB,
  terracotta:[0.49,0.32,0.24] as RGB,
  tire:[0.06,0.069,0.075] as RGB,
  red:[0.73,0.15,0.12] as RGB,
};
const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const cross=(a:V3,b:V3):V3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalized=(a:V3):V3=>{const d=Math.hypot(...a)||1;return[a[0]/d,a[1]/d,a[2]/d];};
class Geometry {
  readonly vertices:Vertex[]=[];
  add(a:V3,b:V3,c:V3,color:RGB,n?:V3){
    const normal=n||normalized(cross(sub(b,a),sub(c,a)));
    for(const p of [a,b,c])this.vertices.push({p,n:normal,c:color});
  }
  quad(a:V3,b:V3,c:V3,d:V3,color:RGB){
    this.add(a,b,c,color);this.add(a,c,d,color);
  }
  box(center:V3,size:V3,color:RGB,angle=0){
    const [x,y,z]=center,[a,b,c]=size.map(v=>v/2) as V3;
    const turn=(p:V3):V3=>[x+p[0]*Math.cos(angle)-p[2]*Math.sin(angle),y+p[1],z+p[0]*Math.sin(angle)+p[2]*Math.cos(angle)];
    const p=[[-a,-b,-c],[a,-b,-c],[a,b,-c],[-a,b,-c],[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]].map(x=>turn(x as V3));
    for(const f of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){
      this.quad(p[f[0]],p[f[1]],p[f[2]],p[f[3]],color);
    }
  }
  polygonSide(points:[number,number][],z0:number,z1:number,color:RGB){
    const p=points.map(([x,y])=>[x,y,z0] as V3);
    const q=points.map(([x,y])=>[x,y,z1] as V3);
    for(let i=1;i<points.length-1;i++){
      this.add(p[0],p[i+1],p[i],color);
      this.add(q[0],q[i],q[i+1],color);
    }
    for(let i=0;i<points.length;i++){
      const j=(i+1)%points.length;this.quad(p[i],q[i],q[j],p[j],color);
    }
  }
  cylinder(center:V3,radius:number,depth:number,color:RGB,axis:"y"|"z"="z",steps=18){
    const [x,y,z]=center;
    const where=(cos:number,sin:number,t:number):V3=>axis==="z"?[x+radius*cos,y+radius*sin,z+t]:[x+radius*cos,y+t,z+radius*sin];
    for(let i=0;i<steps;i++){
      const a=i*Math.PI*2/steps,b=(i+1)*Math.PI*2/steps;
      const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
      const one=where(ca,sa,-depth/2),two=where(cb,sb,-depth/2),three=where(cb,sb,depth/2),four=where(ca,sa,depth/2);
      this.quad(one,two,three,four,color);
      this.add(axis==="z"?[x,y,z-depth/2]:[x,y-depth/2,z],two,one,color);
      this.add(axis==="z"?[x,y,z+depth/2]:[x,y+depth/2,z],four,three,color);
    }
  }
  tubeRing(center:V3,major:number,minor:number,angle:number,color:RGB,segments=48,sides=8){
    const [cx,cy,cz]=center;
    const transform=(p:V3):V3=>[cx+p[0],cy+p[1]*Math.cos(angle)-p[2]*Math.sin(angle),cz+p[1]*Math.sin(angle)+p[2]*Math.cos(angle)];
    for(let i=0;i<segments;i++)for(let k=0;k<sides;k++){
      const t=i*2*Math.PI/segments,t2=(i+1)*2*Math.PI/segments;
      const s=k*2*Math.PI/sides,s2=(k+1)*2*Math.PI/sides;
      const point=(a:number,b:number):V3=>transform([(major+minor*Math.cos(b))*Math.cos(a),(major+minor*Math.cos(b))*Math.sin(a),minor*Math.sin(b)]);
      this.quad(point(t,s),point(t2,s),point(t2,s2),point(t,s2),color);
    }
  }
  ribbon(center:V3,r:number,width:number,turns:number,color:RGB){
    const segments=88;
    const side=(t:number,offset:number):V3=>{
      const a=t*Math.PI*2;
      const wave=Math.sin(a*turns)*0.32;
      return [center[0]+Math.cos(a)*(r+wave)+offset*Math.sin(a)*0.14,
       center[1]+Math.sin(a)*(r+wave)+offset*Math.cos(a)*0.14,
       center[2]+Math.sin(a*2.0)*0.35+offset*Math.cos(a*turns)]};
    for(let i=0;i<segments;i++){
      const a=i/segments,b=(i+1)/segments;
      this.quad(side(a,-width),side(b,-width),side(b,width),side(a,width),color);
    }
  }
  data():Float32Array{
    const raw=new Float32Array(this.vertices.length*9);
    this.vertices.forEach((v,i)=>{
      const j=i*9;raw.set([...v.p,...v.n,...v.c],j);
    });
    return raw;
  }
}

function studio(){
 const m=new Geometry();
 m.box([0,-1.46,0],[3.8,0.19,2.6],palette.ink);
 m.box([0,-1.31,0],[2.25,0.11,1.65],palette.steel);
 m.box([0,-1.21,0],[1.8,0.13,1.35],palette.gold);
 // Interwoven sculpture: physically distinct ribbons, not concentric pills.
 m.ribbon([-.24,.15,.12],.92,.22,2,palette.silver);
 m.tubeRing([.38,.13,-.24],1.09,.083,.45,palette.gold);
 m.tubeRing([-.22,.24,.18],.73,.072,-.76,palette.steel);
 m.box([-1.54,-.13,-.52],[.12,1.55,.12],palette.gold);
 m.box([1.48,-.34,.64],[.11,1.08,.11],palette.silver);
 m.cylinder([-.94,-1.12,.65],.18,.21,palette.steel,"y");
 return m.data();
}
function architecture(){
 const m=new Geometry();
 m.box([0,-1.69,0],[6.15,.18,4.25],palette.ink);
 m.box([0,-1.54,0],[5.35,.16,3.85],palette.terracotta);
 m.box([.15,1.43,-.20],[4.75,.22,3.1],palette.cream);
 m.box([-1.28,-.04,-.94],[.24,2.94,.23],palette.steel);
 m.box([1.64,-.04,-.94],[.24,2.94,.23],palette.steel);
 m.box([-1.28,-.04,1.02],[.24,2.94,.23],palette.steel);
 m.box([1.64,-.04,1.02],[.24,2.94,.23],palette.steel);
 // Glazing sits behind structural frame; no translucent overdraw.
 m.box([.23,-.09,-1.11],[2.64,2.75,.055],palette.glass);
 m.box([.20,-.09,-1.15],[.055,2.65,.07],palette.steel);
 m.box([.17,.51,-1.15],[2.51,.055,.07],palette.steel);
 m.box([-1.05,-.46,.45],[.25,1.48,.12],palette.wood);
 for(let i=0;i<10;i++)m.box([-1.2+i*.24,-.11,-1.19],[.045,2.50,.065],palette.wood);
 m.box([-.05,-1.32,1.17],[3.22,.14,1.1],palette.cream);
 for(let i=0;i<4;i++)m.box([.29,-1.45-i*.09,1.65+i*.21],[2.2,.065,.35],palette.steel);
 m.box([2.12,-.95,-.13],[.55,.67,1.0],palette.wood);
 m.box([-2.31,-1.38,1.22],[.31,.3,.6],palette.gold);
 m.cylinder([-2.31,-1.10,1.20],.31,.47,palette.wood,"y");
 return m.data();
}
function auto(){
 const m=new Geometry();
 m.box([0,-1.70,0],[6.6,.16,3.65],palette.ink);
 // Low-slung touring coupe with tapered silhouette and distinct cabin.
 m.polygonSide([[-2.32,-.77],[-2.43,-.39],[-2.19,-.08],[1.88,.01],[2.38,-.25],[2.44,-.71],[2.2,-.94],[-2.14,-.94]],-.91,.91,palette.silver);
 m.polygonSide([[-1.25,-.14],[-.54,.77],[.79,.79],[1.53,-.10]],-.74,.74,palette.steel);
 for(const z of [-.769,.769]){
   const windowColor=palette.glass;
   m.polygonSide([[-1.00,-.09],[-.39,.60],[.21,.61],[.21,-.09]],z-.012,z+.012,windowColor);
   m.polygonSide([[.32,-.09],[.33,.61],[.75,.61],[1.27,-.09]],z-.012,z+.012,windowColor);
   m.box([.26,-.08,z],[.075,.10,.045],palette.silver);
   m.box([-.48,-.17,z],[.20,.09,.11],palette.dark);
   m.box([1.64,-.21,z],[.48,.065,.055],palette.gold);
   m.box([-1.81,-.30,z],[.30,.075,.065],palette.red);
 }
 m.box([2.38,-.50,0],[.07,.18,1.39],palette.dark);
 m.box([2.422,-.45,0],[.05,.05,.98],palette.gold);
 m.box([-2.38,-.55,0],[.08,.24,1.30],palette.dark);
 m.box([.88,.08,0],[.028,.018,1.44],palette.steel);
 for(const x of [-1.50,1.55])for(const z of [-.92,.92]){
  m.cylinder([x,-.88,z],.49,.30,palette.tire,"z",24);
  m.cylinder([x,-.88,z+Math.sign(z)*.169],.31,.03,palette.steel,"z",24);
  m.cylinder([x,-.88,z+Math.sign(z)*.193],.13,.03,palette.dark,"z",18);
  for(let i=0;i<6;i++){
    const t=i*2*Math.PI/6;
    m.box([x+Math.cos(t)*.18,-.88+Math.sin(t)*.18,z+Math.sign(z)*.200],[.33,.052,.032],palette.silver,t);
  }
 }
 m.box([1.20,-.85,0],[.72,.13,2.10],palette.ink);
 return m.data();
}
export function makeWorldMesh(scene: "creative-studio"|"architecture-studio"|"auto-showroom"):Float32Array{
 switch(scene){case "creative-studio":return studio();case "architecture-studio":return architecture();default:return auto();}
}
