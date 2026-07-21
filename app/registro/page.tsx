import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { RegisterForm } from '@/components/auth/register-form'
import { client } from '@/sanity/lib/client'
import { GLOBAL_CONFIG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default async function RegisterPage() {
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)
  const logoUrl = globalConfig?.logo?.asset ? urlFor(globalConfig.logo.asset).url() : null

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <RegisterForm logoUrl={logoUrl || undefined} />
    </Suspense>
  )
}
