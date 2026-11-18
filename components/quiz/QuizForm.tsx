"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { estimate, type Answers } from "@/data/quiz";
import { formatPrice } from "@/data/catalog";
import { site } from "@/config/site";
import { FRAME } from "@/components/ui/houseFrame";
import { Icon } from "@/components/ui/Icon";
import { useChips } from "./QuizPreview";
import { formatPhone, nextPhone } from "@/lib/phone";

const CONTACTS = [
  { value: "whatsapp", icon: "whatsapp" },
  { value: "telegram", icon: "telegram" },
  { value: "call", icon: "phone" },
] as const;
type Contact = (typeof CONTACTS)[number]["value"];

/** «120 м², 2 этажа, 3 спальни» + цена и срок — на языке страницы */
export function useSummary(a: Answers) {
  const t = useTranslations();
  const { price, days } = estimate(a);
  const floors = a.floors === 1 ? t("common.floors.f1") : a.floors === 2 ? t("common.floors.f2") : a.floors === 1.5 ? t("common.floors.f15") : null;
  const beds = a.bedrooms ? t("common.bedrooms", { count: a.bedrooms }) : null;
  return { head: [`${a.area} ${t("common.m2")}`, floors, beds].filter(Boolean).join(", "), price: formatPrice(price), days };
}

export function QuizForm({
  answers,
  onSuccess,
}: {
  answers: Answers;
  onSuccess: (contact: Contact, name: string) => void;
}) {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState<Contact>("whatsapp");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const t = useTranslations("quiz");
  const tf = useTranslations("form");
  const chips = useChips(answers);
  const s = useSummary(answers);

  const nameErr = name.trim().length < 2 ? tf("nameError") : null;
  const phoneErr = phone.length !== 11 ? tf("phoneError") : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameErr || phoneErr) {
      document.getElementById(nameErr ? `${uid}-name` : `${uid}-phone`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: "+" + phone, contact, answers, estimate: estimate(answers) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSuccess(contact, name.trim());
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_50px_-30px_rgba(20,21,24,.35)]">
        <p className="text-[13px] text-muted">{t("summaryLabel")}</p>
        <p className="mt-1 text-[clamp(20px,2.2vw,26px)] leading-tight font-medium tracking-[-0.02em]">
          {t("summary", { head: s.head, price: s.price, days: s.days })}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <li key={c} className="rounded-full bg-bg px-2.5 py-1 text-[12px] text-ink/70">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-4 rounded-[20px] bg-[linear-gradient(135deg,#B07A4F,#8C603E)] p-4 text-white">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15">
          <Icon name="gift" className="size-5" />
        </span>
        <p className="text-[14px] leading-snug">
          <span className="font-medium">{t("giftLabel")}</span> {t("gift")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={`${uid}-name`} label={tf("name")} error={touched ? nameErr : null}>
          <input
            id={`${uid}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder={tf("namePlaceholder")}
            aria-invalid={touched && !!nameErr}
            aria-describedby={touched && nameErr ? `${uid}-name-err` : undefined}
            className="quiz-input"
          />
        </Field>
        <Field id={`${uid}-phone`} label={tf("phone")} error={touched ? phoneErr : null}>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={formatPhone(phone)}
            onFocus={() => !phone && setPhone("7")}
            onBlur={() => phone === "7" && setPhone("")}
            onChange={(e) => setPhone(nextPhone(phone, e.target.value))}
            aria-invalid={touched && !!phoneErr}
            aria-describedby={touched && phoneErr ? `${uid}-phone-err` : undefined}
            className="quiz-input"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-[13px] text-muted">{t("contactLegend")}</legend>
        <div className="grid grid-cols-3 gap-2">
          {CONTACTS.map((c) => (
            <label
              key={c.value}
              className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full text-[14px] font-medium transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                contact === c.value ? "bg-ink text-white" : "bg-white/70 text-ink ring-1 ring-ink/10 hover:bg-white"
              }`}
            >
              <input
                type="radio"
                name={`${uid}-contact`}
                value={c.value}
                checked={contact === c.value}
                onChange={() => setContact(c.value)}
                className="sr-only"
              />
              <Icon name={c.icon} className="size-4" />
              <span className="max-sm:text-[13px]">{t(`contacts.${c.value}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="group flex h-14 w-full items-center justify-between rounded-full bg-ink pr-2 pl-7 text-[15px] font-medium text-white transition-colors hover:bg-dark disabled:opacity-70"
        >
          {state === "sending" ? t("sending") : t("submit")}
          <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-rotate-45">
            <Icon name="arrowUpRight" className="size-4 rotate-45" />
          </span>
        </button>
        {state === "error" && (
          <p role="alert" className="mt-3 text-[13px] text-[#c0392b]">
            {t("error")}
          </p>
        )}
        <p className="mt-3 text-[12px] leading-snug text-muted">
          {t("consent")}
        </p>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error: string | null; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[12px] text-[#c0392b]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- экран успеха: дом «собирается» из линий ---------- */
export function QuizSuccess({
  answers,
  contact,
  name,
  onClose,
}: {
  answers: Answers;
  contact: Contact;
  name: string;
  onClose: () => void;
}) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(t);
  }, []);
  const t = useTranslations("quiz");
  const s = useSummary(answers);
  const where = t(contact === "call" ? "success.whereCall" : contact === "whatsapp" ? "success.whereWhatsapp" : "success.whereTelegram");
  const wa = `${site.whatsapp}?text=${encodeURIComponent(t("success.waMessage", { head: s.head, price: s.price }))}`;

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
      <svg viewBox="0 0 480 320" className="w-[min(78%,380px)]" fill="none" aria-hidden>
        <path
          d="M70 270V158L240 40L410 158V270Z"
          fill="#B07A4F"
          className="transition-opacity duration-700"
          style={{ opacity: drawn ? 0.14 : 0, transitionDelay: "1.5s" }}
        />
        {FRAME.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength={1}
            strokeDasharray="1 1"
            stroke={p.group === 4 || p.group === 5 ? "#B07A4F" : "#141518"}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDashoffset: drawn ? 0 : 1,
              transition: `stroke-dashoffset .7s cubic-bezier(.65,0,.35,1) ${0.1 + p.group * 0.2 + i * 0.02}s`,
            }}
          />
        ))}
      </svg>
      <h2 id="quiz-title" tabIndex={-1} className="mt-8 text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-medium tracking-[-0.03em] outline-none">
        {name ? t("success.title", { name }) : t("success.titleNoName")}
      </h2>
      <p className="mt-4 max-w-[30em] text-[16px] leading-relaxed text-muted">
        {t("success.text", { where, head: s.head })}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1f9d55] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#178a49]"
        >
          <Icon name="whatsapp" className="size-5" />
          {t("success.whatsapp")}
        </a>
        <button type="button" onClick={onClose} className="h-12 rounded-full px-6 text-[15px] font-medium ring-1 ring-ink/15 hover:bg-white">
          {t("success.back")}
        </button>
      </div>
    </div>
  );
}
