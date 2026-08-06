import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const SEDES_MAP: Record<string, string> = {
  SEAAUTLAN: "Autlán",
  SEAGRULLO: "El Grullo",
  SEAUNION: "Unión de Tula",
  EN_LINEA: "En Línea",
};

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  headerBox: {
    paddingBottom: 20,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 5,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  studentInfo: {
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 80,
    fontSize: 10,
    color: "#666666",
    textTransform: "uppercase",
  },
  infoValue: {
    flex: 1,
    fontSize: 10,
    color: "#000000",
  },
  table: {
    display: "flex",
    width: "auto",
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tableHeader: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  tableColLarge: {
    width: "50%",
    padding: 10,
    paddingLeft: 0,
  },
  tableCol: {
    width: "25%",
    padding: 10,
  },
  tableColLast: {
    width: "25%",
    padding: 10,
    paddingRight: 0,
    textAlign: "right",
  },
  tableCellHeader: {
    fontSize: 9,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableCell: {
    fontSize: 10,
    color: "#000000",
  },
  averageContainer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    alignItems: "flex-end",
  },
  averageText: {
    fontSize: 12,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: "left",
    color: "#999999",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 15,
  }
});

const ReportCard = ({ student, grades }: { student: any, grades: any[] }) => {
  const average = grades.length > 0 
    ? (grades.reduce((sum: number, g: any) => sum + g.value, 0) / grades.length).toFixed(1)
    : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>ACADEMIA SEA</Text>
          <Text style={styles.subtitle}>Boleta Oficial de Calificaciones</Text>
        </View>

        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alumno:</Text>
            <Text style={styles.infoValue}>{student.user.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Matrícula / ID:</Text>
            <Text style={styles.infoValue}>{student.studentId || student.user.id.slice(-6).toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sede:</Text>
            <Text style={styles.infoValue}>{SEDES_MAP[student.user.sede] || student.user.sede}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Correo:</Text>
            <Text style={styles.infoValue}>{student.user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emisión:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColLarge}>
              <Text style={styles.tableCellHeader}>Curso / Asignatura</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Fecha Evaluada</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text style={styles.tableCellHeader}>Calificación</Text>
            </View>
          </View>
          
          {grades.length === 0 && (
            <View style={styles.tableRow}>
              <View style={{ width: "100%", padding: 15, alignItems: "center" }}>
                <Text style={{ fontSize: 10, color: "#94a3b8" }}>No hay calificaciones registradas aún.</Text>
              </View>
            </View>
          )}

          {grades.map((grade, i) => (
            <View style={{ ...styles.tableRow, borderBottomWidth: i === grades.length - 1 ? 0 : 1 }} key={i}>
              <View style={styles.tableColLarge}>
                <Text style={styles.tableCell}>{grade.courseAssignment?.course?.name || "General"} - {grade.exam?.title || "Examen"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{new Date(grade.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.tableColLast}>
                <Text style={[styles.tableCell, { fontWeight: "bold", color: grade.value < 6 ? "#ef4444" : "#16a34a" }]}>
                  {grade.value.toFixed(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.averageContainer}>
          <Text style={styles.averageText}>Promedio General: {average}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Documento generado automáticamente por el sistema de Academia SEA.</Text>
          <Text>Válido para uso interno e informativo.</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const studentId = params.studentId;

    const student = await db.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    const grades = await db.grade.findMany({
      where: { studentId },
      include: {
        exam: true,
        courseAssignment: {
          include: { course: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const stream = await renderToStream(<ReportCard student={student} grades={grades} />);
    
    // We must read the stream and convert it to a buffer or Web ReadableStream.
    // Node.js stream -> Web ReadableStream is needed for Next.js 13+ App router Response.
    
    // A simple hack to convert Node stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Boleta_${student.user.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Error al generar el PDF" }, { status: 500 });
  }
}
