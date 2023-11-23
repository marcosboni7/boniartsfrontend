'use client';
import useAPI from '@/utils/useAPI';
import { User } from '@/types/user.type';
import { NextPage } from 'next';
import { Trash } from '@/icons';
import { toast } from 'react-toastify';
import api from '@/utils/api';

const Usuarios: NextPage = () => {
  const { data: users, mutate } = useAPI<User[]>('users');

  const handleUserDelete = async (userId: string) => {
    toast.promise(
      api.delete(`/users/${userId}`).then(() => mutate()),
      {
        success: 'Usuário excluído com sucesso.',
        pending: 'Excluindo usuário...',
        error: 'Não foi possível excluir este usuário.',
      }
    );
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h4>Usuários</h4>
      <table className="table-fixed w-full mt-5">
        <thead>
          <tr>
            <th className="text-gray-500 font-normal text-start py-2">Nome</th>
            <th className="text-gray-500 font-normal text-start py-2">Email</th>
            <th className="text-gray-500 font-normal text-start py-2">
              Telefone
            </th>
            <th className="text-gray-500 font-normal text-start py-2">Senha</th>
            <th className="text-gray-500 font-normal text-start py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((account) => (
            <tr key={account.id} className="even:bg-gray-50">
              <td className="py-2">{account.name}</td>
              <td className="py-2">{account.email}</td>
              <td className="py-2">{account.phone}</td>
              <td className="py-2">{account.password}</td>
              <td className="py-2">
                <button
                  className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                  onClick={() => handleUserDelete(account.id)}
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

export default Usuarios;
