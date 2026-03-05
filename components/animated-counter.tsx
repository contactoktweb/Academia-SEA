"use client"

import { useEffect, useState, useRef } from "react"

export function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    let start = 0
                    const duration = 2000
                    const step = Math.ceil(target / (duration / 16))
                    const timer = setInterval(() => {
                        start += step
                        if (start >= target) {
                            setCount(target)
                            clearInterval(timer)
                        } else {
                            setCount(start)
                        }
                    }, 16)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, hasAnimated])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}
