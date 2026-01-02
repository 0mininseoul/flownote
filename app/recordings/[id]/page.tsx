"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Recording } from "@/types";
import { formatDurationMinutes } from "@/lib/utils";

export default function RecordingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [recording, setRecording] = useState<Recording | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"transcript" | "formatted">("formatted");

  useEffect(() => {
    fetchRecording();
  }, [id]);

  const fetchRecording = async () => {
    try {
      const response = await fetch(`/api/recordings/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recording");
      }
      const data = await response.json();
      setRecording(data.recording);
    } catch (error) {
      console.error("Failed to fetch recording:", error);
      alert("녹음을 불러오는데 실패했습니다.");
      router.push("/history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "🟢";
      case "processing":
        return "🟡";
      case "failed":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "처리 완료";
      case "processing":
        return "처리 중...";
      case "failed":
        return "처리 실패";
      default:
        return "대기 중";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">녹음을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/history")}
            className="btn-primary"
          >
            히스토리로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-custom h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/history")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="Back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                F
              </div>
              <span className="text-xl font-bold text-slate-900">Flownote</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{recording.title}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    {getStatusIcon(recording.status)} {getStatusText(recording.status)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{formatDurationMinutes(recording.duration_seconds)}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{new Date(recording.created_at).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
              {recording.notion_page_url && (
                <a
                  href={recording.notion_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <span>Notion에서 보기</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Info Text */}
            <p className="mt-4 text-xs text-slate-400">
              * 오디오 파일은 저장되지 않으며, 텍스트 변환 후 즉시 폐기됩니다.
            </p>
          </div>

          {/* Content Tabs - 전사본이나 요약본이 있으면 표시 (노션 저장 여부와 관계없이) */}
          {(recording.transcript || recording.formatted_content) && (
            <div className="mb-4">
              <div className="flex gap-2 border-b border-slate-200">
                {recording.formatted_content && (
                  <button
                    onClick={() => setViewMode("formatted")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      viewMode === "formatted"
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    정리된 문서
                  </button>
                )}
                {recording.transcript && (
                  <button
                    onClick={() => setViewMode("transcript")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      viewMode === "transcript"
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    원본 전사본
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 완전 실패 (전사본도 없는 경우) */}
          {recording.status === "failed" && !recording.transcript && !recording.formatted_content && (
            <div className="card p-6">
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="text-red-600 font-semibold mb-2">처리 실패</h3>
                {recording.error_message && (
                  <p className="text-red-700 text-sm">{recording.error_message}</p>
                )}
              </div>
            </div>
          )}

          {/* 전사본이나 요약본이 있으면 표시 (노션 저장 여부와 관계없이) */}
          {(recording.transcript || recording.formatted_content) && (
            <div className="card p-6">
              {/* 노션 저장 실패 메시지 */}
              {recording.error_step === "notion" && recording.error_message && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="font-semibold">⚠️ 저장 실패:</span>
                    <span>{recording.error_message}</span>
                  </div>
                </div>
              )}

              {viewMode === "formatted" && recording.formatted_content ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">정리된 문서</h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(recording.formatted_content || "");
                        alert("복사되었습니다!");
                      }}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      복사
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans bg-slate-50 p-4 rounded-lg border border-slate-200">
                      {recording.formatted_content}
                    </pre>
                  </div>
                </div>
              ) : viewMode === "transcript" && recording.transcript ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">원본 전사본</h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(recording.transcript || "");
                        alert("복사되었습니다!");
                      }}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      복사
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                      {recording.transcript}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">콘텐츠를 불러올 수 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {/* 아직 처리 중이고 전사본도 없는 경우 */}
          {recording.status === "processing" && !recording.transcript && !recording.formatted_content && (
            <div className="card p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">처리 중...</h3>
              <p className="text-slate-500">음성을 텍스트로 변환하고 있습니다. 잠시만 기다려주세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

