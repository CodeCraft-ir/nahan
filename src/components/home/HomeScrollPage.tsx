"use client";

import { HeroSection, HomeInfoSection } from "@/components/home/HeroSection";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { InstallAppButton } from "@/components/ui/InstallAppButton";
import { designTokens } from "@/lib/design-tokens";

export function HomeScrollPage() {
  return (
    <div
      className="mx-auto min-h-screen w-full"
      style={{ maxWidth: designTokens.layout.maxWidth }}
    >
      <div className="flex min-h-dvh flex-col bg-white">
        <HeroSection />
        <HomeInfoSection />
        <ScrollHint />
      </div>

      <div className="bg-narhan-charcoal">
        <InstallAppButton />
      </div>
    </div>
  );
}
