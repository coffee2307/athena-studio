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
  if (!apiKey || !recipient || !sender) return jsonError("Contact channel is not configured", 503);
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return jsonError("Origin not allowed", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return jsonError("JSON required", 415);
  const bodyText = await request.text();
  if (Buffer.byteLength(bodyText, "utf8") > MAX_BYTES) return jsonError("Request too large", 413);
  let data: Record<string, unknown>;
  try { data = JSON.parse(bodyText) as Record<string, unknown>; } catch { return jsonError("Invalid JSON", 400); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return jsonError("Invalid request", 400);
  if (data.website) return NextResponse.json({ ok: true });
  const name = validString(data.name, 100);
  const email = validString(data.email, 200);
  const company = validString(data.company ?? "", 120);
  const service = validString(data.service, 50);
  const message = validString(data.message, 4000);
  if (!name || !email || !company && data.company !== undefined && data.company !== "" || !service || !message ||
      name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !services.has(service) || message.length < 20) {
    return jsonError("Please check your form fields", 400);
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || "unknown";
  const now = Date.now();
  const previous = attempts.get(ip);
  const current = previous && now - previous.startedAt < WINDOW_MS ? previous : { count: 0, startedAt: now };
  if (current.count >= LIMIT) return jsonError("Rate limit reached", 429);
  current.count++;
  attempts.set(ip, current);
  if (attempts.size > 3000) for (const [key, entry] of attempts) if (now - entry.startedAt > WINDOW_MS) attempts.delete(key);

  const html = [
    "<h2>New Athena Studio inquiry</h2>",
    "<p><strong>Name:</strong> " + escapeHtml(name) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>",
    "<p><strong>Company:</strong> " + escapeHtml(company || "—") + "</p>",
    "<p><strong>Service:</strong> " + escapeHtml(service) + "</p>",
    "<p><strong>Message:</strong><br>" + escapeHtml(message).replace(/\n/g, "<br>") + "</p>",
  ].join("");

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: "Athena inquiry — " + service, html }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return jsonError("Message delivery unavailable", 502);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return jsonError("Message delivery unavailable", 502); }
}
