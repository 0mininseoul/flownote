"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";

type OnboardingStep = 1 | 2 | 3 | 4;

function OnboardingContent() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [notionConnected, setNotionConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);
  const [customFormatMode, setCustomFormatMode] = useState(false);
  const [formatName, setFormatName] = useState("");
  const [formatPrompt, setFormatPrompt] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  // Fetch connection status from database
  const fetchConnectionStatus = async () => {
    try {
      const response = await fetch("/api/user/data");
      if (response.ok) {
        const data = await response.json();
        setNotionConnected(data.notionConnected);
        setSlackConnected(data.slackConnected);
      }
    } catch (error) {
      console.error("Failed to fetch connection status:", error);
    }
  };

  // Check for OAuth callback results and fetch actual connection status
  useEffect(() => {
    const notion = searchParams.get("notion");
    const slack = searchParams.get("slack");
    const error = searchParams.get("error");

    // If OAuth callback, fetch updated connection status from database
    if (notion === "connected" || slack === "connected") {
      fetchConnectionStatus();
      setStep(2); // Stay on step 2
    } else {
      // On initial load, fetch connection status
      fetchConnectionStatus();
    }

    if (error) {
      console.error("OAuth error:", error);
    }
  }, [searchParams]);

  const handleNotionConnect = () => {
    // Notion OAuth flow - 연동 후 바로 완료 처리 (DB 선택 단계 제거)
    window.location.href = "/api/auth/notion?returnTo=/onboarding";
  };

  const handleSlackConnect = () => {
    window.location.href = "/api/auth/slack?returnTo=/onboarding";
  };

  const handleComplete = async () => {
    try {
      // Save custom format if created
      if (customFormatMode && formatName && formatPrompt) {
        await fetch("/api/formats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formatName,
            prompt: formatPrompt,
            is_default: true,
          }),
        });
      }

      // Mark user as onboarded
      await fetch("/api/user/onboarding", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
    router.push("/dashboard");
  };

  const handleGoToStep4 = async () => {
    // Save custom format if created before going to step 4
    if (customFormatMode && formatName && formatPrompt) {
      try {
        await fetch("/api/formats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formatName,
            prompt: formatPrompt,
            is_default: true,
          }),
        });
      } catch (error) {
        console.error("Failed to save format:", error);
      }
    }
    setStep(4);
  };

  const handlePWAComplete = async () => {
    try {
      // Mark user as onboarded
      await fetch("/api/user/onboarding", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
    }
    router.push("/dashboard");
  };

  return (
    <div className="app-container">
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= num
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-8 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                      step > num ? "bg-slate-900" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="card p-6 animate-slide-up">
            {step === 1 && (
              <div className="space-y-6 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  👋
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.onboarding.step1.title}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {t.onboarding.step1.description}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {t.onboarding.step1.getStarted}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.onboarding.step2.title}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {t.onboarding.step2.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Notion Connection */}
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">
                        📔
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{t.onboarding.step2.notion.title}</h3>
                        <p className="text-xs text-slate-500 truncate">
                          {t.onboarding.step2.notion.description}
                        </p>
                      </div>
                      {notionConnected && (
                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold">{t.onboarding.step2.notion.connected}</span>
                        </div>
                      )}
                    </div>
                    {!notionConnected ? (
                      <button
                        onClick={handleNotionConnect}
                        className="w-full py-2.5 px-4 border-2 border-slate-900 text-slate-900 rounded-lg font-bold text-sm min-h-[44px]"
                      >
                        {t.onboarding.step2.notion.connect}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-4 bg-slate-50 text-slate-500 rounded-lg font-medium text-center border border-slate-200 text-xs">
                        {t.onboarding.step2.notion.configInSettings}
                      </div>
                    )}
                  </div>

                  {/* Slack Connection */}
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">
                        💬
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{t.onboarding.step2.slack.title}</h3>
                        <p className="text-xs text-slate-500 truncate">
                          {t.onboarding.step2.slack.description}
                        </p>
                      </div>
                      {slackConnected && (
                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold">{t.onboarding.step2.slack.connected}</span>
                        </div>
                      )}
                    </div>
                    {!slackConnected ? (
                      <button
                        onClick={handleSlackConnect}
                        className="w-full py-2.5 px-4 border-2 border-slate-900 text-slate-900 rounded-lg font-bold text-sm min-h-[44px]"
                      >
                        {t.onboarding.step2.slack.connect}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-4 bg-slate-50 text-slate-500 rounded-lg font-medium text-center border border-slate-200 text-xs">
                        {t.onboarding.step2.slack.configInSettings}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-4 text-slate-500 font-medium text-sm min-h-[44px]"
                  >
                    {t.onboarding.step2.back}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="py-3 px-4 text-slate-500 font-medium text-sm min-h-[44px]"
                  >
                    {t.onboarding.step2.skip}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 btn-primary"
                  >
                    {t.onboarding.step2.next}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t.onboarding.step3.title}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {t.onboarding.step3.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Default Format Option */}
                  <button
                    onClick={() => setCustomFormatMode(false)}
                    className={`w-full border rounded-xl p-4 text-left transition-all ${
                      !customFormatMode
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                        📝
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{t.onboarding.step3.useDefault}</h3>
                        <p className="text-xs text-slate-500">{t.onboarding.step3.defaultDesc}</p>
                      </div>
                    </div>
                  </button>

                  {/* Custom Format Option */}
                  <button
                    onClick={() => setCustomFormatMode(true)}
                    className={`w-full border rounded-xl p-4 text-left transition-all ${
                      customFormatMode
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                        ✨
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{t.onboarding.step3.createCustom}</h3>
                        <p className="text-xs text-slate-500">{t.onboarding.step3.customDesc}</p>
                      </div>
                    </div>
                  </button>

                  {/* Custom Format Form */}
                  {customFormatMode && (
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {t.onboarding.step3.formatName}
                        </label>
                        <input
                          type="text"
                          value={formatName}
                          onChange={(e) => setFormatName(e.target.value)}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {t.onboarding.step3.formatPrompt}
                        </label>
                        <textarea
                          value={formatPrompt}
                          onChange={(e) => setFormatPrompt(e.target.value)}
                          placeholder={t.onboarding.step3.promptPlaceholder}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-4 text-slate-500 font-medium text-sm min-h-[44px]"
                  >
                    {t.onboarding.step3.back}
                  </button>
                  <button
                    onClick={handleGoToStep4}
                    disabled={customFormatMode && (!formatName || !formatPrompt)}
                    className="flex-1 btn-primary disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {t.onboarding.step3.complete}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <PWAInstallPrompt onComplete={handlePWAComplete} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="app-container">
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        </main>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
