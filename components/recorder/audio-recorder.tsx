"use client";

import { useState, useRef } from "react";
import { formatDuration } from "@/lib/utils";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  format: string;
}

export function AudioRecorder({ onRecordingComplete, format }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const finalDuration = Math.floor(duration);
        onRecordingComplete(blob, finalDuration);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Start timer
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        // Stop recording after 120 minutes (7200 seconds)
        if (elapsed >= 7200) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("마이크 접근 권한이 필요합니다.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        if (elapsed >= 7200) {
          stopRecording();
        }
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Reset for next recording
      setDuration(0);
      pausedTimeRef.current = 0;
    }
  };

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">새 녹음 시작</h2>

        {/* Recording Status */}
        <div className="flex items-center justify-center gap-3">
          {isRecording && !isPaused && (
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
          )}
          <div className="text-4xl font-mono text-gray-800">
            {formatDuration(duration)}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Format Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          문서 포맷
        </label>
        <select
          disabled={isRecording}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="meeting">회의록</option>
          <option value="interview">인터뷰 기록</option>
          <option value="lecture">강의 요약본</option>
        </select>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 glass-button flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <circle cx="10" cy="10" r="7" />
            </svg>
            <span>녹음 시작</span>
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="flex-1 py-3 px-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <rect x="6" y="4" width="3" height="12" rx="1" />
                  <rect x="11" y="4" width="3" height="12" rx="1" />
                </svg>
                <span>일시정지</span>
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="flex-1 py-3 px-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                <span>재개</span>
              </button>
            )}
            <button
              onClick={stopRecording}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <rect x="4" y="4" width="12" height="12" rx="2" />
              </svg>
              <span>중지</span>
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        최대 녹음 시간: 120분
      </div>
    </div>
  );
}
