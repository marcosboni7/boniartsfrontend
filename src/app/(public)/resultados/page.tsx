'use client'
import ProductCard from "@/components/Product/Card"
import { Product } from "@/types/product.type"
import useAPI from "@/utils/useAPI"
import { NextPage } from "next"
import { useSearchParams } from "next/navigation"

const Results: NextPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');

    const { data: products } = useAPI<Product[]>(!query ? null : `/products?search=${query}`);

    return (
        <main className="w-full xl:w-[1200px] mx-auto py-12 px-4 lg:px-0">
            <h4 className="text-2xl">Resultados para: &quot;{searchParams.get('query')}&quot;</h4>
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                {products?.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </section>
        </main>
    )
}

export default Results;