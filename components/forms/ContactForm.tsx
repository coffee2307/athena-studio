"use client";

import { FormEvent, useEffect, useState } from "react";

type Props = { configured: boolean; contactEmail: string };
type State = "idle" | "sending" | "success" | "error";

export function ContactForm({ configured, contactEmail }: Props) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("service");
    if (selected && ["web-development", "website-care", "ai-integration", "micro-saas", "other"].includes(selected)) setService(selected);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || state === "sending") return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      if (!response.ok) throw new Error(response.status === 429 ? "Bạn đã gửi nhiều yêu cầu. Hãy thử lại sau." : "Không thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp.");
      form.reset();
      setState("success");
      setMessage("Đã tiếp nhận yêu cầu. Athena sẽ liên hệ khi có thể.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi yêu cầu.");
    }
  }

  return <div className="contact-box">
    <p className="small-index">PROJECT INQUIRY / ATHENA</p>
    <h2>Tell us what<br /><em>you&apos;re building.</em></h2>
    <p>Gửi mô tả ngắn về dự án hoặc vấn đề bạn muốn giải quyết. Không gửi mật khẩu, API key hay dữ liệu nhạy cảm.</p>
    {configured ? <form className="inquiry-form" onSubmit={submit} noValidate={false}>
      <div className="field-pair"><label>Họ tên <span>*</span><input name="name" required maxLength={100} autoComplete="name" placeholder="Tên của bạn" /></label><label>Email <span>*</span><input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="email@example.com" /></label></div>
      <label>Tổ chức / doanh nghiệp<input name="company" maxLength={120} autoComplete="organization" placeholder="Không bắt buộc" /></label>
      <label>Giải pháp quan tâm <span>*</span><select name="service" value={service} onChange={(event) => setService(event.target.value)} required><option value="" disabled>Chọn một dịch vụ</option><option value="web-development">Thiết kế website</option><option value="website-care">Website Care</option><option value="ai-integration">Tích hợp AI</option><option value="micro-saas">Micro-SaaS / Product Lab</option><option value="other">Chưa xác định</option></select></label>
      <label>Mô tả dự án <span>*</span><textarea name="message" required rows={5} minLength={20} maxLength={4000} placeholder="Bạn đang muốn xây dựng hoặc cải thiện điều gì?" /></label>
      <div className="trap-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" className="pill-link pill-dark form-submit" disabled={state === "sending"}>{state === "sending" ? "Đang gửi..." : "Gửi yêu cầu"} <span aria-hidden="true">↗</span></button>
      <p className="form-privacy">Thông tin chỉ được sử dụng để phản hồi yêu cầu và trao đổi về dự án.</p>
      {message && <p role={state === "error" ? "alert" : "status"} className={state === "error" ? "form-status form-error" : "form-status"}>{message}</p>}
    </form> : <div className="form-offline" role="status"><strong>Biểu mẫu đang được cấu hình.</strong><p>Hệ thống tiếp nhận yêu cầu chưa được kết nối với dịch vụ gửi email. Chúng tôi không hiển thị một biểu mẫu gửi giả khi chưa thể tiếp nhận dữ liệu.</p>{contactEmail && <a className="pill-link pill-dark" href={"mailto:" + contactEmail}>Gửi email trực tiếp <span aria-hidden="true">↗</span></a>}</div>}
    <p className="contact-notice">Nếu yêu cầu liên quan đến website đang hoạt động, vui lòng nêu nền tảng (Shopify, WordPress, Next.js…) và mục tiêu ưu tiên.</p>
  </div>;
}
