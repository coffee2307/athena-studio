import {redirect} from "next/navigation";

/** The original Vite/React/Three.js website is hosted verbatim under /immersive.
 * No Athena chrome, no nested iframe, no reconstruction of the upstream UI.
 * The gallery iframe points directly to the same static website. */
export default function DigitalCreatorsDemo(){
 redirect("/immersive/digital-creators/index.html");
}
