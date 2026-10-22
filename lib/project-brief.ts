export const briefBudgets=[{value:"discuss",label:"Cần tư vấn"},{value:"under-10m",label:"Dưới 10 triệu đồng"},{value:"10-30m",label:"10–30 triệu đồng"},{value:"over-30m",label:"Trên 30 triệu đồng"}] as const;
export const briefTimelines=[{value:"flexible",label:"Linh hoạt"},{value:"1-month",label:"Trong khoảng 1 tháng"},{value:"1-3-months",label:"Trong 1–3 tháng"},{value:"discuss",label:"Cần trao đổi thêm"}] as const;
export type ProjectBriefFields={template?:string;templateSlug?:string;templateVersion?:string;projectGoal?:string;budget?:string;timeline?:string};
function optional(value:string|undefined,max:number){
 if(value===undefined)return "";
 if(typeof value!=="string"||value.length>max||/[\u0000-\u001f\u007f]/.test(value))throw Error("Thông tin dự án không hợp lệ.");
 return value.trim();
}
export function formatProjectBrief(fields:ProjectBriefFields){
 const template=optional(fields.template,120),slug=optional(fields.templateSlug,80),version=optional(fields.templateVersion,30),goal=optional(fields.projectGoal,600);
 const budget=optional(fields.budget,30),timeline=optional(fields.timeline,30);
 const budgetLabel=budget?briefBudgets.find(item=>item.value===budget)?.label:"";
 const timelineLabel=timeline?briefTimelines.find(item=>item.value===timeline)?.label:"";
 if((budget&&!budgetLabel)||(timeline&&!timelineLabel))throw Error("Vui lòng chọn ngân sách và thời gian trong danh sách.");
 if((slug&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))||(version&&!/^\d+\.\d+\.\d+$/.test(version))||((slug||version)&&!template))throw Error("Thông tin mẫu website không hợp lệ.");
 return [
  ...(template?["Mẫu website tham khảo: "+template+([slug,version&&"v"+version].filter(Boolean).length?" ("+[slug,version&&"v"+version].filter(Boolean).join(" · ")+")":"")]:[]),
  ...(goal?["Mục tiêu chính: "+goal]:[]),
  ...(budgetLabel?["Ngân sách dự kiến: "+budgetLabel+" (chưa phải báo giá)"]:[]),
  ...(timelineLabel?["Thời gian mong muốn: "+timelineLabel]:[])
 ];
}
export function composeInquiryMessage(message:string,fields:ProjectBriefFields={}){
 const text=message.trim();
 if(text.length<20||text.length>4000)throw Error("Vui lòng mô tả vấn đề từ 20 đến 4.000 ký tự.");
 const lines=formatProjectBrief(fields);
 const result=lines.length?[...lines,"","Vấn đề và mục tiêu:",text].join("\n"):text;
 if(result.length>4000)throw Error("Nội dung quá dài sau khi thêm thông tin dự án. Vui lòng rút gọn để tổng nội dung không vượt 4.000 ký tự.");
 return result;
}
export function briefFieldsFromForm(data:FormData){
 return {projectGoal:String(data.get("projectGoal")||""),budget:String(data.get("budget")||""),timeline:String(data.get("timeline")||"")};
}
