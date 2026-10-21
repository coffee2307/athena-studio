import {siteConfig} from "@/lib/constants";

/** Enable outbound messenger links only after owner confirms account ownership
 * and tests the exact chat URL on desktop and mobile. */
const digits=siteConfig.phone.replace(/\D/g,"");
export const contactChannels={
 email:"mailto:"+siteConfig.email,
 phone:"tel:+84"+digits.slice(1),
 zalo:process.env.NEXT_PUBLIC_ATHENA_ZALO_VERIFIED==="true"?"https://zalo.me/"+digits:null,
 whatsapp:process.env.NEXT_PUBLIC_ATHENA_WHATSAPP_VERIFIED==="true"?"https://wa.me/84"+digits.slice(1):null
};
