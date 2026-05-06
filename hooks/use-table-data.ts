import { useEffect, useState } from "react"

interface UseTableDataOptions {
  endpoint: string
}

interface UseTableDataResult<T> {
  data: T[] | null
  loading: boolean
  error: Error | null
}

export function useTableData<T>({
  endpoint,
}: UseTableDataOptions): UseTableDataResult<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}
