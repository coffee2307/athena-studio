import {briefBudgets,briefTimelines} from "@/lib/project-brief";
export function ProjectBriefFields(){
 return <fieldset className="athena-project-brief"><legend>Thông tin dự án — không bắt buộc</legend>
  <label>Mục tiêu chính<input name="projectGoal" maxLength={600} placeholder="Ví dụ: giới thiệu portfolio và nhận yêu cầu tư vấn"/></label>
  <div className="field-pair"><label>Ngân sách dự kiến<select name="budget" defaultValue=""><option value="">Chưa xác định</option>{briefBudgets.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>Thời gian mong muốn<select name="timeline" defaultValue=""><option value="">Chưa xác định</option>{briefTimelines.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label></div>
  <p className="brief-help">Thông tin để định hướng trao đổi, chưa phải báo giá hoặc cam kết lịch bàn giao.</p>
 </fieldset>;
}
