import type { LucideIcon } from "lucide-react"

interface SubpageHeroProps {
    /** Badge text shown above the heading */
    badge: string
    /** Badge icon from lucide-react */
    badgeIcon: LucideIcon
    /** Page heading (H1) — can include JSX for italic or styled text */
    title: string
    /** Optional highlighted/italic portion of the title */
    titleHighlight?: string
    /** Subtitle paragraph text */
    subtitle: string
    /** Optional children rendered below the subtitle (e.g. pills, buttons, stats) */
    children?: React.ReactNode
}

export function SubpageHero({
    badge,
    badgeIcon: BadgeIcon,
    title,
    titleHighlight,
    subtitle,
    children,
}: SubpageHeroProps) {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Subtle grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #1e3a5f 1px, transparent 1px),
            linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)
          `,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Decorative blurred circles */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#1a2b4a]/[0.04] blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#1a2b4a]/[0.03] blur-[80px]" />

            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center md:py-28 lg:py-32">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
                    <BadgeIcon className="h-3.5 w-3.5" />
                    {badge}
                </span>

                {/* Heading */}
                <h1 className="mt-7 text-pretty text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1a2b4a] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem]">
                    {titleHighlight ? (
                        <>
                            {title}{" "}
                            <em className="italic" style={{ fontStyle: "italic" }}>
                                {titleHighlight}
                            </em>
                        </>
                    ) : (
                        title
                    )}
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 md:text-[1.05rem]">
                    {subtitle}
                </p>

                {/* Optional children (pills, stats, buttons) */}
                {children && <div className="mt-10 w-full">{children}</div>}
            </div>

            {/* Bottom border line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200/60" />
        </section>
    )
}
