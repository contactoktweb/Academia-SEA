import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#1e3a8a",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
  },
  studentInfo: {
    marginBottom: 30,
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
    color: "#334155",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColLarge: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  averageContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  averageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  }
});

const ReportCard = ({ student, grades }: { student: any, grades: any[] }) => {
  const average = grades.length > 0 
    ? (grades.reduce((sum: number, g: any) => sum + g.value, 0) / grades.length).toFixed(1)
    : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Academia SEA</Text>
          <Text style={styles.subtitle}>Boleta Oficial de Calificaciones</Text>
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.infoText}>Alumno: {student.user.name}</Text>
          <Text style={styles.infoText}>Matrícula / ID: {student.studentId || "No asignada"}</Text>
          <Text style={styles.infoText}>Fecha de Emisión: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColLarge}>
              <Text style={styles.tableCellHeader}>Curso / Examen</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Calificación</Text>
            </View>
          </View>
          
          {grades.map((grade, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableColLarge}>
                <Text style={styles.tableCell}>{grade.courseAssignment?.course?.name || "General"} - {grade.exam?.title || "Examen"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{new Date(grade.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{grade.value.toFixed(1)}</Text>
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
