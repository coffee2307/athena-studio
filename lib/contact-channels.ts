import {siteConfig} from "@/lib/constants";
const digits=siteConfig.phone.replace(/\D/g,"");
const international="84"+digits.replace(/^0/,"");
const emailSubject="Yêu cầu tư vấn Athena Studio";
const emailBody="Xin chào Athena,\n\n1. Website hiện tại (nếu có):\n\n2. Vấn đề cần giải quyết:\n\n3. Mục tiêu ưu tiên và thời hạn dự kiến:\n\n4. Họ tên / số điện thoại liên hệ:\n\n";
export const contactChannels={
 email:"mailto:"+siteConfig.email,
 phone:"tel:+"+international,
 zalo:"https://zalo.me/"+digits,
 whatsapp:"https://wa.me/"+international
};
export const consultationText="Đến: "+siteConfig.email+"\nChủ đề: "+emailSubject+"\n\n"+emailBody;
export const consultationEmail=contactChannels.email+"?subject="+encodeURIComponent(emailSubject)+"&body="+encodeURIComponent(emailBody);
export const consultationGmail="https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(siteConfig.email)+"&su="+encodeURIComponent(emailSubject)+"&body="+encodeURIComponent(emailBody);
export const consultationOutlook="https://outlook.live.com/mail/0/deeplink/compose?to="+encodeURIComponent(siteConfig.email)+"&subject="+encodeURIComponent(emailSubject)+"&body="+encodeURIComponent(emailBody);
export function showContactDialog(channel:"email"|"phone"|"zalo"|"whatsapp"="email"){
 if(typeof window!=="undefined")window.dispatchEvent(new CustomEvent("athena:open-contact",{detail:{channel}}));
}
