// WhisperAPI.com integration
export async function transcribeAudio(audioFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("language", "ko"); // Auto-detect Korean/English
  formData.append("diarization", "true"); // Speaker separation
  formData.append("timestamps", "true");

  const response = await fetch("https://api.whisperapi.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHISPER_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Whisper API error: ${error}`);
  }

  const data = await response.json();
  return data.text;
}

// Alternative: Use Groq as backup
export async function transcribeAudioWithGroq(audioFile: File): Promise<string> {
  // Groq Whisper Large V3 API
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", "whisper-large-v3");
  formData.append("language", "ko");
  formData.append("response_format", "json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Groq API error");
  }

  const data = await response.json();
  return data.text;
}
