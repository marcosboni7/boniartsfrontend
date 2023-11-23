'use client';
import { Trash } from '@/icons';
import api from '@/utils/api';
import useAPI from '@/utils/useAPI';
import { toast } from 'react-toastify';

const Facebooks = () => {
  const { data: accounts, mutate } =
    useAPI<{ id: string; identifier: string; password: string }[]>('/facebook');

  const handleAccountDelete = async (accountId: string) => {
    toast.promise(
      api.delete(`/facebook/${accountId}`).then(() => mutate()),
      {
        success: 'Conta excluída com sucesso.',
        pending: 'Excluindo conta...',
        error: 'Não foi possível excluir esta conta.',
      }
    );
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h4>Contas do facebook</h4>
      <table className="table-fixed w-full mt-5">
        <thead>
          <tr>
            <th className="text-gray-500 font-normal text-start py-2">#</th>
            <th className="text-gray-500 font-normal text-start py-2">
              Identificador
            </th>
            <th className="text-gray-500 font-normal text-start py-2">Senha</th>
            <th className="text-gray-500 font-normal text-start py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((account) => (
            <tr key={account.id} className="even:bg-gray-50">
              <td className="py-2">{account.id}</td>
              <td className="py-2">{account.identifier}</td>
              <td className="py-2">{account.password}</td>
              <td className="py-2">
                <button
                  className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                  onClick={() => handleAccountDelete(account.id)}
                >
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facebooks;
