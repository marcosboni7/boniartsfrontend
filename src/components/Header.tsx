'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { FC, FormEvent } from 'react'

import useUser from '@/utils/useUser'

import { CaretDown, Gear, User, SignOut, ShoppingCart, MagnifyingGlass } from '@/icons'

const Header: FC = () => {
    const { user, logout } = useUser()
    const router = useRouter()

    const search = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        
        const query = (evt.target as any).search.value
        router.push(`/resultados?query=${query}`)
    }

    return (
        <header className="sticky top-0 xl:h-20 bg-[#572c88] z-40 pb-4 xl:pb-0 px-2">
            <div className="h-full w-full xl:w-[1200px] flex flex-wrap xl:flex-nowrap justify-between items-center gap-8 mx-auto">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={200} height={56} />
                </Link>
                <div className="order-3 xl:order-none flex-grow">
                    <form 
                        className='flex bg-white px-6 rounded-full' 
                        onSubmit={search}
                    >
                        <input 
                            name="search"
                            className="py-2 focus:outline-0 flex-grow" 
                            placeholder='Buscar eventos, shows, teatros' 
                            autoComplete='off'
                        />
                        <button type="submit">
                            <MagnifyingGlass size={24} />
                        </button>
                    </form>
                </div>
                <div className="flex gap-2 lg:gap-8 items-center">
                    
                    {!!user && !!user.admin && (
                        <Link
                            href="/admin/dashboard"
                            className="text-white flex items-center transition-all duration-200 hover:border-white border-b border-transparent space-x-3"
                        >
                            <Gear size={18} weight="bold" />
                            <span className="hidden lg:block">
                                Painel
                            </span>
                        </Link>
                    )}
                    {!user ? (
                        <Link
                            href="/signin"
                            className="text-white flex items-center transition-all duration-200 hover:border-white border-b border-transparent space-x-3"
                        >
                            <User size={18} weight="bold" />
                            <span className="hidden lg:block">Login</span>
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className="text-white flex items-center transition-all duration-200 hover:border-white border-b border-transparent space-x-3"
                        >
                            <SignOut size={18} weight="bold" />
                        </button>
                    )}
                    <Link
                        href="/cart"
                        className="text-white flex items-center transition-all duration-200 hover:border-white border-b border-transparent space-x-3"
                    >
                        <ShoppingCart size={18} weight="bold" />
                    </Link>
                    <span className="flex space-x-2 items-center cursor-pointer">
                        <span className="text-white font-bold">
                            PT
                        </span>
                        <Image
                            src="/flags/brazil.png"
                            alt="Flag Brazil"
                            width={32}
                            height={32}
                            className=""
                        />
                        {/* <CaretDown size={16} className="text-white flex-shrink-0" /> */}
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header
