import { writeClient } from "@/sanity/lib/client";

export interface ReportErrorOptions {
  title: string;
  location?: string;
  error: any;
  severity?: "CRITICAL" | "ERROR" | "WARNING" | "INFO";
  userEmail?: string;
  url?: string;
  context?: Record<string, any> | string;
}

/**
 * Registra un error o excepción directamente en el esquema 'systemError' de Sanity Studio.
 */
export async function reportErrorToSanity(options: ReportErrorOptions) {
  try {
    const {
      title,
      location,
      error,
      severity = "ERROR",
      userEmail,
      url,
      context,
    } = options;

    const errorMessage =
      error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
    
    const stackTrace =
      error instanceof Error && error.stack 
        ? error.stack 
        : typeof error === "object" 
        ? JSON.stringify(error, null, 2) 
        : String(error);

    const doc = {
      _type: "systemError",
      title: title || errorMessage.slice(0, 120) || "Error del Sistema",
      timestamp: new Date().toISOString(),
      location: location || "Desconocido",
      severity,
      errorMessage,
      stackTrace,
      userEmail: userEmail || undefined,
      url: url || undefined,
      context:
        typeof context === "object"
          ? JSON.stringify(context, null, 2)
          : context || undefined,
      status: "NUEVO",
    };

    if (process.env.SANITY_API_TOKEN) {
      await writeClient.create(doc);
    } else {
      console.warn("SANITY_API_TOKEN no está definido, se omitió el guardado en Sanity.");
    }
  } catch (err) {
    console.error("Falló la grabación del error en Sanity:", err);
  }
}
