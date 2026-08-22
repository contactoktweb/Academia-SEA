import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSedeCondition } from "@/lib/multi-tenancy"

export async function GET(request: NextRequest) {
  try {
    const sedeCondition = await getSedeCondition();
    const students = await db.user.findMany({
      where: { role: "STUDENT", deletedAt: null, ...sedeCondition },
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
