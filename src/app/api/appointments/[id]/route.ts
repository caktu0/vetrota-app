import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generalRateLimiter } from "@/lib/rate-limit";

const updateAppointmentSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED"])
    .optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-MM-DD formatında olmalıdır.").optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Saat HH:MM formatında olmalıdır.").optional(),
  notes: z.string().trim().max(500, "Notlar 500 karakterden uzun olamaz.").optional(),
  vetNotes: z.string().trim().max(1000, "Hekim notu 1000 karakterden uzun olamaz.").optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting check
  const rateLimitResponse = generalRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = updateAppointmentSchema.parse(body);

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Randevu bulunamadı." }, { status: 404 });
    }

    // Role & Ownership Authorization check
    const isVet = session.user.role === "VET" || session.user.role === "ADMIN";
    const isOwner = appointment.userId === session.user.id;

    if (!isVet && !isOwner) {
      return NextResponse.json({ error: "Bu randevuyu güncelleme yetkiniz bulunmamaktadır." }, { status: 403 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz güncelleme verisi.", details: error.errors }, { status: 400 });
    }
    console.error("[Appointment PATCH API Error]:", error);
    return NextResponse.json({ error: "Randevu güncellenirken bir sorun oluştu." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting check
  const rateLimitResponse = generalRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Randevu bulunamadı." }, { status: 404 });
    }

    // Role & Ownership Authorization check
    const isVet = session.user.role === "VET" || session.user.role === "ADMIN";
    const isOwner = appointment.userId === session.user.id;

    if (!isVet && !isOwner) {
      return NextResponse.json({ error: "Bu randevuyu silme/iptal etme yetkiniz bulunmamaktadır." }, { status: 403 });
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Randevu başarıyla silindi." });
  } catch (error) {
    console.error("[Appointment DELETE API Error]:", error);
    return NextResponse.json({ error: "Randevu silinirken bir sorun oluştu." }, { status: 500 });
  }
}
