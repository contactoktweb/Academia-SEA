"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Local state for instant UI update while URL catches up
  const [value, setValue] = useState(searchParams.get('query')?.toString() || "")

  // Update local state if URL changes from outside
  useEffect(() => {
    setValue(searchParams.get('query')?.toString() || "")
  }, [searchParams])

  // Debounce the URL update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQuery = searchParams.get('query')?.toString() || ""
      if (value !== currentQuery) {
        const params = new URLSearchParams(searchParams)
        if (value) {
          params.set('query', value)
        } else {
          params.delete('query')
        }
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`)
        })
      }
    }, 400) // 400ms delay

    return () => clearTimeout(timeoutId)
  }, [value, pathname, router, searchParams])

  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 bg-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
