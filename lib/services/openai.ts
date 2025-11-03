import OpenAI from "openai";
import { buildPrompt, FORMAT_PROMPTS } from "@/lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function formatDocument(
  transcript: string,
  format: keyof typeof FORMAT_PROMPTS,
  customPrompt?: string
): Promise<string> {
  const prompt = buildPrompt(format, transcript, customPrompt);

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
    max_tokens: 2000,
    temperature: 0.7,
  });

  return response.choices[0].message.content || "";
}
