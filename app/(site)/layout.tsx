import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { client } from '@/sanity/lib/client'
import { GLOBAL_CONFIG_QUERY } from '@/sanity/lib/queries'

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)

    return (
        <>
            <Header data={globalConfig} />
            <main>{children}</main>
            <Footer data={globalConfig} />
        </>
    )
}
