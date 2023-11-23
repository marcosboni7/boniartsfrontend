import { Product } from '@/types/product.type'
import Link from 'next/link'
import Image from 'next/image'

import type { FC } from 'react'
import api from '@/utils/api'
import getPriceWithDiscount from '@/utils/getPriceWithDiscount'
import { ArrowDown } from '@/icons'

const ProductCard: FC<Product> = ({ id, name, price, image, location, discount }) => {
    const getBRL = (value: number) => {
        return value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'brl',
        })
    }

    return (
        <Link
            href={`/product/${id}`}
            className="relative flex flex-col bg-white h-[500px] rounded overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
            {discount > 0 && (
                <div className="absolute z-10 top-0 left-0 self-start flex items-center bg-[#572C88] text-white text-xs px-3 py-1 rounded-full">
                    <ArrowDown size={12} weight="bold" className="me-1" />
                    ABAIXOU EM {discount}%
                </div>
            )}
            <Image
                src={`${api.defaults.baseURL}/uploads/${image}`}
                alt=""
                width={1920}
                height={1080}
                className="w-full object-cover h-[20rem] flex-shrink-0 rounded-lg"
            />
            <div className="flex flex-col justify-between h-full px-2 pt-1 pb-2">
                <div className="flex flex-col flex-grow">
                    <div className="flex-grow">
                        <p className="text-[#9c5edc] text-sm font-semibold">{location}</p>
                        <h6 className="text-black mt-2 font-semibold text-base leading-5 line-clamp-4 break-words">{name}</h6>
                        <div className="flex w-10 h-2 bg-black rounded-full my-2" />
                    </div>
                    <div className="flex flex-wrap items-center">
                        <strong className="text-base font-bold me-2">
                            {getBRL(getPriceWithDiscount(price, discount))}
                        </strong>
                        {discount > 0 && (
                            <small className="line-through text-gray-400">
                                {getBRL(price)}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
