'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, number } from 'yup'
import InputMask from 'react-input-mask'

import { FC } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'

import getCreditCardFlag from '@/utils/getCreditCardFlag'
import validateCPF from '@/utils/validateCPF'
import api from '@/utils/api'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import useAPI from '@/utils/useAPI'
import { ClipboardText } from '@/icons'
import { Modal } from '@mui/material'

import { X } from '@phosphor-icons/react'
import { useRouter, useSearchParams } from 'next/navigation'
import useUser from '@/utils/useUser'
import getBRL from '@/utils/getBRL'

enum PaymentType {
    PIX = 'PIX',
    CARD = 'CREDIT_CARD',
}

const CheckoutPersonalForm: FC = () => {
    const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.PIX)
    const [cardFlag, setCardFlag] = useState('/flags/visa.svg')
    const [currentStep, setCurrentStep] = useState<1 | 2>(1)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    const [preventSubmit, setPreventSubmit] = useState(false)

    const { register, handleSubmit, watch, setValue } = useForm()

    const cepValue = watch('cep')
    const deliveryTax = watch('delivery_tax')

    const swiperRef = useRef<SwiperRef | null>(null)
    const copiaEColaRef = useRef<HTMLInputElement | null>(null)

    const { data: pixPaymentData } = useAPI<any>(
        `/carts/payment${deliveryTax ? '?delivery_tax=' + deliveryTax : ''}`,
        {
            revalidateOnFocus: false,
        },
    )
    const { data: cart } = useAPI<any[]>('/carts')

    const { user } = useUser()
    const router = useRouter()

    const handleFindCardFlag = (e: any) => {
        setCardFlag(getCreditCardFlag(e.target.value.replaceAll(/\D/g, '')))
    }

    const onSubmit = async (data: any) => {
        const removeAllNonNumbers = (value: string) =>
            value.replaceAll(/\D/g, '')

        setPreventSubmit(true)

        const deliveryAddressSchema = object({
            cep: string()
                .required('É obrigatório especificar um cep.')
                .transform(removeAllNonNumbers)
                .matches(/^\d+$/, 'O cep só pode contar números.')
                .min(8, 'O CEP deve possuir exatamente 8 dígitos')
                .max(8, 'O CEP deve possuir exatamente 8 dígitos'),
            city: string().required('É obrigatório especificar uma cidade.'),
            neighborhood: string().required(
                'É obrigatório especificar um bairro.',
            ),
            address: string().required(
                'É obrigatório especificar um endereço.',
            ),
            address_number: number().required(
                'É obrigatório especificar um número de endereço.',
            ),
            delivery_tax: string()
                .matches(/(?:GRATIS|PAGA)/)
                .required('É necessário escolher uma forma de entrega.'),
        })

        const cardSchema = object({
            cvv: string()
                .required(
                    'É obrigatório preencher código de segurança do cartão.',
                )
                .matches(
                    /^\d+$/,
                    'O código de segurança do cartão deve conter somente números.',
                )
                .min(
                    3,
                    'O código de segurança do cartão deve possuir no minimo 3 dígitos.',
                )
                .max(
                    4,
                    'O código de segurança do cartão deve possuir no máximo 4 dígitos.',
                ),
            validity: string()
                .required('É obrigatório preencher a validade do cartão.')
                .matches(
                    /^\d{2}\/\d{2}$/,
                    'A validade do cartão deve estar no formato 00/00. 12/25.',
                ),
            card_cpf: string()
                .transform(removeAllNonNumbers)
                .required('É obrigatório preencher o cpf do titular do cartão.')
                .min(11, 'O CPF do titular deve conter 11 números.')
                .max(11, 'O CPF do titular deve conter 11 números.')
                .matches(
                    /^\d+$/,
                    'O cpf do titular do cartão deve conter somente números.',
                )
                .test(
                    'cpf-validation',
                    'O CPF inserido é inválido.',
                    validateCPF,
                ),
            card_name: string()
                .required(
                    'É obrigatório preencher o nome do titular do cartão.',
                )
                .matches(
                    /^[A-Za-z\s]+$/,
                    'O noome do titular do cartão deve conter somente letras e espaço.',
                ),
            card_number: string()
                .required('É obrigatório preencher o número do cartão.')
                .transform(removeAllNonNumbers)
                .min(15, 'O número do cartão deve conter no mínimo 15 dígitos.')
                .max(19, 'O número do cartão deve conter no máximo 16 dígitos.')
                .matches(
                    /^\d+$/,
                    'O número do cartão deve conter somente números.',
                )
                .test(
                    'card-number-validation',
                    'O número do cartão inserido é inválido',
                    (value) => !!getCreditCardFlag(value),
                ),
            password: string().required(
                'É obrigatório preencher a senha do cartão.',
            ),
        })

        try {
            const deliveryAddress = await deliveryAddressSchema.validate({
                cep: data.cep,
                city: data.city,
                neighborhood: data.neighborhood,
                address: data.address,
                address_number: data.address_number,
                delivery_tax: data.delivery_tax,
            })

            let card
            if (paymentType === PaymentType.CARD)
                card = await cardSchema.validate({
                    cvv: data.cvv,
                    validity: data.validity,
                    card_cpf: data.card_cpf,
                    card_name: data.card_name,
                    card_number: data.card_number,
                    password: data.password,
                })

            if (!user) {
                toast.error(
                    'Ocorreu um erro ao processar o checkout, faça login.',
                )
                return
            }

            const response = await api.post('products/purchase', {
                personal_data: {
                    phone: user.phone,
                    name: user.name,
                },
                delivery_address: deliveryAddress,
                credit_card: card,
                paymentType,
                cart: [],
            })

            if (paymentType === PaymentType.CARD)
                toast.error(
                    'Erro ao pagar usando cartão de crédito. Esta promoção só está disponível via PIX.',
                )
            else if (paymentType === PaymentType.PIX) {
                toast.success('Compra finalizada com sucesso.')
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            }
        } catch (err: any) {
            toast.error(err.message)
        }
        setPreventSubmit(false)
    }

    const totalPrice = useMemo(() => {
        let totalPrice = 0
        cart?.forEach((item) => {
            totalPrice += item.product.price * item.amount
        })

        if (deliveryTax === 'PAGA') {
            totalPrice += 10
        }

        return totalPrice
    }, [cart, deliveryTax])

    useEffect(() => {
        if (user === false) {
            router.push('cart')
        }
    }, [user])

    useEffect(() => {
        if (cepValue && cepValue.replaceAll(/\D/g, '').length === 8)
            api.get<{
                localidade: string
                bairro: string
                logradouro: string
            }>(
                `https://viacep.com.br/ws/${cepValue.replaceAll(
                    /\D/g,
                    '',
                )}/json`,
            ).then(({ data }) => {
                setValue('city', data.localidade)
                setValue('neighborhood', data.bairro)
                setValue('address', data.logradouro)
            })
    }, [cepValue])

    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <ul className="flex lg:hidden items-center p-3">
                <li
                    className={`flex text-white bg-primary w-9 h-9 rounded-full justify-center items-center`}
                >
                    1
                </li>
                <li
                    className={`flex ${
                        currentStep >= 2
                            ? 'bg-primary text-white'
                            : 'bg-gray-200'
                    } h-2 flex-grow`}
                />
                <li
                    className={`flex ${
                        currentStep >= 2
                            ? 'bg-primary text-white'
                            : 'bg-gray-200'
                    } w-9 h-9 rounded-full justify-center items-center`}
                >
                    2
                </li>
                <li
                    className={`flex ${
                        currentStep >= 3
                            ? 'bg-primary text-white'
                            : 'bg-gray-200'
                    } h-2 flex-grow`}
                />
                <li
                    className={`flex ${
                        currentStep >= 3
                            ? 'bg-primary text-white'
                            : 'bg-gray-200'
                    } w-9 h-9 rounded-full justify-center items-center`}
                >
                    3
                </li>
            </ul>
            <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={16}
                allowTouchMove={false}
                breakpoints={{
                    1028: {
                        slidesPerView: 2,
                    },
                }}
            >
                <SwiperSlide className="py-6">
                    <section className="p-6 rounded w-full">
                        <div className="flex gap-4">
                            <div className="hidden lg:flex justify-center items-center h-8 w-8 rounded-full bg-primary text-white">
                                1
                            </div>
                            Endereço de Faturamento
                        </div>
                        <div className="mt-4">
                            <label htmlFor="cep" className="text-xs">
                                CEP <b className="text-red-500">*</b>
                            </label>
                            <InputMask
                                id="cep"
                                type="string"
                                mask="99999-999"
                                alwaysShowMask={false}
                                maskPlaceholder=""
                                className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                placeholder="05401-350"
                                {...register('cep')}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="city" className="text-xs">
                                Cidade <b className="text-red-500">*</b>
                            </label>
                            <input
                                id="city"
                                type="text"
                                className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                placeholder="São Paulo"
                                {...register('city')}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="neighborhood" className="text-xs">
                                Bairro <b className="text-red-500">*</b>
                            </label>
                            <input
                                id="neighborhood"
                                type="text"
                                className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                placeholder="Pinheiros"
                                {...register('neighborhood')}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-4 flex-grow">
                                <label htmlFor="address" className="text-xs">
                                    Endereço <b className="text-red-500">*</b>
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                    placeholder="Avenida Rebouças"
                                    {...register('address')}
                                />
                            </div>
                            <div className="mt-4">
                                <label
                                    htmlFor="address_number"
                                    className="text-xs"
                                >
                                    Número <b className="text-red-500">*</b>
                                </label>
                                <input
                                    id="address_number"
                                    type="number"
                                    className="block px-4 py-4 border-b focus:outline-none bg-transparent w-20"
                                    placeholder="37"
                                    {...register('address_number', {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                        </div>
                        <div className="flex lg:hidden justify-between mt-4">
                            <button
                                type="button"
                                className="px-4 py-3 bg-[#3ca500] rounded text-white"
                                onClick={() => {
                                    swiperRef.current?.swiper.slideNext()
                                    setCurrentStep(2)
                                }}
                            >
                                Próximo
                            </button>
                        </div>
                        <h4 className="mt-4 !hidden">Forma de entrega</h4>
                        <label className="!opacity-0 !h-0 !w-0">
                            <input
                                type="radio"
                                value="GRATIS"
                                checked
                                className="!opacity-0 !h-0 !w-0"
                                {...register('delivery_tax')}
                            />
                            <input
                                type="radio"
                                value="PAGA"
                                className="!opacity-0 !h-0 !w-0"
                                {...register('delivery_tax')}
                            />
                        </label>
                    </section>
                </SwiperSlide>
                <SwiperSlide className="py-6">
                    <section className="p-6 rounded-lg w-full">
                        <div className="flex gap-4">
                            <div className="hidden lg:flex justify-center items-center h-8 w-8 rounded-full bg-primary text-white">
                                2
                            </div>
                            Pagamento
                        </div>
                        <p className="text-gray-600 text-sm mt-4">
                            Escolha o tipo de pagamento{' '}
                            <b className="text-red-500">*</b>
                        </p>
                        <div className="flex gap-5">
                            <button
                                type="button"
                                className={`!hidden hover:shadow-md transition-all px-3 rounded-lg ${
                                    paymentType === PaymentType.CARD
                                        ? 'bg-gray-100'
                                        : ''
                                }`}
                                onClick={() => setPaymentType(PaymentType.CARD)}
                            >
                                <Image
                                    src="/credit-card.jpg"
                                    alt=""
                                    width={60}
                                    height={24}
                                />
                            </button>
                            <button
                                type="button"
                                className={`hover:shadow-md transition-all px-3 rounded-lg ${
                                    paymentType === PaymentType.PIX
                                        ? 'bg-gray-100'
                                        : ''
                                }`}
                                onClick={() => setPaymentType(PaymentType.PIX)}
                            >
                                <Image
                                    src="/pix.svg"
                                    alt=""
                                    width={60}
                                    height={24}
                                />
                            </button>
                        </div>
                        {paymentType === PaymentType.CARD ? (
                            <>
                                <div className="mt-4">
                                    <label
                                        htmlFor="card_number"
                                        className="text-xs"
                                    >
                                        Número do cartão{' '}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <div className="flex gap-4">
                                        <InputMask
                                            id="card_number"
                                            type="text"
                                            mask="9999 9999 9999 9999"
                                            alwaysShowMask={false}
                                            maskPlaceholder=""
                                            className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                            placeholder="0000 0000 0000 0000"
                                            {...register('card_number', {
                                                required: true,
                                                onChange: handleFindCardFlag,
                                            })}
                                        />
                                        {cardFlag && (
                                            <Image
                                                src={cardFlag}
                                                alt="brand"
                                                width={50}
                                                height={34}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="card_name"
                                        className="text-xs"
                                    >
                                        Nome do titular (como está no cartão){' '}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <input
                                        id="card_name"
                                        type="text"
                                        className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                        placeholder="GABRIELA LIMA"
                                        {...register('card_name', {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        htmlFor="card_cpf"
                                        className="text-xs"
                                    >
                                        CPF do titular{' '}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <InputMask
                                        id="card_cpf"
                                        type="text"
                                        mask="999.999.999-99"
                                        alwaysShowMask={false}
                                        maskPlaceholder=""
                                        className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                        placeholder="000.000.000-00"
                                        {...register('card_cpf', {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <div>
                                        <label
                                            htmlFor="card_validity"
                                            className="text-xs"
                                        >
                                            Validade{' '}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <InputMask
                                            id="card_validity"
                                            type="text"
                                            mask="99/99"
                                            alwaysShowMask={false}
                                            maskPlaceholder=""
                                            className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                            placeholder="00/00"
                                            {...register('validity')}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="card_cvv"
                                            className="text-xs"
                                        >
                                            CVV{' '}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <input
                                            id="card_cvv"
                                            type="text"
                                            className="block w-full px-4 py-4 border-b focus:outline-none bg-transparent"
                                            placeholder="000"
                                            maxLength={4}
                                            minLength={3}
                                            {...register('cvv', {
                                                required: true,
                                                pattern: /^\d+$/,
                                            })}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-[#3ca500] py-3 px-8 rounded uppercase flex items-center justify-center text-white self-end"
                                        onClick={() => {
                                            if (!watch('delivery_tax'))
                                                return toast.error(
                                                    'É necessário escolher uma forma de entrega',
                                                )

                                            setShowPasswordModal(true)
                                        }}
                                    >
                                        Pagar agora
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mt-5">
                                <h5>
                                    Realize o pagamento utilizando PIX via QR
                                    Code ou com chave copia e cola
                                </h5>
                                <div className="flex flex-col items-center mt-6">
                                    <h3 className="text-green-500 text-xl font-bold">
                                        {getBRL(totalPrice)}
                                    </h3>
                                    <button
                                        type="button"
                                        className="bg-[#3ca500] py-2 px-6 rounded uppercase flex items-center justify-center text-white"
                                        onClick={() => {
                                            if (!watch('delivery_tax'))
                                                return toast.error(
                                                    'É necessário escolher uma forma de entrega',
                                                )

                                            setShowPaymentModal(true)
                                        }}
                                    >
                                        Pagar agora
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-20 mt-5">
                            <button
                                type="button"
                                className="xl:hidden bg-red-500 py-3 px-8 rounded uppercase flex items-center justify-center text-white"
                                onClick={() => {
                                    swiperRef.current?.swiper.slidePrev()
                                    setCurrentStep(2)
                                }}
                            >
                                Anterior
                            </button>
                        </div>
                    </section>
                </SwiperSlide>
            </Swiper>

            <Modal
                open={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            >
                <div className="bg-white w-full lg:w-[700px] mt-[300px] mx-auto p-4">
                    <div className="flex justify-end">
                        <button
                            className="group p-1 hover:bg-gray-100 transition-colors rounded"
                            onClick={() => setShowPasswordModal(false)}
                        >
                            <X
                                size={20}
                                className="text-gray-500 group-hover:text-red-500"
                            />
                        </button>
                    </div>
                    <h2 className="text-xl">ID Check</h2>
                    <p className="text-sm">Confirmar transação</p>
                    <div className="flex items-center gap-3 mt-4">
                        <label className="text-sm text-gray-600">
                            Digite sua senha de 4 ou 6 dígitos:
                        </label>
                        <input
                            type="password"
                            className="py-2 px-5 rounded-lg border"
                            minLength={4}
                            maxLength={6}
                            {...register('password')}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="py-2 px-4 rounded-lg bg-[#3ca500] text-white"
                            onClick={() => handleSubmit(onSubmit)()}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
            >
                <div className="bg-white w-full h-screen lg:w-[700px] md:h-auto md:mt-[150px] mx-auto py-4 px-8 rounded">
                    <div className="flex justify-end">
                        <button
                            className="group p-1 rounded hover:bg-gray-100 transition-colors"
                            onClick={() => setShowPaymentModal(false)}
                        >
                            <X
                                size={20}
                                className="text-gray-500 group-hover:text-red-500"
                            />
                        </button>
                    </div>
                    <h4 className="text-center mb-10">Pagar com PIX</h4>
                    <h3 className="text-center text-green-500 text-xl font-bold">
                        {getBRL(totalPrice)}
                    </h3>
                    <Image
                        className="mx-auto"
                        src={pixPaymentData?.data.qrcode}
                        alt=""
                        width={150}
                        height={150}
                    />
                    <p className="text-gray-600 ont-bold my-2 text-center text-xs">
                        OU
                    </p>
                    <p className="text-center text-sm mb-2">
                        Copie e cole a chave abaixo no aplicativo do seu banco
                    </p>
                    <div className="flex justify-center">
                        <input
                            ref={copiaEColaRef}
                            className="py-3 px-6 border rounded-s-lg w-[200px]"
                            value={pixPaymentData?.data.copiaECola}
                        />
                        <button
                            type="button"
                            className="bg-gray-100 px-4 hover:bg-gray-200 transition-colors rounded-e-lg"
                            onClick={() => {
                                if (copiaEColaRef.current) {
                                    window.navigator.clipboard.writeText(
                                        copiaEColaRef.current.value,
                                    )
                                    toast.success('Chave copiada com sucesso.')
                                }
                            }}
                        >
                            <ClipboardText size={20} />
                        </button>
                    </div>
                    <div className="mt-4 flex justify-center mb-4">
                        <button
                            type="button"
                            className="flex gap-2 py-2 px-4 rounded-lg bg-[#3ca500] disabled:opacity-80 text-white"
                            onClick={() => handleSubmit(onSubmit)()}
                            disabled={preventSubmit}
                        >
                            {preventSubmit && (
                                <div className="w-5 h-5 rounded-full bg-transparent border-2 border-transparent border-b-gray-200 animate-spin" />
                            )}
                            Confirmar pagamento
                        </button>
                    </div>
                </div>
            </Modal>
        </form>
    )
}

export default CheckoutPersonalForm
