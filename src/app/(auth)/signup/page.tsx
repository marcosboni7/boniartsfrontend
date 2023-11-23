'use client'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { object, string } from 'yup'
import InputMask from 'react-input-mask'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { X } from '@/icons'

import api from '@/utils/api'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'

const SignUp: NextPage = () => {
    const { register, handleSubmit } = useForm()
    const router = useRouter()

    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const removeAllNonNumbers = (value: string) => value.replaceAll(/\D/g, '')

    const onSubmit = async (data: any) => {
        const signUpSchema = object({
            password: string().required('É obrigatório informar uma senha.'),
            phone: string()
                .transform(removeAllNonNumbers)
                .matches(
                    /^\d{11}$/,
                    'O número de telefone deve possuir apenas 11 dígitos.',
                )
                .required('É obrigatório informar um telefone.'),
            cpf: string()
                .transform(removeAllNonNumbers)
                .matches(/^\d{11}$/, 'O cpf deve possuir apenas 11 dígitos.')
                .required('É obrigatório informar um cpf.'),
            email: string().required(
                'É obrigatório informar um email de acesso.',
            ),
            name: string()
                .matches(
                    /^[A-Za-z\s]+$/,
                    'O seu nome deve possuir somente letras e espaços.',
                )
                .required('É obrigatório informar seu nome completo.'),
        })

        try {
            const user = await signUpSchema.validate(data)
            const responseRegister = await api.post<{
                Message: string
                Data: { token: string }
            }>('/auth/register', user)

            const responseLogin = await api.post<{
                Message: string
                Data: { token: string }
            }>('/auth/login', {
                email: user.email,
                password: user.password,
            })

            Cookies.remove('authorization')
            Cookies.set('authorization', responseLogin.data.Data.token)

            window.location.href = redirect ? redirect : '/'
            toast.success(responseRegister.data.Message)
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
            {/* <div className="flex flex-row items-center justify-between bg-[#2f302f] h-20 px-4">
                <div className="flex flex-row items-center">
                    <Image src="/favicon.ico" alt="" width={64} height={64} />
                    <span className="text-white font-medium text-2xl">
                        Cadastre-se
                    </span>
                </div>
                <Link href="/">
                    <X size={24} weight="bold" className="text-white" />
                </Link>
            </div> */}
            <Header />
            <div className="flex flex-col items-center w-[350px] mx-auto py-20">
                <h1 className="w-[90vw] text-black font-medium text-2xl flex items-center justify-center text-center mb-8">
                    Cadastre-se em nossa plataforma
                </h1>
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <h4 className="text-md w-[400px] relative -left-[25px]">
                        Dados Cadastrais
                    </h4>
                    <hr className="my-5 w-[400px] relative -left-[25px]" />
                    <div className="flex flex-col mt-16">
                        <label className="text-xs mb-1">
                            Nome completo <b className="text-red-500">*</b>
                        </label>
                        <input
                            type="text"
                            className="px-4 py-4 border-b focus:outline-none"
                            {...register('name')}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-xs mb-1">
                            CPF <b className="text-red-500">*</b>
                        </label>
                        <InputMask
                            type="text"
                            alwaysShowMask={false}
                            maskPlaceholder=""
                            mask="999.999.999-99"
                            className="px-4 py-4 border-b focus:outline-none"
                            {...register('cpf')}
                        />
                    </div>
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
                    <div className="flex flex-col mt-4">
                        <label className="text-xs mb-1">
                            Celular <b className="text-red-500">*</b>
                        </label>
                        <InputMask
                            type="text"
                            alwaysShowMask={false}
                            maskPlaceholder=""
                            mask="99 9 9999-9999"
                            className="px-4 py-4 border-b focus:outline-none"
                            {...register('phone')}
                        />
                    </div>
                    <h4 className="text-md w-[400px] relative -left-[25px] mt-16">
                        Dados obrigatórios
                    </h4>
                    <hr className="my-5 w-[400px] relative -left-[25px]" />
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-start">
                            <input className="w-4 h-4 mr-3" type="checkbox" />
                            <span>
                                Li e aceito{' '}
                                <a className="cursor-pointer text-blue-700">
                                    o termo
                                </a>
                            </span>
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <input className="w-4 h-4 mr-3" type="checkbox" />
                            <span>Quero receber a newsletter</span>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#3ca500] py-3 px-8 rounded mt-4 uppercase flex items-center justify-center text-white"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
