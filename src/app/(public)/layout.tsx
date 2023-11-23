'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import WrapperAccess from '@/components/WrapperAccess'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Header />
            <WrapperAccess>{children}</WrapperAccess>
            <Footer />
        </div>
    )
}
