"use client";

import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";

interface GoogleLoginButtonProps {
  variant?: "nav" | "primary" | "cta";
}

export function GoogleLoginButton({ variant = "nav" }: GoogleLoginButtonProps) {
  const { t, locale } = useI18n();

  const handleLogin = async () => {
    const supabase = createClient();

    // Include locale in redirectTo to preserve language preference
    // Don't specify 'next' - let auth callback determine based on user status (new vs existing)
    const redirectTo = `${window.location.origin}/api/auth/callback?locale=${locale}`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "cta":
        return "inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-100 transition-all shadow-lg min-h-[48px]";
      default:
        return "btn-nav";
    }
  };

  // nav: "시작하기", cta/primary: "무료로 시작하기"
  const buttonText = variant === "nav" ? t.auth.signInWithGoogle : t.auth.getStarted;

  return (
    <button onClick={handleLogin} className={getButtonClass()}>
      {buttonText}
    </button>
  );
}
