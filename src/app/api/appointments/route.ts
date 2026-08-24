import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generalRateLimiter } from "@/lib/rate-limit";

const appointmentCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-MM-DD formatında olmalıdır."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Saat HH:MM formatında olmalıdır."),
  serviceId: z.string().min(1, "Hizmet seçimi zorunludur."),
  type: z.enum(["HOME", "ONLINE", "home", "online"]).transform((v) => v.toUpperCase()),
  vetId: z.string().optional(),
  petId: z.string().optional(),
  addressId: z.string().optional(),
  notes: z.string().trim().max(500, "Notlar 500 karakterden uzun olamaz.").optional(),
});

export async function GET(req: NextRequest) {
  // Rate limiting check (60 req / min per IP)
  const rateLimitResponse = generalRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  const filter = session.user.role === "VET" 
    ? { vetId: session.user.id }
    : { userId: session.user.id };

  try {
    const appointments = await prisma.appointment.findMany({
      where: filter,
      include: {
        pet: true,
        user: true,
        vet: true,
        service: true,
        address: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("[Appointments GET API Error]:", error);
    return NextResponse.json({ error: "Randevular getirilirken bir sorun oluştu." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting check (60 req / min per IP)
  const rateLimitResponse = generalRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = appointmentCreateSchema.parse(body);

    if (validatedData.vetId) {
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          vetId: validatedData.vetId,
          date: validatedData.date,
          time: validatedData.time,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      });

      if (existingAppointment) {
        return NextResponse.json({ error: "Seçilen hekimin bu saat dilimi doludur." }, { status: 400 });
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: validatedData.date,
        time: validatedData.time,
        type: validatedData.type,
        serviceId: validatedData.serviceId,
        vetId: validatedData.vetId,
        petId: validatedData.petId,
        addressId: validatedData.addressId,
        notes: validatedData.notes,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz randevu bilgileri.", details: error.errors }, { status: 400 });
    }
    console.error("[Appointments POST API Error]:", error);
    return NextResponse.json({ error: "Randevu oluşturulamadı." }, { status: 500 });
  }
}
