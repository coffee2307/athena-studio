import {Icon} from "@/components/ui/Icon";
import {contactChannels} from "@/lib/contact-channels";

function WhatsAppMark(){
 return <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
  <path d="M20.2 11.6a8.3 8.3 0 0 1-12 7.4L3.4 20.5l1.5-4.7a8.3 8.3 0 1 1 15.3-4.2Z"/>
  <path d="M9.2 8.2c-.5-.7-1.2-.4-1.5.2-.9 1.9 2.8 6.1 6.1 7.3 1.1.4 2.1.2 2.6-.7l-2.3-1.4-1.2 1c-1.6-.7-2.7-1.8-3.4-3.4l1-1.1-1.3-1.9Z"/>
 </svg>;
}
export function ContactDock(){
 return <nav className="agency-contact-dock" aria-label="Liên hệ nhanh">
  <a className="agency-contact-action agency-contact-action-phone" href={contactChannels.phone} aria-label="Gọi điện trực tiếp cho Athena">
   <Icon name="phone" size={22}/><span>Gọi ngay</span>
  </a>
  <a className="agency-contact-action agency-contact-action-whatsapp" href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Mở WhatsApp với số liên hệ Athena">
   <WhatsAppMark/><span>WhatsApp</span>
  </a>
  <a className="agency-contact-action agency-contact-action-zalo" href={contactChannels.zalo} target="_blank" rel="noopener noreferrer" aria-label="Mở Zalo với số liên hệ Athena">
   <b className="agency-zalo-mark" aria-hidden="true">zalo</b><span>Zalo</span>
  </a>
 </nav>;
}
