import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSedeCondition } from "@/lib/multi-tenancy"

export async function GET(request: NextRequest) {
  try {
    const sedeCondition = await getSedeCondition();
    const teachers = await db.user.findMany({
      where: { role: "TEACHER", deletedAt: null, ...sedeCondition },
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
