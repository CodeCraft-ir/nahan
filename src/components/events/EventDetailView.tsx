"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { EventItemDetail } from "@/lib/types";

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

type RegisterState = "idle" | "form" | "loading" | "success" | "error";

function RegisterForm({ eventId, onSuccess }: { eventId: string; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<RegisterState>("form");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const data = await res.json();

      if (data.success) {
        setState("success");
        onSuccess();
      } else {
        setErrorMsg(data.message ?? "خطایی رخ داد.");
        setState("error");
      }
    } catch {
      setErrorMsg("خطا در ارتباط با سرور.");
      setState("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1" dir="rtl">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">نام و نام خانوادگی *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="علی محمدی"
          className="rounded-lg border border-white/10 bg-narhan-card px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-narhan-accent/60 focus:ring-1 focus:ring-narhan-accent/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">شماره موبایل *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="09123456789"
          dir="ltr"
          className="rounded-lg border border-white/10 bg-narhan-card px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-narhan-accent/60 focus:ring-1 focus:ring-narhan-accent/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">ایمیل (اختیاری)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          dir="ltr"
          className="rounded-lg border border-white/10 bg-narhan-card px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-narhan-accent/60 focus:ring-1 focus:ring-narhan-accent/30"
        />
      </div>

      {state === "error" && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-center text-xs text-red-400">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-1 flex w-full items-center justify-center rounded-xl bg-narhan-accent py-3.5 text-sm font-semibold text-narhan-charcoal transition hover:bg-narhan-accent-hover active:scale-95 disabled:opacity-60"
      >
        {state === "loading" ? "در حال ارسال..." : "تأیید ثبت‌نام"}
      </button>
    </form>
  );
}

interface Props {
  event: EventItemDetail;
}

export function EventDetailView({ event }: Props) {
  const [registerState, setRegisterState] = useState<RegisterState>("idle");
  const [registered, setRegistered] = useState(event.registered ?? 0);

  const spotsLeft = event.capacity != null
    ? event.capacity - registered
    : null;
  const fillPercent = event.capacity
    ? Math.min(100, Math.round((registered / event.capacity) * 100))
    : null;
  const isFull = spotsLeft === 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Image */}
      <div className="relative w-full" style={{ height: "55vw", maxHeight: 320, minHeight: 220 }}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 412px"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-narhan-card to-narhan-panel" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-narhan-charcoal via-narhan-charcoal/20 to-transparent" />

        <Link
          href="/events"
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-narhan-charcoal/60 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm transition hover:bg-narhan-charcoal/80"
        >
          <BackIcon />
          <span>رویدادها</span>
        </Link>

        <span
          className="absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: "rgba(200,162,124,0.18)", color: "#c8a27c", border: "1px solid rgba(200,162,124,0.3)" }}
        >
          {event.categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-5 px-5 pb-10 pt-5">
        <h1 className="text-xl font-bold leading-snug text-white">{event.title}</h1>

        {/* Meta */}
        <div className="flex flex-col gap-3">
          {event.date && (
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="text-narhan-accent"><CalendarIcon /></span>
              <span>{event.date}</span>
            </div>
          )}
          {event.time && (
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="text-narhan-accent"><ClockIcon /></span>
              <span>{event.time}</span>
            </div>
          )}
          {event.capacity != null && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="text-narhan-accent"><UsersIcon /></span>
                <span>{registered} نفر ثبت‌نام از {event.capacity} ظرفیت</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-narhan-accent transition-all"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              {!isFull && spotsLeft !== null && (
                <p className="text-xs text-narhan-muted">{spotsLeft} جای خالی باقی مانده</p>
              )}
              {isFull && <p className="text-xs text-red-400">ظرفیت تکمیل شده</p>}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* Description */}
        {event.description ? (
          <div
            className="text-sm leading-loose text-white/75"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        ) : (
          <p className="text-sm leading-loose text-white/50">توضیحاتی برای این رویداد ثبت نشده است.</p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          {registerState === "success" ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-narhan-accent/30 bg-narhan-accent/10 px-4 py-6 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c8a27c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm font-semibold text-narhan-accent">ثبت‌نام شما با موفقیت انجام شد!</p>
              <p className="text-xs text-white/50">از شرکت شما در این رویداد سپاسگزاریم.</p>
            </div>
          ) : isFull ? (
            <div className="rounded-xl bg-white/5 py-3.5 text-center text-sm text-white/40">
              ظرفیت تکمیل است
            </div>
          ) : registerState === "form" || registerState === "loading" || registerState === "error" ? (
            <RegisterForm
              eventId={event.id}
              onSuccess={() => { setRegisterState("success"); setRegistered((r) => r + 1); }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setRegisterState("form")}
              className="flex w-full items-center justify-center rounded-xl bg-narhan-accent py-3.5 text-sm font-semibold text-narhan-charcoal transition hover:bg-narhan-accent-hover active:scale-95"
            >
              ثبت‌نام در رویداد
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
