import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const students = await db.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: {
          include: {
            enrollments: {
              include: {
                course: true,
                group: true,
              },
            },
            familyLinks: {
              include: {
                family: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}
