"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

type OnboardingStep = 1 | 2 | 3;

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
      // TODO: Show error message to user
    }
  }, [searchParams]);

  const handleNotionConnect = () => {
    // Notion OAuth flow will be implemented
    window.location.href = "/api/auth/notion";
  };

  const handleSlackConnect = () => {
    // Slack OAuth flow will be implemented
    window.location.href = "/api/auth/slack";
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

  const handleSkipFormat = async () => {
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
    }
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= num
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "bg-white text-slate-400 border border-slate-200"
                  }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${step > num ? "bg-slate-900" : "bg-slate-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card p-6 md:p-12 space-y-8 animate-slide-up">
          {step === 1 && (
            <div className="space-y-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  👋
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {t.onboarding.step1.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  {t.onboarding.step1.description}
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="btn-primary w-full max-w-sm mx-auto flex items-center justify-center gap-2"
              >
                {t.onboarding.step1.getStarted}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {t.onboarding.step2.title}
                </h2>
                <p className="text-slate-600">
                  {t.onboarding.step2.description}
                </p>
              </div>

              <div className="space-y-4">
                {/* Notion Connection */}
                <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      📔
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{t.onboarding.step2.notion.title}</h3>
                      <p className="text-sm text-slate-500">
                        {t.onboarding.step2.notion.description}
                      </p>
                    </div>
                    {notionConnected && (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold">{t.onboarding.step2.notion.connected}</span>
                      </div>
                    )}
                  </div>
                  {!notionConnected ? (
                    <button
                      onClick={handleNotionConnect}
                      className="w-full py-2.5 px-4 border-2 border-slate-900 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                    >
                      {t.onboarding.step2.notion.connect}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 bg-slate-50 text-slate-500 rounded-lg font-medium text-center border border-slate-200">
                      {t.onboarding.step2.notion.configInSettings}
                    </div>
                  )}
                </div>

                {/* Slack Connection */}
                <div className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      💬
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{t.onboarding.step2.slack.title}</h3>
                      <p className="text-sm text-slate-500">
                        {t.onboarding.step2.slack.description}
                      </p>
                    </div>
                    {slackConnected && (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold">{t.onboarding.step2.slack.connected}</span>
                      </div>
                    )}
                  </div>
                  {!slackConnected ? (
                    <button
                      onClick={handleSlackConnect}
                      className="w-full py-2.5 px-4 border-2 border-slate-900 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                    >
                      {t.onboarding.step2.slack.connect}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 bg-slate-50 text-slate-500 rounded-lg font-medium text-center border border-slate-200">
                      {t.onboarding.step2.slack.configInSettings}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                >
                  {t.onboarding.step2.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-primary shadow-lg shadow-slate-900/10"
                >
                  {t.onboarding.step2.next}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {t.onboarding.step3.title}
                </h2>
                <p className="text-slate-600">
                  {t.onboarding.step3.description}
                </p>
              </div>

              <div className="space-y-4">
                {/* Default Format Option */}
                <button
                  onClick={() => setCustomFormatMode(false)}
                  className={`w-full border rounded-xl p-6 text-left transition-all ${
                    !customFormatMode
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                      📝
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t.onboarding.step3.useDefault}</h3>
                      <p className="text-sm text-slate-500">{t.onboarding.step3.defaultDesc}</p>
                    </div>
                  </div>
                </button>

                {/* Custom Format Option */}
                <button
                  onClick={() => setCustomFormatMode(true)}
                  className={`w-full border rounded-xl p-6 text-left transition-all ${
                    customFormatMode
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{t.onboarding.step3.createCustom}</h3>
                      <p className="text-sm text-slate-500">{t.onboarding.step3.customDesc}</p>
                    </div>
                  </div>
                </button>

                {/* Custom Format Form */}
                {customFormatMode && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.onboarding.step3.formatName}
                      </label>
                      <input
                        type="text"
                        value={formatName}
                        onChange={(e) => setFormatName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.onboarding.step3.formatPrompt}
                      </label>
                      <textarea
                        value={formatPrompt}
                        onChange={(e) => setFormatPrompt(e.target.value)}
                        placeholder={t.onboarding.step3.promptPlaceholder}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                >
                  {t.onboarding.step3.back}
                </button>
                <button
                  onClick={handleSkipFormat}
                  className="py-3 px-6 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                >
                  {t.onboarding.step3.skip}
                </button>
                <button
                  onClick={handleComplete}
                  disabled={customFormatMode && (!formatName || !formatPrompt)}
                  className="flex-1 btn-primary shadow-lg shadow-slate-900/10 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {t.onboarding.step3.complete}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
