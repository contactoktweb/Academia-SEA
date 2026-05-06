"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { TableSkeleton } from "@/components/dashboard/table-skeleton"
import { DashboardTopBar } from "@/components/dashboard/sidebar"

const StudentsTable = dynamic(
  () => import("@/components/dashboard/students-table-client").then((m) => m.StudentsTableClient),
  { ssr: false, loading: () => <TableSkeleton rows={5} columns={6} /> }
)
const TeachersTable = dynamic(
  () => import("@/components/dashboard/teachers-table-client").then((m) => m.TeachersTableClient),
  { ssr: false, loading: () => <TableSkeleton rows={5} columns={6} /> }
)
const CoursesTable = dynamic(
  () => import("@/components/dashboard/courses-table-client").then((m) => m.CoursesTableClient),
  { ssr: false, loading: () => <TableSkeleton rows={5} columns={7} /> }
)

export default function DashboardInstantPage() {
  const [tab, setTab] = useState<"students" | "teachers" | "courses">("students")

  return (
    <div className="flex flex-col gap-6">
      <DashboardTopBar title="Dashboard Rápido (SPA)" />

      <div className="flex gap-2">
        <button
          onClick={() => setTab("students")}
          className={`px-3 py-2 rounded-md ${tab === "students" ? "bg-primary text-white" : "bg-muted"}`}>
          Alumnos
        </button>
        <button
          onClick={() => setTab("teachers")}
          className={`px-3 py-2 rounded-md ${tab === "teachers" ? "bg-primary text-white" : "bg-muted"}`}>
          Profesores
        </button>
        <button
          onClick={() => setTab("courses")}
          className={`px-3 py-2 rounded-md ${tab === "courses" ? "bg-primary text-white" : "bg-muted"}`}>
          Cursos
        </button>
      </div>

      <div>
        {tab === "students" && <StudentsTable />}
        {tab === "teachers" && <TeachersTable />}
        {tab === "courses" && <CoursesTable />}
      </div>
    </div>
  )
}
