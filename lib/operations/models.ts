export const projectStatus={
 proposed:"Đề xuất",planning:"Đang lập kế hoạch",in_progress:"Đang triển khai",
 review:"Đang nghiệm thu",completed:"Hoàn thành",on_hold:"Tạm dừng"
} as const;
export const milestoneStatus={pending:"Chưa bắt đầu",in_progress:"Đang thực hiện",done:"Hoàn thành"} as const;
export const ticketStatus={new:"Mới",in_progress:"Đang xử lý",waiting_client:"Chờ khách hàng",closed:"Đã đóng"} as const;
export type ProjectStatus=keyof typeof projectStatus;
export type MilestoneStatus=keyof typeof milestoneStatus;
export type TicketStatus=keyof typeof ticketStatus;
export const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function safeUuid(value:FormDataEntryValue|null):string|null{
 if(typeof value!=="string"||!uuidPattern.test(value))return null;
 return value;
}
export function safeText(value:FormDataEntryValue|null,min:number,max:number){
 if(typeof value!=="string")return null;
 const text=value.trim();
 if(text.length<min||text.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))return null;
 return text;
}
export function allowedState<T extends Record<string,string>>(value:FormDataEntryValue|null,mapping:T):keyof T|null{
 return typeof value==="string"&&Object.prototype.hasOwnProperty.call(mapping,value)?value as keyof T:null;
}
export function safeDate(value:FormDataEntryValue|null):string|null{
 if(value===null||value==="")return null;
 if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const date=new Date(value+"T00:00:00.000Z");
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?value:null;
}
export function formatDate(value:string|null|undefined){
 if(!value)return "Chưa xác định";
 const date=new Date(value.length===10?value+"T00:00:00.000Z":value);
 return Number.isFinite(date.getTime())?new Intl.DateTimeFormat("vi-VN",{timeZone:"UTC",day:"2-digit",month:"2-digit",year:"numeric"}).format(date):"Chưa xác định";
}
export function messageFromNotice(notice:string|undefined){
 const map:Record<string,string>={
  created:"Đã ghi nhận dữ liệu trong hệ thống.",updated:"Đã lưu trạng thái mới.",
  sent:"Tin nhắn đã được ghi nhận.",uploaded:"Tài liệu đã được lưu vào kho riêng tư.",
  read:"Đã đánh dấu thông báo là đã đọc.",invalid:"Thông tin nhập chưa hợp lệ.",
  error:"Không thể hoàn tất thao tác. Vui lòng thử lại hoặc liên hệ Athena.",
  unavailable:"Chức năng chưa được kích hoạt hoặc không có quyền truy cập."
 };
 return notice&&map[notice]||"";
}
