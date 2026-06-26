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
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured.");
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyse this meal photo and return the JSON described.",
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error("Rate limit reached. Please try again in a moment.");
      }
      if (res.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      throw new Error(`AI analysis failed (${res.status}). ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    if (!raw) throw new Error("Empty response from AI.");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract a JSON object from the text.
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned non-JSON output.");
      parsed = JSON.parse(m[0]);
    }

    return AnalysisSchema.parse(parsed);
  });
