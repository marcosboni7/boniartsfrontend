'use client';
import { NextPage } from 'next';
import { Pagination } from '@mui/material';
import { useState } from 'react';
import { Plus, Trash, Pencil } from '@/icons';
import { toast } from 'react-toastify';

import Link from 'next/link';

import useAPI from '@/utils/useAPI';
import getBRL from '@/utils/getBRL';

import { Product } from '@/types/product.type';
import api from '@/utils/api';

//export const metadata = {
//    title: 'Painel — Produtos',
//    description: 'Painel produtos',
//};

const Produtos: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: products, mutate } = useAPI<{
    data: Product[];
    total_pages: number;
  }>(`/products?page=${currentPage}&take=10`);

  const handleProductDelete = async (productId: number) => {
    const promise = api.delete(`products/${productId}`);

    toast.promise(
      promise.then(() => mutate()),
      {
        pending: 'Excluindo...',
        success: 'Produto excluído com sucesso!',
        error: 'Não foi possível excluir o produto.',
      }
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h4>Produtos</h4>
        <Link
          href="/admin/products/create"
          className="flex items-center justify-center gap-2 bg-secondary hover:opacity-80 text-white font-bold py-2 px-4 rounded-md"
        >
          <Plus size={20} weight="bold" />
          Criar novo
        </Link>
      </div>
      <table className="table-fixed w-full mt-5">
        <thead>
          <tr>
            <th className="text-gray-500 font-normal text-start py-2">ID</th>
            <th className="text-gray-500 font-normal text-start py-2">Nome</th>
            <th className="text-gray-500 font-normal text-start py-2">Preço</th>
            <th className="text-gray-500 font-normal text-start py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products?.data?.map((product) => (
            <tr key={product.id} className="even:bg-gray-50">
              <td className="py-2">{product.id}</td>
              <td className="py-2 text-sm px-2">{product.name}</td>
              <td className="py-2">{getBRL(product.price)}</td>
              <td className="py-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/update/${product.id}`}
                    className="block hover:bg-gray-100 text-neutral-600 hover:text-blue-500 p-2 rounded-md transition-colors"
                  >
                    <Pencil size={20} />
                  </Link>
                  <button
                    className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                    onClick={() => handleProductDelete(product.id)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={products?.total_pages}
        onChange={(evt, page) => setCurrentPage(page)}
        shape="rounded"
        className="mt-4"
        hidePrevButton
        hideNextButton
      />
    </div>
  );
};

export default Produtos;
