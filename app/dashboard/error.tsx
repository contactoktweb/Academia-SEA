"use client";

import { useEffect, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, ClipboardCopy, CheckCheck } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorBoundaryProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showStack, setShowStack] = useState(false);
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);

  const reportError = useCallback(async () => {
    if (reported) return;
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorMessage: error.message,
          errorStack: error.stack,
          errorDigest: error.digest,
          pathname,
          userId: session?.user?.id ?? null,
          userEmail: session?.user?.email ?? null,
          userName: session?.user?.name ?? null,
          userRole: (session?.user as any)?.role ?? null,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          timestamp: new Date().toISOString(),
        }),
      });
      setReported(true);
    } catch {
      // silently fail the report itself
    }
  }, [error, pathname, session, reported]);

  // Auto-report on mount
  useEffect(() => {
    reportError();
  }, [reportError]);

  const errorRef = `ERR-${Date.now().toString(36).toUpperCase()}`;
  const readableRole =
    (session?.user as any)?.role === "ADMIN"
      ? "Administrador"
      : (session?.user as any)?.role === "TEACHER"
      ? "Profesor"
      : "Estudiante";

  const copyDetails = () => {
    const text = `Referencia: ${errorRef}\nRuta: ${pathname}\nError: ${error.message}\nDigest: ${error.digest ?? "—"}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-2xl">
        {/* Header card */}
        <div className="rounded-2xl bg-white border border-red-100 shadow-lg overflow-hidden">
          {/* Red accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-orange-400" />

          <div className="p-8">
            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Algo salió mal
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Se produjo un error inesperado en esta sección del panel.
                </p>
              </div>
            </div>

            {/* Error message box */}
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
              <p className="text-sm font-semibold text-red-700 mb-0.5">Mensaje del error:</p>
              <p className="text-sm text-red-600 font-mono break-all">
                {error.message || "Error desconocido"}
              </p>
              {error.digest && (
                <p className="text-xs text-red-400 mt-1">
                  Código: <code className="font-mono">{error.digest}</code>
                </p>
              )}
            </div>

            {/* Reported status */}
            <div
              className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 mb-6 border ${
                reported
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              {reported ? (
                <>
                  <CheckCheck className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Este error fue reportado automáticamente al equipo de soporte y quedó registrado en el sistema.
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 flex-shrink-0 animate-spin" />
                  <span>Registrando el error…</span>
                </>
              )}
            </div>

            {/* Context info */}
            <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 text-sm mb-6 overflow-hidden">
              <div className="grid grid-cols-2 px-4 py-2.5 bg-slate-50">
                <span className="text-slate-500 font-medium">Referencia</span>
                <span className="font-mono text-slate-700">{errorRef}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-slate-500 font-medium">Usuario</span>
                <span className="text-slate-700">{session?.user?.name ?? "Desconocido"}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-slate-50">
                <span className="text-slate-500 font-medium">Rol</span>
                <span className="text-slate-700">{readableRole}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-slate-500 font-medium">Ruta</span>
                <span className="font-mono text-slate-700 break-all">{pathname}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-slate-50">
                <span className="text-slate-500 font-medium">Hora</span>
                <span className="text-slate-700">{new Date().toLocaleString("es-MX")}</span>
              </div>
            </div>

            {/* Stack trace toggle */}
            {error.stack && (
              <div className="mb-6">
                <button
                  onClick={() => setShowStack((v) => !v)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors mb-2"
                >
                  {showStack ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {showStack ? "Ocultar" : "Ver"} detalles técnicos
                </button>
                {showStack && (
                  <pre className="bg-slate-900 text-emerald-300 text-[11px] p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-sea-blue text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                <RefreshCw className="h-4 w-4" />
                Intentar de nuevo
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                Ir al Panel
              </Link>
              <button
                onClick={copyDetails}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-500 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors ml-auto"
              >
                {copied ? <CheckCheck className="h-4 w-4 text-emerald-500" /> : <ClipboardCopy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar info"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Si el problema persiste, contacta al soporte técnico con la referencia{" "}
          <code className="font-mono font-bold">{errorRef}</code>.
        </p>
      </div>
    </div>
  );
}
