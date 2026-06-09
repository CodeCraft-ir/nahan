"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setPromptEvent(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    setIsInstalling(true);
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setIsInstalling(false);
    setPromptEvent(null);
  };

  // Don't render if already installed or no prompt available
  if (isInstalled || !promptEvent) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center gap-2 rounded-full bg-narhan-accent px-4 py-2 text-xs font-medium text-narhan-charcoal transition hover:bg-narhan-accent-hover disabled:opacity-60"
      aria-label="نصب اپلیکیشن نهان"
    >
      {isInstalling ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3v13M8 12l4 4 4-4" />
          <path d="M4 20h16" />
        </svg>
      )}
      <span>{isInstalling ? "در حال نصب…" : "نصب اپ"}</span>
    </button>
  );
}
