import { NextResponse } from "next/server";

/**
 * Приём заявки из квиза. Бэкенда нет — заглушка.
 * TODO: отправка в Telegram-бота: POST https://api.telegram.org/bot<TOKEN>/sendMessage
 *       (TOKEN и CHAT_ID — в переменных окружения Vercel, не в коде).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const b = body as { name?: unknown; phone?: unknown; contact?: unknown };
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 80) : "";
  const phone = typeof b.phone === "string" ? b.phone : "";
  const contact = ["whatsapp", "telegram", "call"].includes(String(b.contact)) ? String(b.contact) : "call";

  if (name.length < 2 || !/^\+7\d{10}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  console.log("[lead]", { name, phone, contact, payload: body });
  return NextResponse.json({ ok: true });
}
