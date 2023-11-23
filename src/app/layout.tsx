import '@fontsource/poppins'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'

import { ReactNode } from 'react'

import TawkWidget from '@/tawk.to/widget'

export const metadata = {
    title: 'ElevenTickets - Explore experiências incríveis!',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="pt-br">
            <body>
                {children}
                <TawkWidget />
                <ToastContainer limit={1} />
            </body>
        </html>
    )
}

export default RootLayout
