import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const services = new Set(["web-development", "website-care", "ai-integration", "micro-saas", "other"]);
const attempts = new Map<string, { count: number; startedAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 3;
const MAX_BYTES = 12_000;

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}
function validString(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length <= max ? value.trim() : null;
}
function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) return jsonError("Kênh liên hệ chưa được cấu hình", 503);
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return jsonError("Nguồn yêu cầu không được phép", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return jsonError("Yêu cầu định dạng JSON", 415);
  const bodyText = await request.text();
  if (Buffer.byteLength(bodyText, "utf8") > MAX_BYTES) return jsonError("Dữ liệu yêu cầu vượt giới hạn", 413);
  let data: Record<string, unknown>;
  try { data = JSON.parse(bodyText) as Record<string, unknown>; } catch { return jsonError("Dữ liệu JSON không hợp lệ", 400); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return jsonError("Yêu cầu không hợp lệ", 400);
  if (data.website) return NextResponse.json({ ok: true });
  const name = validString(data.name, 100);
  const email = validString(data.email, 200);
  const company = validString(data.company ?? "", 120);
  const service = validString(data.service, 50);
  const message = validString(data.message, 4000);
  if (!name || !email || !company && data.company !== undefined && data.company !== "" || !service || !message ||
      name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !services.has(service) || message.length < 20) {
    return jsonError("Vui lòng kiểm tra lại thông tin biểu mẫu", 400);
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || "unknown";
  const now = Date.now();
  const previous = attempts.get(ip);
  const current = previous && now - previous.startedAt < WINDOW_MS ? previous : { count: 0, startedAt: now };
  if (current.count >= LIMIT) return jsonError("Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau", 429);
  current.count++;
  attempts.set(ip, current);
  if (attempts.size > 3000) for (const [key, entry] of attempts) if (now - entry.startedAt > WINDOW_MS) attempts.delete(key);

  const html = [
    "<h2>Yêu cầu tư vấn mới — Athena Studio</h2>",
    "<p><strong>Họ tên:</strong> " + escapeHtml(name) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>",
    "<p><strong>Đơn vị:</strong> " + escapeHtml(company || "—") + "</p>",
    "<p><strong>Dịch vụ:</strong> " + escapeHtml(service) + "</p>",
    "<p><strong>Nội dung:</strong><br>" + escapeHtml(message).replace(/\n/g, "<br>") + "</p>",
  ].join("");

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: "Yêu cầu tư vấn Athena — " + service, html }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return jsonError("Dịch vụ gửi email hiện không khả dụng", 502);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return jsonError("Dịch vụ gửi email hiện không khả dụng", 502); }
}
