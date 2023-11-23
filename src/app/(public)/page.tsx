'use client'
import { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import api from '@/utils/api'
import { Product } from '@/types/product.type'

import ProductSlider from '@/components/Product/Slider'

import { ArrowRight, Tag } from '@/icons'
import useAPI from '@/utils/useAPI'
import { useEffect, useState } from 'react'
import { Category } from '@/types/category.type'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Banner } from '@/types/banner.type'

const Home: NextPage = () => {
    const { data: banners } = useAPI<Banner[]>(`/banners`)
    const { data: products, isLoading } = useAPI<Product[]>('products')
    const { data: categories } = useAPI<Category[]>('categories')

    const [initialLoading, setInitialLoading] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setInitialLoading(false)
        }, 2000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <main
            className={`px-8 lg:px-20 2xl:px-40 pt-10 pb-40 overflow-x-hidden`}
        >
            <div className="w-full lg:w-[1080px] mx-auto">
                <Swiper
                    className="h-36 lg:h-80 mt-4 rounded-xl overflow-hidden shadow-lg"
                    slidesPerView={1}
                    modules={[Pagination]}
                    pagination={{
                        el: '.slider-bullets'
                    }}
                >
                    {banners?.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className="flex bg-white rounded ">
                                <Image 
                                    src={`${api.defaults.baseURL}/uploads/${banner.image}`}
                                    alt="Banner" 
                                    width={720}
                                    height={320}
                                />
                                <div className="w-80 p-4">
                                    <p className="text-[#9c5edc] text-sm">{banner.location}</p>
                                    <h4 className="text-2xl font-bold">{banner.title}</h4>
                                    <Link href={banner.url} className="inline-block mt-6 py-2 px-6 border border-black font-bold rounded-full">
                                        Saber mais
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="slider-bullets flex justify-center gap-1 mt-2"></div>
            </div>
            <div className="w-full lg:w-[1080px] mx-auto">
                <Swiper
                    slidesPerView={6}
                    modules={[Navigation]}
                    navigation
                >
                    {categories?.map((category) => (
                        <SwiperSlide key={category.id} className=" py-6 font-bold">
                            <Link href={`/categoria/${category.id}`} className="hover:underline">
                                <Image                                     
                                    src={`${api.defaults.baseURL}/uploads/${category?.icon}`}
                                    alt={category?.name}
                                    width={50}
                                    height={50}
                                    className="mx-auto"
                                />
                                <p className="text-center mt-4">
                                    {category.name}
                                </p>                        
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {categories?.map((category) => (
                    <section className="mt-6" key={category.id}>
                        <div className="flex">
                            <h4 className="text-black font-semibold text-2xl">
                                {category.name}
                            </h4>
                        </div>
                        <div className="mt-4">
                            <ProductSlider
                                data={
                                    products?.filter(
                                        (product) =>
                                            product.categoryId === category.id,
                                    ) ?? []
                                }
                            />
                        </div>
                    </section>
                ))}
            </div>
            {initialLoading && (
                <div id="loader-wrapper">
                    <div id="loader"></div>

                    <div className="loader-section section-left"></div>
                    <div className="loader-section section-right"></div>
                </div>
            )}
        </main>
    )
}

export default Home
