'use client'
import { CreditCard, Minus, Plus } from '@phosphor-icons/react'
import { FC, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

import { ArrowRight } from '@/icons'

import Image from 'next/image'
import api from '@/utils/api'
import getBRL from '@/utils/getBRL'
import getPriceWithDiscount from '@/utils/getPriceWithDiscount'

import { Product } from '@/types/product.type'

const ProductForm: FC<Product & { client: { ipAddress: string } }> = ({
    client,
    ...product
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [amount, setAmount] = useState(1)
    const [userLocation, setUserLocation] = useState<{
        city: string
        region: string
    } | null>(null)

    const router = useRouter()
    const params = useParams()

    const getUserLocation = async () => {
        const { data } = await axios.get<{ city: string; region_code: string }>(
            `https://ipapi.co/${client.ipAddress?.split(',')[0].trim()}/json`,
        )

        setUserLocation({
            city: data.city,
            region: data.region_code,
        })
    }

    const handleDecrementAmount = () => {
        if (amount - 1 >= 1) {
            setAmount(amount - 1)
        }
    }

    const handleIncrementAmount = () => {
        setAmount(amount + 1)
    }

    const handlePurchase = async () => {
        setIsLoading(true)
        const response = await api.post('/carts', {
            productId: product.id,
            amount,
        })

        router.push('/cart')
    }

    useEffect(() => {
        // registra o clique
        api.post(`products/${params.id}/clicks`)

        // pega a localização do usuário
        getUserLocation()
    }, [])

    return (
        <div className="bg-white w-full text-lg flex-shrink-0 self-start shadow-lg rounded-3xl overflow-hidden">
            <div className="bg-[#572c88] text-white p-4">
                Ingressos
            </div>
            <div className="p-4">
                <div>
                    <h4 className="text-gray-600">{product.name}</h4>
                    <span className="text-sm text-green-600">
                        Ingressos disponíveis para compra
                    </span>
                </div>
                <div className="border-b my-4" />
                <div className="flex items-center gap-2">
                    <div className="inline-block p-1 px-2 rounded-full border border-gray-700 text-gray-700 text-sm">
                        Qtd | {amount}
                    </div>
                    <button 
                        className="flex items-center justify-center w-7 h-7 border border-gray-700 rounded-full" 
                        onClick={handleDecrementAmount}
                    >
                        <Minus size={16} />
                    </button>
                    <button 
                        className="flex items-center justify-center w-7 h-7 border border-gray-700 rounded-full" 
                        onClick={handleIncrementAmount}
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="mt-7">
                    <h6 className="font-bold">Total</h6>
                    <p>
                        {getBRL(
                            getPriceWithDiscount(product.price, product.discount)
                            * amount
                        )}
                    </p>
                    {product.discount > 0 && (
                        <small className="line-through text-gray-400">
                            {getBRL(product.price * amount)}
                        </small>
                    )}
                </div>
                {/* <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-10">
                        <span>Preço</span>
                        <div className="flex flex-col">
                            {product.discount ? (
                                <span className="line-through text-gray-400 text-sm">
                                    {getBRL(product.price)}
                                </span>
                            ) : (
                                ''
                            )}
                            <div className="flex gap-4">
                                <span className="text-2xl font-bold">
                                    {getBRL(getPriceWithDiscount())}
                                </span>
                                {product.discount ? (
                                    <span className="self-center bg-[#572c88] text-white font-bold px-4 rounded">
                                        {product.discount}%
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                            <span className="text-gray-400 text-sm">
                                Em até 12x de&nbsp;
                                <span className="font-bold">
                                    {getBRL(product.price / 12)}
                                </span>
                            </span>
                            {product.discount ? (
                                <div className="self-start text-white bg-[#572c88] rounded font-bold px-4 py-1 text-xs mt-2">
                                    {getBRL(product.price - getPriceWithDiscount())}{' '}
                                    de desconto
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <span>Classificação</span>
                        <div className="flex flex-row items-center">
                            <span className="py-2 px-3 rounded bg-green-600 text-white font-bold leading-none mr-4">
                                L
                            </span>
                            <span>Livre para todas as idades</span>
                        </div>
                    </div>
                </div> */}
                <div className="flex flex-col gap-4 mt-10">
                    <button
                        type="button"
                        className="w-full bg-[#3ca500] py-3 px-8 mt-4 uppercase flex items-center justify-center gap-4 text-white rounded-full"
                        onClick={handlePurchase}
                    >
                        {isLoading && (
                            <div className='w-4 h-4 border-4 border-white border-t-gray-300 rounded-full animate-spin' />
                        )}
                        Adicionar ao carrinho
                    </button>
                    {/* <div className="flex bg-gray-200 rounded overflow-hidden">
                        <button
                            className="py-4 px-6 hover:bg-gray-300 transition-colors"
                            onClick={handleDecrementAmount}
                        >
                            <Minus size={16} />
                        </button>
                        <div className="flex flex-grow justify-center items-center self-center">
                            {amount}
                        </div>
                        <button
                            className="py-4 px-6 hover:bg-gray-300 transition-colors"
                            onClick={handleIncrementAmount}
                        >
                            <Plus size={16} />
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ProductForm
