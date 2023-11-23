import { useState, useEffect, type FC } from 'react'

import Image from 'next/image'

import { CaretUp } from '@/icons'

const Footer: FC = () => {
    const [show, setShow] = useState(false)

    const controlTop = () => {
        if (window.scrollY > 100) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', controlTop)
        return () => {
            window.removeEventListener('scroll', controlTop)
        }
    }, [])

    return (
        <>
            <a
                href="#"
                className={`${
                    show ? 'opacity-1' : 'opacity-0 pointer-events-none'
                } text-white flex bg-zinc-500 hover:bg-zinc-800 fixed bottom-32 right-5 z-50 w-12 h-12 items-center justify-center rounded-full transition-all duration-200`}
            >
                <CaretUp size={24} />
            </a>
            <footer className="bg-black text-white px-10 py-6 space-y-8">
                <div className="flex flex-row gap-4 justify-start items-center">
                    <span className="transition-all duration-200 hover:border-white border-b border-transparent cursor-pointer">
                        Troca de voucher
                    </span>
                    <span className="transition-all duration-200 hover:border-white border-b border-transparent cursor-pointer">
                        Política de Privacidade
                    </span>
                    <span className="transition-all duration-200 hover:border-white border-b border-transparent cursor-pointer">
                        Política de cookies
                    </span>
                    <span className="transition-all duration-200 hover:border-white border-b border-transparent cursor-pointer">
                        SAC
                    </span>
                </div>
                <div className="flex flex-row justify-center items-center">
                    <Image
                        src="/flags/footer.png"
                        alt="Footer"
                        width={448}
                        height={40}
                    />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <span className="font-bold uppercase">Powered by</span>
                    <div className="flex flex-row space-x-4">
                        <Image
                            src="/flags/eleven.png"
                            alt="Logo"
                            width={96}
                            height={24}
                        />
                        <Image
                            src="/flags/imply.png"
                            alt="Logo"
                            width={96}
                            height={24}
                        />
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
