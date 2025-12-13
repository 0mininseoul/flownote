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
    <div className="w-full flex flex-col items-center justify-center space-y-10">
      {/* Timer */}
      <div className="text-center space-y-2">
        <div className={`text-7xl font-bold tracking-tighter font-mono ${isRecording ? 'text-indigo-600' : 'text-slate-800'}`}>
          {formatDuration(duration)}
        </div>
        <div className="h-6 flex items-center justify-center">
          {isRecording && !isPaused ? (
            <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-sm font-medium uppercase tracking-wider">Recording</span>
            </div>
          ) : isPaused ? (
            <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">Paused</span>
          ) : (
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ready to Record</span>
          )}
        </div>
      </div>

      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-center">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
            aria-label="Start Recording"
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
            <div className="w-8 h-8 rounded-full bg-white" />
          </button>
        ) : (
          <>
            {/* Pause/Resume Button */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={stopRecording}
              className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-red-100 hover:border-red-200 shadow-xl shadow-red-500/10 transition-all hover:scale-105 active:scale-95"
              aria-label="Stop Recording"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500 group-hover:bg-red-600 transition-colors" />
            </button>
          </>
        )}
      </div>

      {/* Helper Text */}
      {!isRecording && (
        <p className="text-center text-sm text-slate-400">
          Click the button to start recording<br />
          <span className="text-xs opacity-75">(Max 120 mins)</span>
        </p>
      )}
    </div>
  );
}
