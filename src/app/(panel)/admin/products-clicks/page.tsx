'use client'
import { Product } from "@/types/product.type";
import api from "@/utils/api";
import useAPI from "@/utils/useAPI";
import { Eye, Trash } from "@phosphor-icons/react";
import Link from "next/link";

import type { FC } from "react";
import { toast } from "react-toastify";

const ProductsClicks: FC = () => {
    const { data: clicks } = useAPI<{ id: string, product: Product, clicks_count: number }[]>('/products/clicks');

    const handleClicksDelete = (productId: number) => {
        toast.promise(
            api.delete(`products/${productId}/clicks`),
            {
                success: 'Os cliques desse produto foram deletados com sucesso.',
                pending: 'Deletando cliques deste produto...',
                error: 'Não foi possível deletar os cliques desse produto.'
            }
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h4>Cliques nos produtos</h4>
            <table className="table-fixed w-full mt-5">
                <thead>
                    <tr>
                        <th className="text-gray-500 font-normal text-start py-2">Nome</th>
                        <th className="text-gray-500 font-normal text-start py-2">Cliques</th>
                        <th className="text-gray-500 font-normal text-start py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                {clicks?.map((click) => (
                    <tr key={click.product.id} className="even:bg-gray-50">
                        <td className="py-2 text-xs">{click.product.name}</td>
                        <td className="py-2">{click.clicks_count}</td>
                        <td className="py-2">
                            <div className="flex gap-2">
                                
                                <button
                                    className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                                    onClick={() => handleClicksDelete(click.product.id)}
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsClicks;