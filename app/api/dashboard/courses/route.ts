import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const courses = await db.course.findMany({
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
