'use client'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { object, string } from 'yup'
import { AxiosError } from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { X } from '@/icons'

import Cookies from 'js-cookie'

import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import useUser from '@/utils/useUser'
import { useEffect } from 'react'

const SignIn: NextPage = () => {
    const { register, handleSubmit } = useForm()

    const { user } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const onSubmit = async (data: any) => {
        const loginSchema = object({
            password: string().required('É obrigatório informar uma senha.'),
            email: string().required(
                'É obrigatório informar um email de acesso.',
            ),
        })

        try {
            const user = await loginSchema.validate(data)
            const response = await api.post<{
                Message: string
                Data: { token: string }
            }>('/auth/login', user)

            Cookies.remove('authorization')
            Cookies.set('authorization', response.data.Data.token)

            toast.success(response.data.Message)
            setTimeout(() => {
                window.location.href = redirect
                    ? '/' + redirect
                    : '/'
            }, 2000)
        } catch (err: any) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.Message)
            } else {
                toast.error(err.message)
            }
        }
    }

    return (
        <div className="bg-white w-full min-h-screen">
            <Header />
            <div className="flex flex-col items-center w-[350px] mx-auto py-20">
                <h1 className="w-[90vw] text-black font-medium text-2xl flex items-center justify-center text-center mb-8">
                    Acesse sua conta
                </h1>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col mt-4">
                        <label className="text-xs mb-1">
                            Email <b className="text-red-500">*</b>
                        </label>
                        <input
                            type="text"
                            className="px-4 py-4 border-b focus:outline-none"
                            {...register('email')}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-xs mb-1">
                            Senha <b className="text-red-500">*</b>
                        </label>
                        <input
                            type="password"
                            className="px-4 py-4 border-b focus:outline-none"
                            {...register('password')}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#3ca500] py-3 px-8 rounded mt-4 uppercase flex items-center justify-center text-white"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center w-full">
                    <Link
                        href={`/signup${redirect ? `?redirect=${redirect}` : ''}`}
                        className="w-full bg-[#003986] py-3 px-8 rounded mt-4 uppercase flex items-center justify-center text-white"
                    >
                        Cadastre-se
                    </Link>
                    <Link
                        href="/signup"
                        className="w-full bg-[#003986] py-3 px-8 rounded mt-4 uppercase flex items-center justify-center text-white"
                    >
                        Recuperar senha
                    </Link>
                    <div className="flex items-center gap-2 w-full my-4">
                        <hr className="flex-grow" />
                        <span className="text-sm text-gray-400">OU</span>
                        <hr className="flex-grow" />
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-start w-full bg-[#2f302f] py-3 px-6 rounded text-white uppercase"
                        onClick={() => {
                            router.push(
                                `/facebook${
                                    redirect ? '?redirect=signup' : ''
                                }`,
                            )
                        }}
                    >
                        <div className="pe-4">
                            <svg
                                viewBox="0 0 24 24"
                                role="presentation"
                                style={{ width: '24px', height: '24px' }}
                            >
                                <path
                                    d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                                    style={{ fill: '#0866ff' }}
                                ></path>
                            </svg>
                        </div>
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignIn
