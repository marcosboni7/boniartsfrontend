'use client'
import { Product } from '@/types/product.type';
import useAPI from '@/utils/useAPI';
import type { FC } from 'react';
import ProductCard from '../Card';

const RecommendedProducts: FC = () => {
    const { data: products } = useAPI<Product[]>('products');

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
          {products?.slice(0, 4).map((product) => (
            <div key={product.id} className="w-[260px] mx-auto sm:mx-0">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
    );
};

export default RecommendedProducts;