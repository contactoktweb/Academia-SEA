import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const teachers = await db.user.findMany({
      where: { role: "TEACHER", deletedAt: null },
      include: {
        teacherProfile: {
          include: {
            courses: {
              include: {
                course: true,
                group: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    )
  }
}
