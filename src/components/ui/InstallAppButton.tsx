"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallState =
  | "loading"
  | "standalone"
  | "android"
  | "ios"
  | "unsupported";

export function InstallAppButton() {
  const [state, setState] = useState<InstallState>("loading");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      setState("standalone");
      return;
    }

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);

    if (isIOS) {
      setState("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState("android");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setState("standalone"));

    const timer = setTimeout(() => {
      setState((prev) => (prev === "loading" ? "unsupported" : prev));
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (state === "ios") {
      setShowIOSHint((v) => !v);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setState("standalone");
    setDeferredPrompt(null);
  };

  if (state === "standalone" || state === "unsupported" || state === "loading" || dismissed) {
    return null;
  }

  return (
    <div className="relative px-4 pb-6 pt-2">
      {showIOSHint && state === "ios" && (
        <div className="mb-3 rounded-xl border border-white/10 bg-narhan-panel px-4 py-3 text-center text-xs leading-loose text-white/80">
          برای نصب، دکمه{" "}
          <span className="inline-block rounded bg-white/10 px-1.5 py-0.5 font-semibold text-white">
            Share ⎙
          </span>{" "}
          را بزنید، سپس{" "}
          <span className="font-semibold text-narhan-accent">Add to Home Screen</span>{" "}
          را انتخاب کنید.
        </div>
      )}

      <div className="relative flex w-full items-center justify-between gap-3 rounded-2xl border border-narhan-accent/20 bg-gradient-to-l from-narhan-card to-narhan-panel px-4 py-3.5">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute left-2 top-2 rounded-full p-1 text-white/30 transition hover:text-white/60"
          aria-label="بستن"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleInstall}
          className="flex flex-1 items-center gap-3 text-start"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-narhan-charcoal/80 shadow-inner ring-1 ring-white/10">
            <Logo width={24} height={30} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">
              نصب اپ نهان
            </p>
            <p className="mt-0.5 text-xs text-narhan-muted">
              دسترسی سریع‌تر، تجربه اپ واقعی
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={handleInstall}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-narhan-accent/15 text-narhan-accent transition hover:bg-narhan-accent/30"
          aria-label="نصب"
        >
          {state === "ios" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
