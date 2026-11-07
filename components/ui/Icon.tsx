import type {SVGProps} from "react";

type IconName="arrow-right"|"chevron-down"|"menu"|"x"|"user"|"phone"|"mail"|"message"|"copy"|"briefcase"|"check"|"shield"|"clock";
type Props=SVGProps<SVGSVGElement>&{name:IconName;size?:number};
const paths:Record<IconName,React.ReactNode>={
 "arrow-right":<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
 "chevron-down":<path d="m6 9 6 6 6-6"/>,
 "menu":<><path d="M4 8h16M4 16h16"/></>,
 "x":<path d="M5 5 19 19M19 5 5 19"/>,
 "user":<><circle cx="12" cy="8" r="3.4"/><path d="M4.7 20c.3-4.2 3-6.3 7.3-6.3s7 2.1 7.3 6.3"/></>,
 "phone":<path d="M7.3 3.5 4.6 5.8c-.7.6-.9 1.7-.4 3 2.2 6 6 9.8 12 12 1.3.5 2.4.3 3-.4l2.3-2.7-4.5-3.1-2 2c-3.1-1.4-5.3-3.6-6.7-6.7l2-2-3-4.4Z"/>,
 "mail":<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
 "message":<path d="M20 11a8 8 0 0 1-8 8 8.2 8.2 0 0 1-3-.5L4 20l1.5-5A8 8 0 1 1 20 11Z"/>,
 "copy":<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
 "briefcase":<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></>,
 "check":<path d="m5 12 4 4L19 6"/>,
 "shield":<><path d="m12 2 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10V6l9-4Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
 "clock":<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>
};
export function Icon({name,size=20,...props}:Props){
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
 stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
 aria-hidden="true" focusable="false" {...props}>{paths[name]}</svg>;
}
