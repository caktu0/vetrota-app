import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "VetRota haftalık bültenine başarıyla abone oldunuz! 💌",
    });
  } catch {
    return NextResponse.json(
      { error: "Abonelik sırasında bir sorun oluştu." },
      { status: 500 }
    );
  }
}
