import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generalRateLimiter } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz.").max(254, "E-posta adresi çok uzun."),
});

export async function POST(req: NextRequest) {
  // Rate limiting check (60 req / min per IP)
  const rateLimitResponse = generalRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const validatedData = newsletterSchema.parse(body);

    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (!existingSubscription) {
      await prisma.newsletter.create({
        data: { email: validatedData.email },
      });
    }

    return NextResponse.json({
      success: true,
      message: "VetRota haftalık bültenine başarıyla abone oldunuz! 💌",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz e-posta adresi." },
        { status: 400 }
      );
    }
    console.error("[Newsletter API Error]:", error);
    return NextResponse.json(
      { error: "Abonelik sırasında bir sorun oluştu." },
      { status: 500 }
    );
  }
}
