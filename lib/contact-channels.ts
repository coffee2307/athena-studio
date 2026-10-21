import {siteConfig} from "@/lib/constants";

const digits=siteConfig.phone.replace(/\D/g,"");
const international="84"+digits.replace(/^0/,"");
export const contactChannels={
 email:"mailto:"+siteConfig.email,
 phone:"tel:+"+international,
 // These URLs open the provider's official chat flow for the public contact number.
 // Account registration and recipient delivery still require owner confirmation.
 zalo:"https://zalo.me/"+digits,
 whatsapp:"https://wa.me/"+international
};
export const consultationEmail=contactChannels.email+"?subject="+encodeURIComponent("Yêu cầu tư vấn Athena Studio")+
 "&body="+encodeURIComponent("Xin chào Athena,\n\nTôi đang cần hỗ trợ về:\n\nWebsite hiện tại (nếu có):\n\nMục tiêu và thời hạn dự kiến:\n\nTên / số liên hệ:\n");
