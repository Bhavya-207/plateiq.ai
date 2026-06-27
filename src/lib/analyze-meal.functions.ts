import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z
    .string()
    .min(20)
    .refine((s) => s.startsWith("data:image/"), "Expected an image data URL"),
});

const AnalysisSchema = z.object({
  foodItems: z.array(z.string()).min(1),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number(),
  healthScore: z.number().min(0).max(10),
  momsWisdom: z.string().min(1),
  healthyAlternative: z.object({
    instead: z.object({ name: z.string(), emoji: z.string().default("🥤") }),
    tryThis: z.object({ name: z.string(), emoji: z.string().default("🥛") }),
  }),
});

export type MealAnalysis = z.infer<typeof AnalysisSchema>;

const SYSTEM_PROMPT = `You are PlateIQ, an expert nutritionist specialising in Indian cuisine.
Analyse the meal in the image and respond with STRICT JSON ONLY (no markdown, no commentary) matching this exact shape:
{
  "foodItems": string[],            // visible food items, short names (e.g. "Dal", "Rice", "Paneer")
  "calories": number,                // total kcal for the visible serving
  "protein": number,                 // grams
  "carbs": number,                   // grams
  "fat": number,                     // grams
  "fiber": number,                   // grams
  "healthScore": number,             // 0-10, one decimal allowed
  "momsWisdom": string,              // 1-2 sentences, warm Indian-mom tone, practical tip to improve the meal
  "healthyAlternative": {
    "instead": { "name": string, "emoji": string },   // a less healthy item often eaten alongside
    "tryThis":  { "name": string, "emoji": string }   // a healthier Indian-friendly swap
  }
}
Estimate sensibly when exact values are unknown. Never include keys outside this schema.`;

export const analyzeMeal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<MealAnalysis> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    // Split "data:image/jpeg;base64,XXXX" into mime + base64 payload.
    const match = data.imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid image data URL.");
    const [, mimeType, base64Data] = match;

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Analyse this meal photo and return the JSON described." },
              { inlineData: { mimeType, data: base64Data } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error("Rate limit reached. Please try again in a moment.");
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error("Invalid or unauthorised GEMINI_API_KEY.");
      }
      throw new Error(`Gemini analysis failed (${res.status}). ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      promptFeedback?: { blockReason?: string };
    };

    if (json.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked the request: ${json.promptFeedback.blockReason}`);
    }

    const raw = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    if (!raw) throw new Error("Empty response from Gemini.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Gemini returned non-JSON output.");
      parsed = JSON.parse(m[0]);
    }

    return AnalysisSchema.parse(parsed);
  });

