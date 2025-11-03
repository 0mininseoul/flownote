"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomFormat } from "@/types";

export default function FormatsPage() {
  const router = useRouter();
  const [formats, setFormats] = useState<CustomFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormat, setNewFormat] = useState({ name: "", prompt: "" });

  useEffect(() => {
    fetchFormats();
  }, []);

  const fetchFormats = async () => {
    try {
      const response = await fetch("/api/formats");
      const data = await response.json();
      setFormats(data.formats || []);
    } catch (error) {
      console.error("Failed to fetch formats:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFormat = async () => {
    if (!newFormat.name || !newFormat.prompt) {
      alert("이름과 프롬프트를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/formats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormat),
      });

      if (response.ok) {
        const data = await response.json();
        setFormats([data.format, ...formats]);
        setShowCreateModal(false);
        setNewFormat({ name: "", prompt: "" });
      }
    } catch (error) {
      console.error("Failed to create format:", error);
      alert("포맷 생성에 실패했습니다.");
    }
  };

  const defaultFormats = [
    {
      name: "회의록 형식",
      icon: "🎙️",
      description: "참석자, 주요 안건, 결정 사항, 액션 아이템",
      isDefault: true,
    },
    {
      name: "인터뷰 기록 형식",
      icon: "📝",
      description: "Q&A 형식으로 질문과 답변을 정리",
      isDefault: true,
    },
    {
      name: "강의 요약본 형식",
      icon: "📚",
      description: "핵심 개념과 주요 내용을 섹션별로 정리",
      isDefault: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/settings")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">포맷 설정</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Default Formats */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            기본 포맷
          </h2>
          <div className="space-y-3">
            {defaultFormats.map((format, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
              >
                <div className="text-3xl">{format.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{format.name}</h3>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Formats */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              커스텀 포맷
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="glass-button"
            >
              + 새 포맷 만들기
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-600">로딩 중...</div>
          ) : formats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-600">
                커스텀 포맷이 없습니다. 새로 만들어보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {formats.map((format) => (
                <div
                  key={format.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl"
                >
                  <div className="text-3xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800">
                      {format.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {format.prompt.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              새 포맷 만들기
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포맷 이름
                </label>
                <input
                  type="text"
                  value={newFormat.name}
                  onChange={(e) =>
                    setNewFormat({ ...newFormat, name: e.target.value })
                  }
                  placeholder="예: 팀 회고록"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI 프롬프트
                </label>
                <textarea
                  value={newFormat.prompt}
                  onChange={(e) =>
                    setNewFormat({ ...newFormat, prompt: e.target.value })
                  }
                  placeholder={`다음 녹취록을 정리해주세요:\n\n{{transcript}}\n\n## 포맷\n...\n\n템플릿 변수: {{transcript}}, {{date}}`}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                />
                <p className="text-sm text-gray-600 mt-2">
                  사용 가능한 변수: {"{"}
                  {"{"}transcript{"}"} {"}"}, {"{"}
                  {"{"}date{"}"}
                  {"}"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFormat({ name: "", prompt: "" });
                }}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button onClick={createFormat} className="flex-1 glass-button">
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
