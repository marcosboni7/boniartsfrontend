import { Product } from '@/types/product.type'
import api from '@/utils/api'

import Image from 'next/image'
import { headers } from 'next/headers'

import type { NextPage } from 'next'
import PurchaseForm from '@/components/Product/PurchaseForm'

import { Calendar, CaretDown, Clock, MapPin, PiggyBank } from '@/icons'

import serverFetch from '@/utils/serverFetch'
import moment from 'moment'
import 'moment/locale/pt-br'
import ProductCard from '@/components/Product/Card'

const getProduct = async (id: string) => {
    const { data: product } = await serverFetch<Product>(`products/${id}`)
    return product
}

const getRelatedProducts = async () => {
    const { data: products } = await serverFetch<Product[]>(`products?take=3&skip=0`)
    return products
};

const ProductPage: NextPage<{ params: { id: string } }> = async ({
    params,
}) => {
    const product = await getProduct(params.id)
    const relatedProducts = await getRelatedProducts();
    const userIpAddress = headers().get('X-Forwarded-For')!

    moment().locale('pt-br')

    return (
        <main className={`bg-neutral-50 pb-16`}>
            <div 
                className={`relative w-full h-[210px] lg:h-[400px] bg-transparent`}
                style={{ 
                    backgroundImage: `url(${api.defaults.baseURL}/uploads/${product?.banner})`,
                }}
            >
                <div className="absolute inset-0 bg-gray-300/10 backdrop-blur-xl"></div>
                <Image
                    src={`${api.defaults.baseURL}/uploads/${product?.banner}`}
                    alt="Banner"
                    width={768}
                    height={400}
                    className="relative z-10 h-[210px] lg:h-[400px] mx-auto top-0 lg:top-[32px] object-cover rounded-xl"
                />
            </div>
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,auto),400px] gap-8 w-full xl:w-[1200px] mx-auto mt-4 lg:mt-28 px-4 lg:px-0">
                <div>
                    <div className="flex flex-row w-full items-start justify-between gap-8">
                        <div className="rounded overflow-hidden w-full">
                            <h3 className='font-bold text-2xl'>{product.name}</h3>
                            <div className='space-y-2 mt-6'>
                                <div className="flex items-center gap-2">
                                    <Calendar />
                                    {moment(product.schedule).format('dddd, D [de] MMMM [de] YYYY')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock />
                                    {moment(product.schedule).format('HH:mm')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin />
                                    {product.location}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-6 xl:hidden">
                        <PurchaseForm
                            client={{ ipAddress: userIpAddress }}
                            {...product}
                        />
                    </div>
                    <div className="mt-12">
                        <div className="flex w-full flex-row justify-between mb-4">
                            <h4 className="font-bold text-xl">Descrição</h4>
                        </div>
                        <div
                            className="text-gray-500 whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        />
                    </div>
                    <div className="hidden xl:block">
                        <h4 className="font-bold text-xl mt-32">Produtos relacionados</h4>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {relatedProducts
			    ?.slice(0, 2)
                            ?.filter(({ id }) => id !== product.id)
                            ?.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hidden xl:block">
                    <PurchaseForm
                        client={{ ipAddress: userIpAddress }}
                        {...product}
                    />
                </div>
            </section>
        </main>
    )
}

export default ProductPage
