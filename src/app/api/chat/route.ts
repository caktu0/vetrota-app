import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { askGemini } from "@/lib/gemini";
import { aiRateLimiter } from "@/lib/rate-limit";

const historyItemSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().max(2000),
});

const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Mesaj boş olamaz.").max(1000, "Mesaj çok uzun."),
  history: z.array(historyItemSchema).optional().default([]),
});

export async function POST(req: NextRequest) {
  // Rate limiting check (10 req / min per IP/User)
  const rateLimitResponse = aiRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const validatedData = chatRequestSchema.parse(body);

    // Call server-side Gemini integration
    const response = await askGemini(validatedData.message, validatedData.history);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz mesaj isteği.", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[Chat API Error]:", error);
    return NextResponse.json(
      {
        text: "Dostunuzun durumuyla ilgili size yardımcı olmak için buradayım. Randevu ekranımızdan dilediğiniz hekim seansını oluşturabilirsiniz.",
        intent: "GENERAL",
      },
      { status: 200 }
    );
  }
}
