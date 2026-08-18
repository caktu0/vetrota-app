import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Mesaj içeriği gereklidir." },
        { status: 400 }
      );
    }

    const response = await askGemini(message, history || []);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        text: "Dostunuzun durumuyla ilgili size yardımcı olmak için buradayım. Randevu ekranımızdan dilediğiniz hekim seansını oluşturabilirsiniz.",
        intent: "GENERAL",
      },
      { status: 200 }
    );
  }
}
