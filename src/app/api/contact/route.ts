import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  business: string;
  monthlyRevenue: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 15000;

export async function GET() {
  return NextResponse.json(
    {
      message:
        "This is the HHG contact API endpoint. Submit the form at /#contact; this endpoint accepts POST requests.",
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}

function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rows(payload: ContactPayload) {
  return [
    ["Name", payload.name],
    ["Business", payload.business || "Not provided"],
    ["Monthly revenue", payload.monthlyRevenue],
    ["Email", payload.email],
    ["Phone", payload.phone || "Not provided"],
    ["Interest", payload.interest],
    ["Message", payload.message || "Not provided"],
  ];
}

function notificationHtml(payload: ContactPayload) {
  const bodyRows = rows(payload)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-size:13px;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:13px;">${escapeHtml(value).replace(/\n/g, "<br />")}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <h1 style="font-size:20px;margin:0 0 12px;">New HHG website inquiry</h1>
      <p style="margin:0 0 16px;color:#475569;">A visitor submitted the contact form on heardhospitalitygroup.com.</p>
      <table style="border-collapse:collapse;width:100%;max-width:680px;border:1px solid #e5e7eb;">
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;
}

function notificationText(payload: ContactPayload) {
  return rows(payload)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function autoresponderHtml(payload: ContactPayload) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <p>${escapeHtml(payload.name)},</p>
      <p>Received. Thanks for reaching out to Heard Hospitality Group.</p>
      <p>I saw your note about <strong>${escapeHtml(payload.interest)}</strong>. I will review the context and reply directly.</p>
      <p style="margin-top:24px;">- Paolo<br />Heard Hospitality Group</p>
    </div>`;
}

async function sendResendEmail(input: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Resend send failed (${response.status}): ${details}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    const body = await request.json();
    payload = {
      name: str(body?.name),
      business: str(body?.business),
      monthlyRevenue: str(body?.monthlyRevenue),
      email: str(body?.email).toLowerCase(),
      phone: str(body?.phone),
      interest: str(body?.interest),
      message: str(body?.message),
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.name || !payload.email || !payload.monthlyRevenue || !payload.interest) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isEmail(payload.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Server is missing RESEND_API_KEY" }, { status: 500 });
  }

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    return NextResponse.json({ error: "Server is missing RESEND_FROM_EMAIL" }, { status: 500 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "info@heardhospitalitygroup.com";
  const submissionId = randomUUID();

  try {
    await sendResendEmail({
      from,
      to,
      subject: `New HHG inquiry: ${payload.interest}`,
      html: notificationHtml(payload),
      text: notificationText(payload),
      replyTo: payload.email,
      idempotencyKey: `hhg-contact-notify:${submissionId}`,
    });

    if (process.env.CONTACT_AUTOREPLY_ENABLED !== "false") {
      await sendResendEmail({
        from: process.env.CONTACT_AUTOREPLY_FROM_EMAIL || from,
        to: payload.email,
        subject: "Received - Heard Hospitality Group",
        html: autoresponderHtml(payload),
        text: `${payload.name},\n\nReceived. Thanks for reaching out to Heard Hospitality Group.\n\nI saw your note about ${payload.interest}. I will review the context and reply directly.\n\n- Paolo\nHeard Hospitality Group`,
        replyTo: to,
        idempotencyKey: `hhg-contact-autoreply:${submissionId}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error(message);
    return NextResponse.json({ error: "Email send failed" }, { status: 502 });
  }
}
