import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role, Sede } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, role, ...userData } = body;
    const { email, password, name, phone, sede } = userData;

    if (!email || !code || !role || !password || !name || !sede) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    // Verify OTP
    const verificationCode = await db.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: "Código inválido o expirado." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default status for new users: not approved
    const isApproved = false;

    // Create User
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role as Role,
        sede: sede as Sede,
        isApproved,
      },
    });

    // Create Profile based on role
    if (role === Role.STUDENT) {
      await db.studentProfile.create({
        data: {
          userId: user.id,
          sede: sede as Sede,
          birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
          curp: userData.curp,
          emergencyContact: userData.emergencyContact,
          emergencyPhone: userData.emergencyPhone,
          emergencyContact2: userData.emergencyContact2,
          emergencyPhone2: userData.emergencyPhone2,
        },
      });
    } else if (role === Role.TEACHER) {
      await db.teacherProfile.create({
        data: {
          userId: user.id,
          sede: sede as Sede,
          birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
        },
      });
    }

    // Delete verification code
    await db.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Error in /api/auth/verify-register:", err);
    return NextResponse.json({ error: "Error al registrar el usuario." }, { status: 500 });
  }
}
