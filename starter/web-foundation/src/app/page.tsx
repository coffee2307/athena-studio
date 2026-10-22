import {siteConfig} from "@/config/site";
import {presets} from "@/config/presets";
import {StarterHome} from "@/components/StarterHome";
export default function HomePage(){
 return <StarterHome name={siteConfig.name} preset={presets[siteConfig.variant]} modules={siteConfig.enabledModules} contactEmail={siteConfig.contactEmail}/>;
}
