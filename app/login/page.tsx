import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { client } from '@/sanity/lib/client'
import { GLOBAL_CONFIG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default async function LoginPage() {
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)
  const logoUrl = globalConfig?.logo?.asset ? urlFor(globalConfig.logo.asset).url() : null

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm logoUrl={logoUrl || undefined} />
    </Suspense>
  )
}
