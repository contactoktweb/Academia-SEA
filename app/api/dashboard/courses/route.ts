import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSedeCondition } from "@/lib/multi-tenancy"

export async function GET(request: NextRequest) {
  try {
    const sedeCondition = await getSedeCondition();
    const courses = await db.course.findMany({
      where: { ...sedeCondition, isActive: true },
      include: {
        cycle: true,
        assignments: {
          include: {
            teacher: { include: { user: true } },
            group: true,
          },
        },
        enrollments: true,
        units: true,
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}
