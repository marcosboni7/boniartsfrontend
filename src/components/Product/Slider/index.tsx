'use client'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import ProductCard from '../Card'

import 'swiper/css'
import 'swiper/css/navigation'

import type { FC } from 'react'
import { Product } from '@/types/product.type'

const ProductSlider: FC<{ data: Product[] }> = ({ data }) => {
    return (
        <Swiper
            modules={[Navigation]}
            navigation={true}
            slidesPerView={1.5}
            slidesPerGroup={1}
            spaceBetween={24}
            className={
                data.length <= 1
                    ? 'first-child-apply-justify-center'
                    : '!overflow-visible'
            }
            breakpoints={{
                640: {
                    slidesPerView: 1.5,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 6,
                },
                1280: {
                    slidesPerView: 5.5,
                    slidesPerGroup: 10,
                },
            }}
        >
            {data.map((product) => (
                <SwiperSlide key={product.id} className="py-4">
                    <ProductCard key={product.id} {...product} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default ProductSlider
