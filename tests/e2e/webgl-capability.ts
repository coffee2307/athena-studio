import type {Page} from "@playwright/test";

// Probe the browser running the test, not the CI host's nominal GPU.
// A supported WebGL2 browser must render the model; an unsupported browser
// must provide the documented photograph fallback instead.
export async function supportsWebGL2(page:Page){
 return page.evaluate(()=>{
  try{
   const context=document.createElement("canvas").getContext("webgl2");
   context?.getExtension("WEBGL_lose_context")?.loseContext();
   return context!==null;
  }catch{return false;}
 });
}
