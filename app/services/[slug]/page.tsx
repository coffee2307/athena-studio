import {permanentRedirect} from "next/navigation";
type Props={params:Promise<{slug:string}>};
export default async function OldService({params}:Props){const {slug}=await params;permanentRedirect("/dich-vu/"+encodeURIComponent(slug));}
