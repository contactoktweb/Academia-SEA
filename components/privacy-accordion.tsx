"use client"

import { ChevronDown } from "lucide-react"
import { PortableText } from "@portabletext/react"
import { useState } from "react"

interface Section {
    _key: string
    id: string
    titulo: string
    contenido: any[]
}

function AccordionItem({ section }: { section: Section }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-secondary/50"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea-blue/10 text-sm font-extrabold text-sea-blue">
                    {section.id}
                </span>
                <span className="flex-1 text-sm font-bold text-heading lg:text-base">{section.titulo}</span>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-border px-6 pb-6 pt-4">
                        <div className="prose prose-sm max-w-none text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-heading [&_p]:leading-relaxed [&_li]:mb-1">
                            <PortableText value={section.contenido} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function PrivacyAccordion({ sections }: { sections: Section[] }) {
    return (
        <div className="flex flex-col gap-3">
            {sections.map((section) => (
                <AccordionItem key={section._key || section.id} section={section} />
            ))}
        </div>
    )
}
