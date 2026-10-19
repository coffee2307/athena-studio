import type { MetadataRoute } from "next";
export default function manifest():MetadataRoute.Manifest{
 return {name:"Athena Studio",short_name:"Athena",description:"Studio thiết kế và công nghệ độc lập.",start_url:"/",display:"standalone",background_color:"#ffffff",theme_color:"#ffffff",lang:"vi",icons:[{src:"/android-chrome-192x192.png",sizes:"192x192",type:"image/png"},{src:"/android-chrome-512x512.png",sizes:"512x512",type:"image/png"},{src:"/branding/favicon.svg",sizes:"any",type:"image/svg+xml"}]};
}
