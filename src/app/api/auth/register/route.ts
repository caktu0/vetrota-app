import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authRateLimiter } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalıdır").max(50, "İsim çok uzun"),
  surname: z.string().trim().min(2, "Soyisim en az 2 karakter olmalıdır").max(50, "Soyisim çok uzun"),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz").max(254, "E-posta adresi çok uzun"),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası giriniz").max(15, "Telefon numarası geçersiz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").max(100, "Şifre çok uzun"),
  role: z.enum(["CUSTOMER", "ADMIN", "VET", "USER"]).transform((val) => (val === "USER" ? "CUSTOMER" : val)),
});

export async function POST(req: NextRequest) {
  // 1. Rate limiting check (5 req / 15 min per IP)
  const rateLimitResponse = authRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanımda." },
        { status: 400 }
      );
    }

    // Hash password with cost factor 12 per ANTIGRAVITY.md rules
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        name: `${validatedData.name} ${validatedData.surname}`,
        surname: validatedData.surname,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: validatedData.role,
      },
    });

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz form verisi.", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      { error: "Sunucu tarafında bir sorun oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
