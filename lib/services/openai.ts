import OpenAI from "openai";
import { buildPrompt, FORMAT_PROMPTS } from "@/lib/prompts";

export async function formatDocument(
  transcript: string,
  format: keyof typeof FORMAT_PROMPTS,
  customPrompt?: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  console.log("[Formatting] Starting OpenAI formatting...");

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = buildPrompt(format, transcript, customPrompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "당신은 전문적인 문서 편집자입니다. 녹취록을 읽기 쉽고 구조화된 형식으로 정리하는 것이 당신의 임무입니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000, // Increased from 2000 for longer transcripts
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || "";
    console.log("[Formatting] OpenAI formatting succeeded");
    return content;
  } catch (error) {
    console.error("[Formatting] OpenAI error:", error);
    throw new Error(
      `OpenAI formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
