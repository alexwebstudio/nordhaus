"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPhone, nextPhone } from "@/lib/phone";
import { Icon } from "@/components/ui/Icon";

export function ContactForm() {
  const t = useTranslations("contacts");
  const tf = useTranslations("form");
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const nameErr = name.trim().length < 2 ? tf("nameError") : null;
  const phoneErr = phone.length !== 11 ? tf("phoneError") : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameErr || phoneErr) {
      document.getElementById(nameErr ? `${uid}-n` : `${uid}-p`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: "+" + phone, contact: "call", source: "contacts", message: msg.slice(0, 1000) }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex h-full flex-col items-start justify-center rounded-[var(--radius-card)] bg-white p-8" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-ink text-wood-light">
          <Icon name="check" className="size-7" />
        </span>
        <p className="mt-6 text-[26px] font-medium tracking-[-0.02em]">{t("thanks", { name: name.trim() })}</p>
        <p className="mt-2 text-muted">{t("thanksText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(20,21,24,.2)] md:p-8">
      <p className="text-[22px] font-medium tracking-[-0.02em]">{t("formTitle")}</p>
      <p className="-mt-2 text-[14px] text-muted">{t("formLead")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-n`} className="mb-2 block text-[13px] text-muted">{tf("name")}</label>
          <input id={`${uid}-n`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="quiz-input" aria-invalid={touched && !!nameErr} aria-describedby={touched && nameErr ? `${uid}-ne` : undefined} />
          {touched && nameErr && <p id={`${uid}-ne`} className="mt-1.5 text-[12px] text-[#c0392b]">{nameErr}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-p`} className="mb-2 block text-[13px] text-muted">{tf("phone")}</label>
          <input
            id={`${uid}-p`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={formatPhone(phone)}
            onFocus={() => !phone && setPhone("7")}
            onBlur={() => phone === "7" && setPhone("")}
            onChange={(e) => setPhone(nextPhone(phone, e.target.value))}
            className="quiz-input"
            aria-invalid={touched && !!phoneErr}
            aria-describedby={touched && phoneErr ? `${uid}-pe` : undefined}
          />
          {touched && phoneErr && <p id={`${uid}-pe`} className="mt-1.5 text-[12px] text-[#c0392b]">{phoneErr}</p>}
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-m`} className="mb-2 block text-[13px] text-muted">{t("question")}</label>
        <textarea id={`${uid}-m`} value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="quiz-input h-auto resize-none py-3" placeholder={t("questionPlaceholder")} />
      </div>
      <button type="submit" disabled={state === "sending"} className="mt-2 h-14 rounded-full bg-ink text-[15px] font-medium text-white transition-colors hover:bg-dark disabled:opacity-70">
        {state === "sending" ? t("sending") : t("send")}
      </button>
      {state === "error" && (
        <p role="alert" className="text-[13px] text-[#c0392b]">
          {t("error")}
        </p>
      )}
      <p className="text-[12px] text-muted">{tf("consent")}</p>
    </form>
  );
}
