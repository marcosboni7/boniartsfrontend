'use client'
import { useParams } from "next/navigation"
import Image from 'next/image';

import ProductCard from "@/components/Product/Card";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";
import useAPI from "@/utils/useAPI"
import api from "@/utils/api";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Category = () => {
    const params = useParams();

    const { data: categories } = useAPI<Category[]>('categories')
    const { data: category } = useAPI<Category>(`/categories/${params.category}`)
    const { data: products } = useAPI<Product[]>(!params.category ? null : `/products/category/${params.category}`)

    return (
        <main className="w-full xl:w-[1200px] mx-auto py-4 lg:py-12 px-4 lg:px-0">
            <Swiper
                slidesPerView={7}
                modules={[Navigation]}
                navigation
            >
                {categories?.map((lcategory) => (
                    <SwiperSlide key={lcategory.id} className=" py-6 font-bold">
                        <Link 
                            href={`/categoria/${lcategory.id}`} 
                            className={`block hover:underline pb-2 ${category?.id === lcategory.id ? `border-b-8 border-black` : ''}`}
                        >
                            <Image                                     
                                src={`${api.defaults.baseURL}/uploads/${lcategory?.icon}`}
                                alt={lcategory?.name}
                                width={50}
                                height={50}
                                className="mx-auto w-7 h-7 lg:w-auto lg:h-auto"
                            />
                            <p className="text-center mt-4 text-xs lg:text-base">
                                {lcategory.name}
                            </p>                        
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex gap-4 text-sm mt-10">
                <span className="text-[#572c88]">Home</span>
                <span>|</span>
                <span className="text-gray-500">Categoria {category?.name}</span>
            </div>
            <Image 
                src={`${api.defaults.baseURL}/uploads/${category?.banner ?? ''}`}
                alt=""
                width={1200}
                height={380}
                className="max-h-96 w-full h-72 xl:h-auto xl:w-auto object-cover mt-8 mb-12"
            />
            <div className="w-12 h-2 bg-black rounded-full" />
            <h4 className="font-bold text-2xl mt-4 mb-3">{category?.name}</h4>
            <p>{category?.description}</p>
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                {products?.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </section>
        </main>
    )
}

export default Category