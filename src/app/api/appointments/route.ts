import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const appointmentSchema = z.object({
  date: z.string(),
  time: z.string(),
  vetId: z.string(),
  petId: z.string(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
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
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Randevular getirilemedi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        vetId: validatedData.vetId,
        date: validatedData.date,
        time: validatedData.time,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Bu saat dilimi dolu" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 });
  }
}
