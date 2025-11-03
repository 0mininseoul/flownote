"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OnboardingStep = 1 | 2 | 3;

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [selectedFormat, setSelectedFormat] = useState<string>("meeting");
  const router = useRouter();

  const formats = [
    {
      id: "meeting",
      name: "회의록 형식",
      icon: "🎙️",
      description: "참석자, 주요 안건, 결정 사항, 액션 아이템",
    },
    {
      id: "interview",
      name: "인터뷰 기록 형식",
      icon: "📝",
      description: "Q&A 형식으로 질문과 답변을 정리",
    },
    {
      id: "lecture",
      name: "강의 요약본 형식",
      icon: "📚",
      description: "핵심 개념과 주요 내용을 섹션별로 정리",
    },
  ];

  const handleNotionConnect = () => {
    // Notion OAuth flow will be implemented
    window.location.href = "/api/auth/notion";
  };

  const handleSlackConnect = () => {
    // Slack OAuth flow will be implemented
    window.location.href = "/api/auth/slack";
  };

  const handleComplete = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > num ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-12 space-y-8">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                환영합니다!
              </h2>
              <p className="text-gray-600">
                VoiceNote를 사용하기 위해 간단한 설정을 진행합니다.
              </p>
              <button
                onClick={() => setStep(2)}
                className="glass-button w-full max-w-sm mx-auto"
              >
                다음
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  서비스 연결
                </h2>
                <p className="text-gray-600">
                  Notion과 Slack을 연결하여 자동화를 시작하세요
                </p>
              </div>

              <div className="space-y-4">
                {/* Notion Connection */}
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📔</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Notion</h3>
                      <p className="text-sm text-gray-600">
                        정리된 문서가 자동으로 저장됩니다
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNotionConnect}
                    className="w-full py-2 px-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Notion 연결하기
                  </button>
                </div>

                {/* Slack Connection */}
                <div className="border border-gray-200 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💬</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Slack</h3>
                      <p className="text-sm text-gray-600">
                        완료 알림을 받습니다
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSlackConnect}
                    className="w-full py-2 px-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Slack 연결하기
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 glass-button"
                >
                  다음
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  문서 포맷 선택
                </h2>
                <p className="text-gray-600">
                  기본으로 사용할 문서 형식을 선택하세요
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all ${
                      selectedFormat === format.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{format.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {format.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format.description}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedFormat === format.id
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedFormat === format.id && (
                          <svg
                            className="w-full h-full text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => router.push("/settings/formats")}
                  className="text-indigo-600 hover:underline"
                >
                  커스텀 포맷 만들기 →
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  이전
                </button>
                <button onClick={handleComplete} className="flex-1 glass-button">
                  시작하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
