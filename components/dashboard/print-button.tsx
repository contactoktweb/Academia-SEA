"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="bg-[#0066cc] hover:bg-[#0055aa] text-white px-6 py-2 rounded-lg font-bold shadow-md transition"
    >
      <Printer className="mr-2 h-4 w-4" />
      Imprimir Boleta (PDF)
    </Button>
  );
}
