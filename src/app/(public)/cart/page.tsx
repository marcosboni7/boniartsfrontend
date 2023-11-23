'use client'
import { FC, useEffect, useState, useMemo } from 'react'
import moment from 'moment'

import Link from 'next/link'
import getBRL from '@/utils/getBRL'
import useAPI from '@/utils/useAPI'
import api from '@/utils/api'
import { toast } from 'react-toastify'

import { ArrowLeft, Trash } from '@/icons'

import CartItem from '@/components/Cart/Item'
import Image from 'next/image';

import { Product } from '@/types/product.type'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import useUser from '@/utils/useUser'

import 'moment/locale/pt-br'
import ProductCard from '@/components/Product/Card'
import { Config } from '@/types/config.type'
import getPriceWithDiscount from '@/utils/getPriceWithDiscount'

const Cart: FC = () => {
    const [items, setItems] = useState<
        { id: string; product: Product; amount: number }[]
    >([])
    const [isLoading, setIsLoading] = useState(false)

    const { data: cartData, mutate } = useAPI<
        { id: string; product: Product; amount: number }[] | undefined
    >(`carts`)
    const { data: relatedProducts } = useAPI<Product[]>('/products?take=3&skip=0')
    const { data: config } = useAPI<Config>('config')

    const { user } = useUser()
    const router = useRouter()

    moment().locale('pt-br')

    const handleSubmit = async () => {
        setIsLoading(true)
        await Promise.all(
            items.map(async (item) => {
                await api.patch(`/carts/${item.id}`, {
                    amount: item.amount,
                })
            }),
        )

        router.push(user ? 'checkout/pagamento' : '/signin?redirect=/checkout/pagamento')
    }

    const getTotalPrice = () => {
        let total_price: number = 0
        items?.forEach((item) => {
            //const item_price = item.product.price

            total_price += getPriceWithDiscount(item.product.price, item.product.discount) * item.amount
        })

        return total_price
    }

    const getTotalAmount = () => {
        let total_amount: number = 0
        items?.forEach((item) => {
            total_amount += item.amount;
        })

        return total_amount
    }

    const onItemAmountChange = (productId: number, newAmount: number) => {
        setItems((old) =>
            old.map((item) => {
                if (item.product.id === productId)
                    return {
                        ...item,
                        product: {
                            ...item.product,
                        },
                        amount: newAmount,
                    }

                return item
            }),
        )
    }

    const onProductRemove = async (productId: string) => {
        try {
            const response = await api.delete<{ Message: string }>(
                `/carts/${productId}`,
            )
            mutate()
            toast.success(response.data.Message)
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.Message)
            }
        }
    }

    const totalPrice = useMemo(getTotalPrice, [items])
    const totalAmount = useMemo(getTotalAmount, [items])

    const serviceTax = config?.service_tax_percentage

    useEffect(() => {
        if (cartData) setItems(cartData)
    }, [cartData])

    return (
        <main className="w-full xl:w-[1200px] mx-auto">
            <section className="py-12 px-4 lg:px-0">
                <h4 className="text-lg lg:text-2xl font-bold text-center">Resumo da compra</h4>
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr),376px] mt-8 gap-8">
                    <div className="space-y-8">
                        {items?.map(({ id, amount, product }) => (
                            <div key={id} className="flex gap-6">
                                <Image 
                                    src={`${api.defaults.baseURL}/uploads/${product.image}`}
                                    alt="Imagem produto"
                                    width={176}
                                    height={300}
                                    className="flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <h4 className="flex-grow text-base lg:text-2xl font-bold text-gray-600 line-clamp-3 break-words whitespace-normal">
                                            {product.name}
                                        </h4>
                                        <button 
                                            className="hover:bg-neutral-200 p-2 rounded-lg transition-colors duration-200"
                                            onClick={() => onProductRemove(id)}
                                        >
                                            <Trash size={28} />
                                        </button>
                                    </div>
                                    <p className="text-neutral-500 mt-4 text-xs lg:text-base">
                                        {moment(product.schedule).format('dddd, D [de] MMMM [de] YYYY')}
                                    </p>
                                    <div className="flex w-12 h-2 bg-gray-400 rounded-full my-4" />
                                    <p className="text-base lg:text-2xl font-semibold text-neutral-500">
                                        {getBRL(getPriceWithDiscount(product.price, product.discount) * amount)}
                                    </p>
                                    <table className="w-full mt-4">
                                        <thead>
                                            <tr className="text-neutral-500">
                                                <th></th>
                                                <th className="text-start text-xs lg:text-base">Tipo do ingresso</th>
                                                <th className="text-start text-xs lg:text-base">Data da visita</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-neutral-500 py-4 align-top">
                                                    <p className="me-2 text-xs lg:text-base">
                                                        {amount}x
                                                    </p>
                                                </td>
                                                <td className="text-neutral-500 py-4 align-top">
                                                    <p className="text-xs lg:text-lg">
                                                        {product.name}
                                                    </p>
                                                    <strong className="text-xs lg:text-base">
                                                        {getBRL(getPriceWithDiscount(product.price, product.discount))}
                                                    </strong><br/>
                                                    <strong className="text-xs lg:text-base">
                                                        (+ {getBRL(totalPrice * ((serviceTax || 0) / 100))} Taxa de serviço)
                                                    </strong>
                                                </td>
                                                <td className="text-neutral-500 py-4 align-top text-xs lg:text-base">{moment(product.schedule).format('DD/MM/YYYY')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                        <div className="lg:hidden">
                            <div className="sticky top-[100px] p-4 rounded-2xl bg-white border border-black">
                                <h5 className="text-xl">Resumo da compra</h5>
                                <div className="mt-5 space-y-2">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Subtotal ({totalAmount} itens)</span>
                                        <span className="text-gray-600">{getBRL(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Taxa de serviço</span>
                                        <span className="text-gray-600">
                                            {getBRL(totalPrice * ((serviceTax || 0) / 100))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-600">Total</span>
                                        <span className="text-gray-600">
                                            {getBRL(totalPrice + (totalPrice * ((serviceTax || 0) / 100)))}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    className="w-full bg-lime-600 hover:bg-lime-500 text-white px-5 py-2 rounded-full mt-8 transition-colors duration-200"
                                    onClick={handleSubmit}
                                >
                                    Finalizar compra
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-xl mt-32">Adicionar produtos relacionados</h4>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-16 mt-4">
                                {relatedProducts
                                ?.filter(
                                    (product) => 
                                        !items
                                        .map(({ product }) => product.id)
                                        .includes(product.id)
                                )
                                ?.slice(0, 2)
                                ?.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="sticky top-[100px] p-4 rounded-2xl bg-white border border-black">
                            <h5 className="text-xl">Resumo da compra</h5>
                            <div className="mt-5 space-y-2">
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Subtotal ({totalAmount} itens)</span>
                                    <span className="text-gray-600">{getBRL(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Taxa de serviço</span>
                                    <span className="text-gray-600">
                                        {getBRL(totalPrice * ((serviceTax || 0) / 100))}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-gray-600">
                                        {getBRL(totalPrice + (totalPrice * ((serviceTax || 0) / 100)))}
                                    </span>
                                </div>
                            </div>
                            <button 
                                className="flex gap-4 items-center justify-center w-full bg-lime-600 hover:bg-lime-500 text-white px-5 py-2 rounded-full mt-8 transition-colors duration-200"
                                onClick={handleSubmit}
                            >
                                {isLoading && (
                                    <div className='w-4 h-4 border-4 border-white border-t-gray-300 rounded-full animate-spin' />
                                )}
                                Finalizar compra
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Cart
