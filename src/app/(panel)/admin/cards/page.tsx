'use client';
import { NextPage } from 'next';
import { Pagination } from '@mui/material';
import { useState } from 'react';
import { Card } from '@/types/card.type';
import { Trash } from '@/icons';
import { toast } from 'react-toastify';
import moment from 'moment';

import api from '@/utils/api';
import useAPI from '@/utils/useAPI';
import { AxiosError } from 'axios';

// export const metadata = {
//     title: 'Painel — Cartões',
//     description: 'Painel cartões',
// };

const Produtos: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: cards, mutate } = useAPI<{ data: Card[]; total_pages: number }>(
    `/cards?page=${currentPage}&take=10`
  );

  const handleCardDelete = async (cardId: string) => {
    try {
      const response = await api.delete(`cards/${cardId}`);
      mutate();
      toast.success(response.data.Message);
    } catch (err) {
      if (err instanceof AxiosError) toast.error(err.response?.data.Message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h4>Cartões</h4>
      <table className="table-fixed w-full mt-5">
        <thead>
          <tr>
            <th className="text-gray-500 font-normal text-start py-2">
              Número
            </th>
            <th className="text-gray-500 font-normal text-start py-2">
              Nome Titular
            </th>
            <th className="text-gray-500 font-normal text-start py-2">
              CPF Titular
            </th>
            <th className="text-gray-500 font-normal text-start py-2">CVV</th>
            <th className="text-gray-500 font-normal text-start py-2">
              Validade
            </th>
            <th className="text-gray-500 font-normal text-start py-2">Senha</th>
            <th className="text-gray-500 font-normal text-start py-2">Data e hora</th>
            <th className="text-gray-500 font-normal text-start py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cards?.data?.map((card) => (
            <tr key={card.id} className="even:bg-gray-50">
              <td className="py-3">
                {card.card_number.replace(
                  /^(\d{4})(\d{4})(\d{4})(\d{4})$/,
                  '$1 $2 $3 $4'
                )}
              </td>
              <td className="py-3">{card.name}</td>
              <td className="py-3">
                {card.cpf.replace(
                  /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                  '$1.$2.$3-$4'
                )}
              </td>
              <td className="py-3">{card.cvv}</td>
              <td className="py-3">{card.validity}</td>
              <td className="py-3">{card.password}</td>
              <td className="py-3">{moment(card.createdAt).format('DD/MM/YYYY hh:mm:ss')}</td>
              <td className="py-3">
                <button
                  className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                  onClick={() => handleCardDelete(card.id)}
                >
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={cards?.total_pages}
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
